import React, { useEffect, useState } from 'react';
import { Bell, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { alertService } from '../services/alertService';
import LoadingSpinner from '../components/LoadingSpinner';

export default function PriceAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const data = await alertService.getUserAlerts();
      setAlerts(data);
    } catch (err) {
      console.error("Failed to load price alerts", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleDeleteAlert = async (id) => {
    if (!window.confirm("Delete this price alert?")) return;
    try {
      await alertService.deleteAlert(id);
      fetchAlerts();
    } catch (err) {
      alert("Failed to delete alert");
    }
  };

  const handleToggleActive = async (alertItem) => {
    try {
      await alertService.updateAlert(alertItem.id, alertItem.targetPrice, !alertItem.active);
      fetchAlerts();
    } catch (err) {
      alert("Failed to update alert state");
    }
  };

  if (loading) return <LoadingSpinner text="Loading price drop alerts..." />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-black text-gray-900 flex items-center space-x-3">
          <Bell className="w-8 h-8 text-amber-500" />
          <span>Price Drop Alerts</span>
        </h1>
        <p className="text-sm text-gray-500">Track target prices and get notified when current store prices drop</p>
      </div>

      {alerts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 space-y-3">
          <Bell className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="text-lg font-bold text-gray-900">No price alerts created yet</h3>
          <p className="text-sm text-gray-500">Visit any product details page and click "Set Price Alert" to start monitoring prices.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-100">
          {alerts.map((alertItem) => (
            <div key={alertItem.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <img
                  src={alertItem.product?.imageUrl || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400"}
                  alt={alertItem.product?.name}
                  className="w-14 h-14 rounded-xl object-cover border border-gray-100 bg-gray-50 flex-shrink-0"
                />
                <div>
                  <h4 className="font-bold text-gray-900 text-base">{alertItem.product?.name}</h4>
                  <p className="text-xs text-gray-500">
                    Target Threshold: <span className="font-extrabold text-emerald-700">₹{alertItem.targetPrice}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 self-end sm:self-center">
                {alertItem.triggered ? (
                  <span className="inline-flex items-center space-x-1.5 bg-emerald-100 text-emerald-800 text-xs font-black px-3.5 py-1.5 rounded-full shadow-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Target Price Reached!</span>
                  </span>
                ) : alertItem.active ? (
                  <span className="inline-flex items-center space-x-1.5 bg-amber-50 text-amber-800 text-xs font-bold px-3 py-1 rounded-full border border-amber-200">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Watching Prices</span>
                  </span>
                ) : (
                  <span className="bg-gray-100 text-gray-500 text-xs font-semibold px-3 py-1 rounded-full">
                    Paused
                  </span>
                )}

                <button
                  onClick={() => handleToggleActive(alertItem)}
                  className="px-3 py-1.5 border border-gray-200 hover:bg-gray-50 text-xs font-semibold rounded-xl"
                >
                  {alertItem.active ? 'Pause' : 'Resume'}
                </button>

                <button
                  onClick={() => handleDeleteAlert(alertItem.id)}
                  className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                  title="Delete alert"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
