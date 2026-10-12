import React, { useCallback, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ListChecks, Trash2, ArrowLeft, TrendingDown, Store as StoreIcon, Plus, Tag } from 'lucide-react';
import { shoppingListService } from '../services/shoppingListService';
import LoadingSpinner from '../components/LoadingSpinner';

export default function ShoppingListDetails() {
  const { id } = useParams();
  const [list, setList] = useState(null);
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadListData = useCallback(async () => {
    setLoading(true);
    try {
      const [listData, compData] = await Promise.all([
        shoppingListService.getListById(id),
        shoppingListService.compareList(id).catch(() => null),
      ]);
      setList(listData);
      setComparison(compData);
    } catch (err) {
      console.error("Failed to load shopping list details", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadListData();
  }, [loadListData]);

  const handleRemoveItem = async (itemId) => {
    try {
      await shoppingListService.removeItem(id, itemId);
      loadListData();
    } catch (err) {
      alert("Failed to remove item");
    }
  };

  if (loading) return <LoadingSpinner text="Analyzing shopping list prices across stores..." />;
  if (!list) return <div className="text-center p-12 font-bold">Shopping list not found.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <Link to="/lists" className="inline-flex items-center space-x-1 text-xs font-bold text-gray-500 hover:text-emerald-600 transition">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Shopping Lists</span>
      </Link>

      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
            List Overview
          </span>
          <h1 className="text-3xl font-black text-gray-900 mt-2">{list.name}</h1>
          <p className="text-xs text-gray-500 mt-1">{list.items?.length || 0} products in this list</p>
        </div>

        <Link
          to="/search"
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add More Products</span>
        </Link>
      </div>

      {/* Optimization Summary Cards */}
      {comparison && comparison.items?.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-tr from-emerald-600 to-teal-600 text-white rounded-3xl p-6 shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-100">Estimated Minimum Total</span>
              <TrendingDown className="w-6 h-6" />
            </div>
            <p className="text-4xl font-black">₹{comparison.cheapestTotal}</p>
            <p className="text-xs text-emerald-100">
              Calculated by purchasing each item at its individual lowest store price.
            </p>
          </div>

          <div className="bg-teal-50 border border-teal-200 rounded-3xl p-6 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-800">Potential Total Savings</span>
              <Tag className="w-6 h-6 text-teal-600" />
            </div>
            <p className="text-4xl font-black text-teal-700">₹{comparison.potentialSavings}</p>
            <p className="text-xs text-teal-800">
              Estimated savings compared to buying at highest price stores.
            </p>
          </div>
        </div>
      )}

      {/* Items List Table */}
      <section className="space-y-4">
        <h2 className="text-xl font-black text-gray-900 flex items-center space-x-2">
          <ListChecks className="w-5 h-5 text-emerald-600" />
          <span>Products in List</span>
        </h2>

        {list.items?.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center space-y-3">
            <p className="text-sm text-gray-500">Your shopping list is currently empty.</p>
            <Link to="/search" className="inline-block px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl">
              Browse & Add Products
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-100">
            {list.items.map((item) => {
              const itemComp = comparison?.items?.find(i => i.productId === item.product?.id);

              return (
                <div key={item.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.product?.imageUrl || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400"}
                      alt={item.product?.name}
                      className="w-14 h-14 rounded-xl object-cover border border-gray-100 bg-gray-50 flex-shrink-0"
                    />
                    <div>
                      <h4 className="font-bold text-gray-900 text-base">{item.product?.name}</h4>
                      <p className="text-xs text-gray-500">
                        Qty: <span className="font-bold text-gray-800">{item.quantity}</span> | Category: {item.product?.category}
                      </p>
                      {itemComp && (
                        <p className="text-xs text-emerald-700 font-semibold mt-1">
                          Cheapest at: <span className="font-bold">{itemComp.cheapestStore}</span> (₹{itemComp.cheapestPrice} ea)
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 self-end sm:self-center">
                    {itemComp && (
                      <div className="text-right">
                        <span className="text-xs text-gray-400 block">Subtotal</span>
                        <span className="text-lg font-black text-gray-900">₹{itemComp.subtotal}</span>
                      </div>
                    )}
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                      title="Remove product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Store-by-Store Totals Comparison */}
      {comparison && comparison.storeTotals?.length > 0 && (
        <section className="space-y-4 pt-4">
          <h2 className="text-xl font-black text-gray-900 flex items-center space-x-2">
            <StoreIcon className="w-5 h-5 text-emerald-600" />
            <span>Store-by-Store Total Cost Comparison</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {comparison.storeTotals.map((st, idx) => (
              <div
                key={st.storeId}
                className={`bg-white rounded-2xl p-5 border shadow-sm space-y-2 ${
                  idx === 0 ? 'border-emerald-500 bg-emerald-50/40 ring-1 ring-emerald-500' : 'border-gray-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-gray-900 text-base">{st.storeName}</h4>
                  {idx === 0 && (
                    <span className="text-[10px] font-black bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                      BEST SINGLE STORE
                    </span>
                  )}
                </div>
                <div className="flex items-baseline justify-between pt-2">
                  <span className="text-xs text-gray-500">{st.availableItems} items available</span>
                  <span className="text-2xl font-black text-gray-900">₹{st.totalCost}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
