import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Tag, ArrowRight } from 'lucide-react';

export default function ProductCard({ product }) {
  const isPackagedProductPhoto = ['images.openfoodfacts.org', 'images.openproductsfacts.org', 'images.openbeautyfacts.org']
    .some((domain) => product.imageUrl?.includes(domain));

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-emerald-200 overflow-hidden flex flex-col justify-between"
    >
      <div className="p-4">
        {/* Category & Brand tags */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">
            {product.category || 'Grocery'}
          </span>
          {product.brand && (
            <span className="text-xs text-gray-400 font-medium truncate">
              {product.brand}
            </span>
          )}
        </div>

        {/* Product Image */}
        <div className="w-full h-40 mb-4 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center relative">
          <img
            src={product.imageUrl}
            alt={product.name}
            className={`w-full h-full ${isPackagedProductPhoto ? 'object-contain p-2 bg-white' : 'object-cover'} group-hover:scale-105 transition duration-300`}
            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.classList.add('hidden'); }}
          />
        </div>

        {/* Product Info */}
        <h3 className="font-semibold text-gray-900 text-base line-clamp-2 mb-1">
          {product.name}
        </h3>
        {product.unit && <p className="mb-2 text-xs font-semibold text-gray-600">Pack size: {product.unit}</p>}
        {product.description && (
          <p className="text-xs text-gray-500 line-clamp-2 mb-3">
            {product.description}
          </p>
        )}
      </div>

      {/* Action Footer */}
      <div className="px-4 py-3 bg-gray-50/70 border-t border-gray-100 flex items-center justify-between">
        <span className="text-xs font-medium text-emerald-600 flex items-center space-x-1">
          <Tag className="w-3.5 h-3.5" />
          <span>Sample listings</span>
        </span>
        <Link
          to={`/products/${product.id}`}
          aria-label={`Compare store listings for ${product.name}`}
          className="inline-flex items-center space-x-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition"
        >
          <span>View Prices</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </motion.div>
  );
}
