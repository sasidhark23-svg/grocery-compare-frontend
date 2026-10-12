import React from 'react';
import { Star, MapPin, Globe } from 'lucide-react';
import StoreLogo from './StoreLogo';

export default function StoreCard({ store }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition flex items-center space-x-4">
      <div className="w-14 h-14 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0 flex items-center justify-center">
        <StoreLogo storeName={store.storeName} />
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-gray-900 text-base truncate">{store.storeName}</h4>
        <div className="flex items-center space-x-3 mt-1 text-xs text-gray-500">
          {store.location && (
            <span className="flex items-center space-x-1 truncate">
              <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              <span className="truncate">{store.location}</span>
            </span>
          )}
          {store.rating && (
            <span className="flex items-center space-x-1 font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{store.rating}</span>
            </span>
          )}
        </div>
        {store.website && (
          <a
            href={store.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1 text-xs text-emerald-600 hover:underline mt-1 font-medium"
          >
            <Globe className="w-3 h-3" />
            <span>Visit Store</span>
          </a>
        )}
      </div>
    </div>
  );
}
