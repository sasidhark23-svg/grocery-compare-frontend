import React, { useEffect, useState } from 'react';
import { Heart, Trash2 } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import StoreCard from '../components/StoreCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { favoriteService } from '../services/favoriteService';

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('products');

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const data = await favoriteService.getUserFavorites();
      setFavorites(data);
    } catch (err) {
      console.error("Failed to load favorites", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleRemoveFavProduct = async (productId) => {
    try {
      await favoriteService.removeFavoriteProduct(productId);
      fetchFavorites();
    } catch (err) {
      alert("Failed to remove favorite");
    }
  };

  const handleRemoveFavStore = async (storeId) => {
    try {
      await favoriteService.removeFavoriteStore(storeId);
      fetchFavorites();
    } catch (err) {
      alert("Failed to remove favorite");
    }
  };

  if (loading) return <LoadingSpinner text="Loading saved favorites..." />;

  const favProducts = favorites.filter(f => f.product != null);
  const favStores = favorites.filter(f => f.store != null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-black text-gray-900 flex items-center space-x-3">
          <Heart className="w-8 h-8 text-rose-500 fill-rose-500" />
          <span>My Favorites</span>
        </h1>
        <p className="text-sm text-gray-500">Quick access to your saved products and preferred supermarket stores</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('products')}
          className={`py-3 px-5 text-sm font-bold border-b-2 transition ${
            activeTab === 'products'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Products ({favProducts.length})
        </button>
        <button
          onClick={() => setActiveTab('stores')}
          className={`py-3 px-5 text-sm font-bold border-b-2 transition ${
            activeTab === 'stores'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Stores ({favStores.length})
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'products' && (
        favProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 space-y-3">
            <Heart className="w-12 h-12 text-gray-300 mx-auto" />
            <h3 className="text-lg font-bold text-gray-900">No favorite products saved</h3>
            <p className="text-sm text-gray-500">Click the heart icon on any product page to save it here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favProducts.map(fav => (
              <div key={fav.id} className="relative group">
                <ProductCard product={fav.product} />
                <button
                  onClick={() => handleRemoveFavProduct(fav.product.id)}
                  className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur rounded-full text-rose-600 shadow hover:bg-rose-50 transition"
                  title="Remove favorite"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )
      )}

      {activeTab === 'stores' && (
        favStores.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 space-y-3">
            <Heart className="w-12 h-12 text-gray-300 mx-auto" />
            <h3 className="text-lg font-bold text-gray-900">No favorite stores saved</h3>
            <p className="text-sm text-gray-500">Add your preferred stores to quickly check store deals.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {favStores.map(fav => (
              <div key={fav.id} className="relative group">
                <StoreCard store={fav.store} />
                <button
                  onClick={() => handleRemoveFavStore(fav.store.id)}
                  className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur rounded-full text-rose-600 shadow hover:bg-rose-50 transition"
                  title="Remove favorite store"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
