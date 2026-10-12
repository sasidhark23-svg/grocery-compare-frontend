import React, { useState } from 'react';
import { User, Mail, Shield, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { authService } from '../services/authService';

export default function Profile() {
  const { user, updateUser } = useAuthStore();
  const [name, setName] = useState(user?.name || '');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updated = await authService.updateProfile(name);
      updateUser(updated);
      setMsg("Profile updated successfully!");
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-black text-gray-900 flex items-center space-x-3">
          <User className="w-8 h-8 text-emerald-600" />
          <span>My Profile</span>
        </h1>
        <p className="text-sm text-gray-500">Manage account information and security settings</p>
      </div>

      {msg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold p-4 rounded-2xl flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>{msg}</span>
        </div>
      )}

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-6 border-b border-gray-100">
          <div className="bg-gray-50 rounded-2xl p-4 flex items-center space-x-3">
            <Mail className="w-5 h-5 text-gray-400" />
            <div>
              <span className="text-xs font-bold text-gray-400 uppercase">Email</span>
              <p className="text-sm font-bold text-gray-900">{user?.email}</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4 flex items-center space-x-3">
            <Shield className="w-5 h-5 text-purple-500" />
            <div>
              <span className="text-xs font-bold text-gray-400 uppercase">Role</span>
              <p className="text-sm font-bold text-purple-700">{user?.role || 'ROLE_USER'}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleUpdate} className="space-y-4 max-w-md">
          <div>
            <label htmlFor="profile-name" className="block text-xs font-bold text-gray-700 uppercase mb-1">Full Name</label>
            <input
              id="profile-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition"
          >
            {loading ? 'Saving...' : 'Save Profile Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
