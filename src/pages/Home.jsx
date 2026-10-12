import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingDown, Bell, ListChecks, Sparkles } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import ProductCard from '../components/ProductCard';
import StoreCard from '../components/StoreCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { productService } from '../services/productService';
import { storeService } from '../services/storeService';

export default function Home() {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [stores, setStores] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const categories = [
    'All',
    'Dairy',
    'Rice & Grains',
    'Oils & Ghee',
    'Atta & Flour',
    'Spices & Salt',
    'Snacks & Packaged Food',
    'Beverages',
    'Fruits',
    'Vegetables',
    'Pulses',
    'Household Essentials',
    'Snacks'
  ];

  useEffect(() => {
    async function fetchData() {
      try {
        const [prodData, storeData] = await Promise.all([
          productService.getAllProducts(),
          storeService.getAllStores(),
        ]);
        setAllProducts(prodData);
        setFilteredProducts(prodData);
        setStores(storeData);
      } catch (err) {
        console.error("Failed to load home data", err);
        setLoadError('We could not load the catalog. Check your connection and try again.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleCategoryFilter = (cat) => {
    setSelectedCategory(cat);
    if (cat === 'All') {
      setFilteredProducts(allProducts);
    } else {
      setFilteredProducts(allProducts.filter(p => p.category?.toLowerCase() === cat.toLowerCase()));
    }
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/70 via-white to-gray-50 pt-16 pb-20 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 bg-emerald-100/80 text-emerald-800 text-xs font-extrabold px-4 py-1.5 rounded-full mb-6 shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Smart Grocery Price Comparison Engine</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-6xl font-black text-gray-950 tracking-tight leading-none mb-6 max-w-4xl mx-auto"
          >
            Compare Grocery Prices.<br />
            <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
              Shop Smarter. Save More.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-600 text-lg sm:text-xl max-w-2xl mx-auto mb-8 font-normal"
          >
            Browse sample listings across popular stores and compare clearly labelled demo prices on everyday essentials.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex justify-center"
          >
            <SearchBar className="shadow-lg" />
          </motion.div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-start space-x-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
              <TrendingDown className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base mb-1">Cheapest Deal Engine</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
              Find the lowest sample store listing and compare its price with other sample offers.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-start space-x-4">
            <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center flex-shrink-0">
              <ListChecks className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base mb-1">List Cost Optimizer</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
              Estimate list totals from sample prices and compare store-by-store breakdowns.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-start space-x-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base mb-1">Price Drop Alerts</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
              Set a target price and see when an illustrative listing meets your threshold.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Category Pills & Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-gray-900">Featured Grocery Products</h2>
            <p className="text-sm text-gray-500">Explore products and compare sample store listings</p>
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryFilter(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900" role="note">
          Demo catalog · Sample prices and availability are illustrative and are not live retailer data.
        </p>

        {loading ? (
          <LoadingSpinner text="Fetching grocery database..." />
        ) : loadError ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-800" role="alert">{loadError}</div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-8 text-center border border-gray-100 text-gray-500 text-sm font-medium">
            No products found in this category.
          </div>
        )}
      </section>

      {/* Popular Stores Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-gray-900">Partner Supermarkets & Quick Commerce</h2>
            <p className="text-sm text-gray-500">Store listings for comparison demonstrations</p>
          </div>
        </div>

        {stores.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {stores.map((store) => <StoreCard key={store.id} store={store} />)}
          </div>
        ) : !loading && !loadError ? (
          <div className="rounded-2xl border border-gray-100 bg-white p-6 text-sm text-gray-600">No store listings are available yet.</div>
        ) : null}
      </section>
    </div>
  );
}
