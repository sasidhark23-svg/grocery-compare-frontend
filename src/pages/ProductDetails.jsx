import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, Bell, Plus, ArrowLeft, Tag, CheckCircle2 } from 'lucide-react';
import { productService } from '../services/productService';
import { priceService } from '../services/priceService';
import { favoriteService } from '../services/favoriteService';
import { alertService } from '../services/alertService';
import { shoppingListService } from '../services/shoppingListService';
import { useAuthStore } from '../store/authStore';
import PriceComparisonTable from '../components/PriceComparisonTable';
import PriceHistoryChart from '../components/PriceHistoryChart';
import LoadingSpinner from '../components/LoadingSpinner';

export default function ProductDetails() {
  const { id } = useParams();
  const { isAuthenticated } = useAuthStore();

  const [product, setProduct] = useState(null);
  const [summary, setSummary] = useState({});
  const [history, setHistory] = useState([]);
  const [userLists, setUserLists] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isFavorited, setIsFavorited] = useState(false);
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [listModalOpen, setListModalOpen] = useState(false);
  const [targetPrice, setTargetPrice] = useState('');
  const [selectedListId, setSelectedListId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    async function loadProductDetails() {
      setLoading(true);
      try {
        const prodData = await productService.getProductById(id);
        setProduct(prodData);

        const [summaryData, historyData] = await Promise.all([
          priceService.getSummary(id),
          priceService.getHistory(id).catch(() => []),
        ]);

        setSummary(summaryData);
        setHistory(historyData);

        if (isAuthenticated) {
          try {
            const favs = await favoriteService.getUserFavorites();
            const exists = favs.some(f => f.product?.id === Number(id));
            setIsFavorited(exists);

            const lists = await shoppingListService.getUserLists();
            setUserLists(lists);
            if (lists.length > 0) setSelectedListId(lists[0].id);
          } catch (e) {
            console.error("Failed to load user info", e);
          }
        }
      } catch (err) {
        console.error("Failed to load product details", err);
      } finally {
        setLoading(false);
      }
    }

    loadProductDetails();
  }, [id, isAuthenticated]);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) return alert("Please login to favorite products.");
    try {
      if (isFavorited) {
        await favoriteService.removeFavoriteProduct(id);
        setIsFavorited(false);
        showToast("Removed from favorites");
      } else {
        await favoriteService.addFavoriteProduct(id);
        setIsFavorited(true);
        showToast("Added to favorites!");
      }
    } catch (e) {
      alert("Failed to update favorite status");
    }
  };

  const handleCreateAlert = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return alert("Please login to set price alerts.");
    if (!targetPrice) return;
    try {
      await alertService.createAlert(id, parseFloat(targetPrice));
      setAlertModalOpen(false);
      showToast(`Alert set for ₹${targetPrice}!`);
    } catch (e) {
      alert("Failed to set price alert");
    }
  };

  const handleAddToList = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return alert("Please login to add to shopping list.");
    if (!selectedListId) return;
    try {
      await shoppingListService.addItem(selectedListId, id, quantity);
      setListModalOpen(false);
      showToast("Added to shopping list!");
    } catch (e) {
      alert("Failed to add to shopping list");
    }
  };

  if (loading) return <LoadingSpinner text="Loading product details and store comparison..." />;
  if (!product) return <div className="text-center p-12 font-bold">Product not found.</div>;


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white text-sm font-semibold px-4 py-3 rounded-2xl shadow-xl flex items-center space-x-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Back link */}
      <Link to="/search" className="inline-flex items-center space-x-1 text-xs font-bold text-gray-500 hover:text-emerald-600 transition">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Search</span>
      </Link>

      <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900" role="note">
        Demo listing · Sample prices and availability are illustrative, not verified live retailer data.
      </p>

      {/* Product Overview Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        {/* Image */}
        <div className="w-full h-64 sm:h-72 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 flex items-center justify-center">
          <img
            src={product.imageUrl}
            alt={product.name}
            className={`w-full h-full ${['images.openfoodfacts.org', 'images.openproductsfacts.org', 'images.openbeautyfacts.org'].some((domain) => product.imageUrl?.includes(domain)) ? 'object-contain p-3 bg-white' : 'object-cover'}`}
            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.classList.add('hidden'); }}
          />
        </div>

        {/* Details & Actions */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">
              {product.category || 'Grocery'}
            </span>
            <button
              onClick={handleToggleFavorite}
              className={`p-2.5 rounded-xl border transition ${
                isFavorited ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-gray-50 border-gray-200 text-gray-400 hover:text-rose-500'
              }`}
              title="Favorite Product"
            >
              <Heart className={`w-5 h-5 ${isFavorited ? 'fill-rose-500' : ''}`} />
            </button>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">{product.name}</h1>
          {product.brand && (
            <p className="text-sm font-semibold text-gray-500">Brand: <span className="text-gray-900">{product.brand}</span></p>
          )}
          {product.unit && <p className="text-sm font-semibold text-gray-500">Pack size: <span className="text-gray-900">{product.unit}</span></p>}
          {product.description && (
            <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
          )}

          {/* Key Summary Stats */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="bg-emerald-50 rounded-2xl p-3 border border-emerald-100 text-center">
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">Best Price</span>
              <span className="text-xl font-black text-emerald-700">{summary.cheapestPrice != null ? `₹${summary.cheapestPrice}` : '—'}</span>
            </div>
            <div className="bg-gray-50 rounded-2xl p-3 border border-gray-100 text-center">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Highest Price</span>
              <span className="text-xl font-black text-gray-900">{summary.highestPrice != null ? `₹${summary.highestPrice}` : '—'}</span>
            </div>
            <div className="bg-teal-50 rounded-2xl p-3 border border-teal-100 text-center">
              <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider block">You Save</span>
              <span className="text-xl font-black text-teal-700">{summary.priceDifference != null ? `₹${summary.priceDifference}` : '—'}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-gray-100">
            <button
              onClick={() => setListModalOpen(true)}
              className="flex-1 min-w-[160px] py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition flex items-center justify-center space-x-2 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add to Shopping List</span>
            </button>
            <button
              onClick={() => setAlertModalOpen(true)}
              className="py-3 px-4 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold rounded-xl text-sm transition flex items-center space-x-2 border border-amber-200"
            >
              <Bell className="w-4 h-4 text-amber-600" />
              <span>Set Price Alert</span>
            </button>
          </div>
        </div>
      </div>

      {/* Comparison Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-black text-gray-900 flex items-center space-x-2">
          <Tag className="w-6 h-6 text-emerald-600" />
          <span>Sample Store Price Comparison</span>
        </h2>
        <PriceComparisonTable deals={summary.deals || []} summary={summary} />
      </section>

      {/* Price History Chart Section */}
      <section className="space-y-4 pt-4">
        <PriceHistoryChart historyData={history} />
      </section>

      {/* Set Alert Modal */}
      {alertModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 border border-gray-100 shadow-2xl">
            <h3 className="text-xl font-black text-gray-900">Set Price Drop Alert</h3>
            <p className="text-xs text-gray-500">
              Notify me when the price of <span className="font-semibold text-gray-800">{product.name}</span> drops below your target price.
            </p>
            <form onSubmit={handleCreateAlert} className="space-y-4">
              <div>
                <label htmlFor="alert-target-price" className="block text-xs font-bold text-gray-700 uppercase mb-1">Target Price (₹)</label>
                <input
                  id="alert-target-price"
                  type="number"
                  step="0.01"
                  required
                  placeholder={`e.g. ${Math.floor((summary.cheapestPrice || 50) * 0.9)}`}
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAlertModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow"
                >
                  Save Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add to List Modal */}
      {listModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 border border-gray-100 shadow-2xl">
            <h3 className="text-xl font-black text-gray-900">Add to Shopping List</h3>
            {userLists.length === 0 ? (
              <div className="space-y-3 text-center py-4">
                <p className="text-sm text-gray-500">You don't have any shopping lists yet.</p>
                <Link
                  to="/lists"
                  className="inline-block px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl"
                >
                  Create Shopping List
                </Link>
              </div>
            ) : (
              <form onSubmit={handleAddToList} className="space-y-4">
                <div>
                  <label htmlFor="shopping-list-select" className="block text-xs font-bold text-gray-700 uppercase mb-1">Select List</label>
                  <select
                    id="shopping-list-select"
                    value={selectedListId}
                    onChange={(e) => setSelectedListId(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {userLists.map(l => (
                      <option key={l.id} value={l.id}>{l.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="shopping-list-quantity" className="block text-xs font-bold text-gray-700 uppercase mb-1">Quantity</label>
                  <input
                    id="shopping-list-quantity"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="flex items-center justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setListModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow"
                  >
                    Add Product
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
