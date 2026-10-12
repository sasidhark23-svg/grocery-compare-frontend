import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

export default function SearchBar({ initialQuery = '', className = '' }) {
  const [query, setQuery] = useState(initialQuery);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const searchQuery = query.trim();
    navigate(searchQuery ? `/search?q=${encodeURIComponent(searchQuery)}` : '/search');
  };

  return (
    <form onSubmit={handleSearch} className={`relative max-w-2xl w-full ${className}`}>
      <div className="relative flex items-center">
        <Search className="absolute left-4 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search grocery products"
          placeholder="Search milk, rice, fruit and more"
          className="w-full pl-12 pr-32 py-3.5 bg-white rounded-2xl border border-gray-200 shadow-sm hover:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 placeholder-gray-400 text-sm sm:text-base transition"
        />
        <button
          type="submit"
          className="absolute right-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm transition shadow-sm"
        >
          Compare
        </button>
      </div>
    </form>
  );
}
