import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ListChecks, Plus, Trash2, ArrowRight } from 'lucide-react';
import { shoppingListService } from '../services/shoppingListService';
import LoadingSpinner from '../components/LoadingSpinner';

export default function ShoppingLists() {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newListName, setNewListName] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const fetchLists = async () => {
    setLoading(true);
    try {
      const data = await shoppingListService.getUserLists();
      setLists(data);
    } catch (err) {
      console.error("Failed to load shopping lists", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLists();
  }, []);

  const handleCreateList = async (e) => {
    e.preventDefault();
    if (!newListName.trim()) return;
    try {
      await shoppingListService.createList(newListName.trim());
      setNewListName('');
      setCreateModalOpen(false);
      fetchLists();
    } catch (err) {
      alert("Failed to create shopping list");
    }
  };

  const handleDeleteList = async (id) => {
    if (!window.confirm("Are you sure you want to delete this shopping list?")) return;
    try {
      await shoppingListService.deleteList(id);
      fetchLists();
    } catch (err) {
      alert("Failed to delete shopping list");
    }
  };

  if (loading) return <LoadingSpinner text="Loading shopping lists..." />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 flex items-center space-x-3">
            <ListChecks className="w-8 h-8 text-emerald-600" />
            <span>My Shopping Lists</span>
          </h1>
          <p className="text-sm text-gray-500">Manage grocery items and calculate multi-store minimum totals</p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="py-3 px-5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl text-sm transition shadow flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>New Shopping List</span>
        </button>
      </div>

      {lists.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 space-y-4">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <ListChecks className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">No shopping lists found</h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto">
            Create your first shopping list to organize products and calculate the lowest store totals.
          </p>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="px-5 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow"
          >
            Create List Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {lists.map((list) => (
            <div
              key={list.id}
              className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-bold text-gray-900 text-lg">{list.name}</h3>
                  <button
                    onClick={() => handleDeleteList(list.id)}
                    className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    title="Delete list"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-gray-400 font-medium">
                  {list.items?.length || 0} Products in list
                </p>
              </div>

              <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500">Calculate Best Store</span>
                <Link
                  to={`/lists/${list.id}`}
                  className="inline-flex items-center space-x-1 py-2 px-3 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold rounded-xl text-xs transition"
                >
                  <span>Open List</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create List Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 border border-gray-100 shadow-2xl">
            <h3 className="text-xl font-black text-gray-900">Create New Shopping List</h3>
            <form onSubmit={handleCreateList} className="space-y-4">
              <div>
                <label htmlFor="new-list-name" className="block text-xs font-bold text-gray-700 uppercase mb-1">List Name</label>
                <input
                  id="new-list-name"
                  type="text"
                  required
                  placeholder="e.g. Weekly Family Groceries"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
