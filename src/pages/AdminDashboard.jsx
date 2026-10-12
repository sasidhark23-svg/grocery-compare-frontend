import React, { useCallback, useEffect, useState } from 'react';
import { Shield, Trash2, Edit, Store as StoreIcon, Package, Tag, RefreshCw } from 'lucide-react';
import { productService } from '../services/productService';
import { storeService } from '../services/storeService';
import { priceService } from '../services/priceService';
import LoadingSpinner from '../components/LoadingSpinner';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [stores, setStores] = useState([]);
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Product Form State
  const emptyProduct = { name: '', brand: '', category: 'Dairy', unit: '', description: '', imageUrl: '', barcode: '' };
  const [prodForm, setProdForm] = useState(emptyProduct);
  const [editingProdId, setEditingProdId] = useState(null);

  // Store Form State
  const [storeForm, setStoreForm] = useState({ storeName: '', storeLogo: '', location: '', website: '', rating: 4.5 });
  const [editingStoreId, setEditingStoreId] = useState(null);

  // Price Form State
  const [priceForm, setPriceForm] = useState({ productId: '', storeId: '', price: '', discount: 0, stockStatus: 'IN_STOCK' });

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      const [prodData, storeData, priceData] = await Promise.all([
        productService.getAllProducts(),
        storeService.getAllStores(),
        priceService.getAllPrices(),
      ]);
      setProducts(prodData);
      setStores(storeData);
      setPrices(priceData);

      if (prodData.length > 0 && storeData.length > 0) {
        setPriceForm(prev => prev.productId ? prev : ({ ...prev, productId: prodData[0].id, storeId: storeData[0].id }));
      }
    } catch (err) {
      console.error("Failed to load admin data", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Product Handlers
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      if (editingProdId) {
        await productService.updateProduct(editingProdId, prodForm);
      } else {
        await productService.addProduct(prodForm);
      }
      setProdForm(emptyProduct);
      setEditingProdId(null);
      fetchAllData();
    } catch (err) {
      alert("Failed to save product");
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Delete product and all associated store prices?")) return;
    try {
      await productService.deleteProduct(id);
      fetchAllData();
    } catch (err) {
      alert("Failed to delete product");
    }
  };

  // Store Handlers
  const handleSaveStore = async (e) => {
    e.preventDefault();
    try {
      if (editingStoreId) {
        await storeService.updateStore(editingStoreId, storeForm);
      } else {
        await storeService.addStore(storeForm);
      }
      setStoreForm({ storeName: '', storeLogo: '', location: '', website: '', rating: 4.5 });
      setEditingStoreId(null);
      fetchAllData();
    } catch (err) {
      alert("Failed to save store");
    }
  };

  const handleDeleteStore = async (id) => {
    if (!window.confirm("Delete store and all its price listings?")) return;
    try {
      await storeService.deleteStore(id);
      fetchAllData();
    } catch (err) {
      alert("Failed to delete store");
    }
  };

  // Price Handlers
  const handleSavePrice = async (e) => {
    e.preventDefault();
    try {
      await priceService.addPrice(
        priceForm.productId,
        priceForm.storeId,
        parseFloat(priceForm.price),
        parseFloat(priceForm.discount || 0),
        priceForm.stockStatus
      );
      setPriceForm(prev => ({ ...prev, price: '', discount: 0 }));
      fetchAllData();
    } catch (err) {
      alert("Failed to save store price");
    }
  };

  if (loading) return <LoadingSpinner text="Loading admin control panel..." />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center space-x-1.5 bg-purple-500/20 text-purple-200 text-xs font-bold px-3 py-1 rounded-full border border-purple-400/30">
            <Shield className="w-3.5 h-3.5" />
            <span>Administrator Dashboard</span>
          </span>
          <h1 className="text-3xl font-black mt-2">Catalog & Price Management</h1>
          <p className="text-xs text-purple-200 mt-1">Add products, supermarket stores & manage price entries</p>
        </div>

        <button
          onClick={fetchAllData}
          className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl transition"
          title="Refresh Data"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex space-x-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('products')}
          className={`py-3 px-5 text-sm font-bold border-b-2 transition flex items-center space-x-2 ${
            activeTab === 'products' ? 'border-purple-600 text-purple-700' : 'border-transparent text-gray-500'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Products ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('stores')}
          className={`py-3 px-5 text-sm font-bold border-b-2 transition flex items-center space-x-2 ${
            activeTab === 'stores' ? 'border-purple-600 text-purple-700' : 'border-transparent text-gray-500'
          }`}
        >
          <StoreIcon className="w-4 h-4" />
          <span>Stores ({stores.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('prices')}
          className={`py-3 px-5 text-sm font-bold border-b-2 transition flex items-center space-x-2 ${
            activeTab === 'prices' ? 'border-purple-600 text-purple-700' : 'border-transparent text-gray-500'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>Manage Store Prices</span>
        </button>
      </div>

      {/* PRODUCTS TAB */}
      {activeTab === 'products' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add/Edit Product Form */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4 h-fit">
            <h3 className="text-lg font-black text-gray-900">
              {editingProdId ? 'Edit Product' : 'Add New Product'}
            </h3>
            <form onSubmit={handleSaveProduct} className="space-y-3">
              <div>
                <label htmlFor="product-name" className="block text-xs font-bold text-gray-700 uppercase mb-1">Product Name</label>
                <input
                  id="product-name"
                  type="text"
                  required
                  placeholder="e.g. Amul Milk 1L"
                  value={prodForm.name}
                  onChange={(e) => setProdForm({ ...prodForm, name: e.target.value })}
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="product-brand" className="block text-xs font-bold text-gray-700 uppercase mb-1">Brand</label>
                  <input
                    id="product-brand"
                    type="text"
                    placeholder="e.g. Amul"
                    value={prodForm.brand}
                    onChange={(e) => setProdForm({ ...prodForm, brand: e.target.value })}
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label htmlFor="product-category" className="block text-xs font-bold text-gray-700 uppercase mb-1">Category</label>
                  <select
                    id="product-category"
                    value={prodForm.category}
                    onChange={(e) => setProdForm({ ...prodForm, category: e.target.value })}
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {['Dairy', 'Vegetables', 'Fruits', 'Rice & Grains', 'Pulses', 'Oils & Ghee', 'Atta & Flour', 'Spices & Salt', 'Snacks', 'Beverages', 'Household Essentials'].map((category) => <option key={category} value={category}>{category}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="product-unit" className="block text-xs font-bold text-gray-700 uppercase mb-1">Pack Size / Unit</label>
                <input
                  id="product-unit"
                  type="text"
                  placeholder="e.g. 1 kg, 500 ml, pack of 4"
                  value={prodForm.unit || ''}
                  onChange={(e) => setProdForm({ ...prodForm, unit: e.target.value })}
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label htmlFor="product-image" className="block text-xs font-bold text-gray-700 uppercase mb-1">Image URL</label>
                <input
                  id="product-image"
                  type="text"
                  placeholder="https://..."
                  value={prodForm.imageUrl}
                  onChange={(e) => setProdForm({ ...prodForm, imageUrl: e.target.value })}
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label htmlFor="product-description" className="block text-xs font-bold text-gray-700 uppercase mb-1">Description</label>
                <textarea
                  id="product-description"
                  rows="2"
                  placeholder="Product specification..."
                  value={prodForm.description}
                  onChange={(e) => setProdForm({ ...prodForm, description: e.target.value })}
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-xl shadow"
                >
                  {editingProdId ? 'Update Product' : 'Add Product'}
                </button>
                {editingProdId && (
                  <button
                    type="button"
                    onClick={() => { setEditingProdId(null); setProdForm(emptyProduct); }}
                    className="px-3 py-2.5 bg-gray-100 text-gray-600 font-bold text-xs rounded-xl"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Products Table */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-100">
            {products.map((p) => (
              <div key={p.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img src={p.imageUrl || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400"} alt={p.name} className="w-12 h-12 rounded-xl object-cover border" />
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{p.name}</h4>
                    <span className="text-xs text-gray-400">{p.brand} | {p.category}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => { setEditingProdId(p.id); setProdForm(p); }}
                    className="p-2 text-purple-600 hover:bg-purple-50 rounded-xl"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(p.id)}
                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STORES TAB */}
      {activeTab === 'stores' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Store Form */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4 h-fit">
            <h3 className="text-lg font-black text-gray-900">
              {editingStoreId ? 'Edit Store' : 'Add Supermarket Store'}
            </h3>
            <form onSubmit={handleSaveStore} className="space-y-3">
              <div>
                <label htmlFor="store-name" className="block text-xs font-bold text-gray-700 uppercase mb-1">Store Name</label>
                <input
                  id="store-name"
                  type="text"
                  required
                  placeholder="e.g. DMart"
                  value={storeForm.storeName}
                  onChange={(e) => setStoreForm({ ...storeForm, storeName: e.target.value })}
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label htmlFor="store-location" className="block text-xs font-bold text-gray-700 uppercase mb-1">Location</label>
                <input
                  id="store-location"
                  type="text"
                  placeholder="e.g. Mumbai, MH"
                  value={storeForm.location}
                  onChange={(e) => setStoreForm({ ...storeForm, location: e.target.value })}
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label htmlFor="store-logo" className="block text-xs font-bold text-gray-700 uppercase mb-1">Store Logo URL</label>
                <input
                  id="store-logo"
                  type="text"
                  placeholder="https://..."
                  value={storeForm.storeLogo}
                  onChange={(e) => setStoreForm({ ...storeForm, storeLogo: e.target.value })}
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label htmlFor="store-rating" className="block text-xs font-bold text-gray-700 uppercase mb-1">Rating (0 - 5)</label>
                <input
                  id="store-rating"
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={storeForm.rating}
                  onChange={(e) => setStoreForm({ ...storeForm, rating: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-xl shadow"
              >
                {editingStoreId ? 'Update Store' : 'Save Store'}
              </button>
            </form>
          </div>

          {/* Stores List */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-100">
            {stores.map((s) => (
              <div key={s.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img src={s.storeLogo || "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=100"} alt={s.storeName} className="w-10 h-10 rounded-xl object-cover border" />
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{s.storeName}</h4>
                    <span className="text-xs text-gray-400">{s.location} | Rating: {s.rating}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleDeleteStore(s.id)}
                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PRICES TAB */}
      {activeTab === 'prices' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Price Entry Form */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4 h-fit">
            <h3 className="text-lg font-black text-gray-900">Set Store Product Price</h3>
            <form onSubmit={handleSavePrice} className="space-y-3">
              <div>
                <label htmlFor="price-product" className="block text-xs font-bold text-gray-700 uppercase mb-1">Select Product</label>
                <select
                  id="price-product"
                  value={priceForm.productId}
                  onChange={(e) => setPriceForm({ ...priceForm, productId: e.target.value })}
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="price-store" className="block text-xs font-bold text-gray-700 uppercase mb-1">Select Store</label>
                <select
                  id="price-store"
                  value={priceForm.storeId}
                  onChange={(e) => setPriceForm({ ...priceForm, storeId: e.target.value })}
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {stores.map(s => (
                    <option key={s.id} value={s.id}>{s.storeName}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="price-amount" className="block text-xs font-bold text-gray-700 uppercase mb-1">Price (₹)</label>
                  <input
                    id="price-amount"
                    type="number"
                    step="0.01"
                    required
                    placeholder="52.00"
                    value={priceForm.price}
                    onChange={(e) => setPriceForm({ ...priceForm, price: e.target.value })}
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label htmlFor="price-discount" className="block text-xs font-bold text-gray-700 uppercase mb-1">Discount (₹)</label>
                  <input
                    id="price-discount"
                    type="number"
                    step="0.01"
                    value={priceForm.discount}
                    onChange={(e) => setPriceForm({ ...priceForm, discount: e.target.value })}
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="price-stock" className="block text-xs font-bold text-gray-700 uppercase mb-1">Stock Status</label>
                <select
                  id="price-stock"
                  value={priceForm.stockStatus}
                  onChange={(e) => setPriceForm({ ...priceForm, stockStatus: e.target.value })}
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="IN_STOCK">IN_STOCK</option>
                  <option value="LOW_STOCK">LOW_STOCK</option>
                  <option value="OUT_OF_STOCK">OUT_OF_STOCK</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-xl shadow"
              >
                Save Store Price
              </button>
            </form>
          </div>

          {/* Active Prices Table */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-100">
            {prices.map((pr) => (
              <div key={pr.id} className="p-4 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">{pr.product?.name}</h4>
                  <p className="text-xs text-gray-500">
                    Store: <span className="font-semibold text-gray-800">{pr.store?.storeName}</span> | Status: {pr.stockStatus}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-base font-black text-purple-800">₹{pr.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
