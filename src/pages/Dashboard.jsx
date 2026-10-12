import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ListChecks, Heart, Bell, Tag, Plus, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { shoppingListService } from '../services/shoppingListService';
import { favoriteService } from '../services/favoriteService';
import { alertService } from '../services/alertService';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Dashboard() {
  const { user } = useAuthStore();
  const [lists, setLists] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true);
      try {
        const [listsData, favsData, alertsData] = await Promise.all([
          shoppingListService.getUserLists().catch(() => []),
          favoriteService.getUserFavorites().catch(() => []),
          alertService.getUserAlerts().catch(() => []),
        ]);
        setLists(listsData);
        setFavorites(favsData);
        setAlerts(alertsData);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  if (loading) return <LoadingSpinner text="Loading your dashboard..." />;

  const triggeredAlertsCount = alerts.filter(a => a.triggered).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="inline-block bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-md">
            User Portal
          </span>
          <h1 className="text-3xl font-black">Welcome back, {user?.name || 'Shopper'}!</h1>
          <p className="text-emerald-100 text-sm">{user?.email}</p>
        </div>

        <Link
          to="/search"
          className="px-5 py-3 bg-white text-emerald-800 hover:bg-emerald-50 font-extrabold rounded-2xl text-sm transition shadow flex items-center space-x-2"
        >
          <Tag className="w-4 h-4 text-emerald-600" />
          <span>Compare Products</span>
        </Link>
      </div>

      {/* Quick Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Link to="/lists" className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Shopping Lists</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ListChecks className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-gray-900">{lists.length}</p>
          <p className="text-xs text-gray-400">Manage items & optimize totals</p>
        </Link>

        <Link to="/favorites" className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Saved Favorites</span>
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Heart className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-gray-900">{favorites.length}</p>
          <p className="text-xs text-gray-400">Favorited products & stores</p>
        </Link>

        <Link to="/alerts" className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Price Alerts</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <p className="text-3xl font-black text-gray-900">{alerts.length}</p>
            {triggeredAlertsCount > 0 && (
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                {triggeredAlertsCount} Target Reached!
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400">Active price drop monitors</p>
        </Link>
      </div>

      {/* Shopping Lists Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-gray-900 flex items-center space-x-2">
            <ListChecks className="w-5 h-5 text-emerald-600" />
            <span>My Shopping Lists</span>
          </h2>
          <Link to="/lists" className="text-xs font-bold text-emerald-600 hover:underline">
            View All
          </Link>
        </div>

        {lists.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center space-y-3">
            <p className="text-sm text-gray-500">You haven't created any shopping lists yet.</p>
            <Link to="/lists" className="inline-flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow">
              <Plus className="w-4 h-4" />
              <span>Create First List</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {lists.slice(0, 3).map((list) => (
              <Link
                key={list.id}
                to={`/lists/${list.id}`}
                className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition space-y-3 flex flex-col justify-between"
              >
                <div>
                  <h3 className="font-bold text-gray-900 text-base">{list.name}</h3>
                  <p className="text-xs text-gray-400 mt-1">
                    {list.items?.length || 0} items added
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-50 text-xs font-bold text-emerald-600">
                  <span>Compare & Calculate</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Triggered Price Alerts Section */}
      {alerts.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-gray-900 flex items-center space-x-2">
              <Bell className="w-5 h-5 text-amber-500" />
              <span>Active Price Alerts</span>
            </h2>
            <Link to="/alerts" className="text-xs font-bold text-emerald-600 hover:underline">
              Manage Alerts
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-100 shadow-sm overflow-hidden">
            {alerts.slice(0, 4).map((alertItem) => (
              <div key={alertItem.id} className="p-4 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">{alertItem.product?.name}</h4>
                  <p className="text-xs text-gray-400">Target Price: <span className="font-bold text-gray-700">₹{alertItem.targetPrice}</span></p>
                </div>
                {alertItem.triggered ? (
                  <span className="inline-flex items-center space-x-1 bg-emerald-100 text-emerald-800 text-xs font-extrabold px-3 py-1 rounded-full shadow-sm">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Target Reached!</span>
                  </span>
                ) : (
                  <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full">
                    Watching
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
