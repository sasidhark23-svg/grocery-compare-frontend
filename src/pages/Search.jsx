import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { productService } from '../services/productService';
import { Filter, SlidersHorizontal } from 'lucide-react';

export default function Search() {
  const [searchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [sort, setSort] = useState('name');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    async function fetchSearchResults() {
      setLoading(true);
      try {
        const response = await productService.searchProducts({
          query: queryParam,
          category: category || null,
          brand: brand || null,
          page,
          size: 9,
          sort
        });
        setLoadError('');

        if (Array.isArray(response)) {
          setProducts(response);
          setTotalPages(1);
        } else if (response && response.content) {
          setProducts(response.content);
          setTotalPages(response.totalPages || 1);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error("Failed to search products", err);
        setLoadError('We could not load search results. Check your connection and try again.');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchSearchResults();
  }, [queryParam, category, brand, sort, page]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Search Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm flex flex-col items-center text-center space-y-4">
        <h1 className="text-3xl font-black text-gray-900">Compare Product Prices</h1>
        <SearchBar initialQuery={queryParam} />
      </div>

      {/* Filter & Controls Bar */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
          <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
          <span>Filters</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <input
            aria-label="Filter by brand"
            type="search"
            value={brand}
            onChange={(e) => { setBrand(e.target.value); setPage(0); }}
            placeholder="Filter by brand"
            className="w-full sm:w-44 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          {/* Category Filter */}
          <select
            aria-label="Filter by category"
            value={category}
            onChange={(e) => { setCategory(e.target.value); setPage(0); }}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">All Categories</option>
            {['Dairy', 'Vegetables', 'Fruits', 'Rice & Grains', 'Pulses', 'Oils & Ghee', 'Atta & Flour', 'Spices & Salt', 'Snacks', 'Snacks & Packaged Food', 'Beverages', 'Household Essentials'].map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>

          {/* Sort Filter */}
          <select
            aria-label="Sort products"
            value={sort}
            onChange={(e) => { setSort(e.target.value); setPage(0); }}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="name">Sort by Name</option>
            <option value="newest">Newest first</option>
          </select>
        </div>
      </div>

      {/* Product Grid Results */}
      {loading ? (
        <LoadingSpinner text="Searching grocery database..." />
      ) : loadError ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-800" role="alert">{loadError}</div>
      ) : products.length > 0 ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 pt-4">
              <button
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
                className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium disabled:opacity-50 hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="text-sm font-semibold text-gray-700 px-3">
                Page {page + 1} of {totalPages}
              </span>
              <button
                disabled={page + 1 >= totalPages}
                onClick={() => setPage(page + 1)}
                className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium disabled:opacity-50 hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 space-y-3">
          <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto">
            <Filter className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">No products found</h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto">
            Try adjusting your search query or filters to find what you're looking for.
          </p>
        </div>
      )}
    </div>
  );
}
