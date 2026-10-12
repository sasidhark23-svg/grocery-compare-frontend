import React from 'react';
import { Award, CheckCircle2, AlertTriangle, XCircle, TrendingDown, Star } from 'lucide-react';
import StoreLogo from './StoreLogo';

export default function PriceComparisonTable({ deals = [], summary = {} }) {
  if (!deals || deals.length === 0) {
    return (
      <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl p-6 text-center text-sm font-medium">
        No store price listings available for this product yet.
      </div>
    );
  }

  const cheapestPrice = summary.cheapestPrice || deals[0]?.price;

  return (
    <div className="space-y-4">
      {/* Summary Banner */}
      {summary.priceDifference > 0 && (
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
              <TrendingDown className="w-6 h-6" />
            </div>
            <div>
          <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">Sample price difference</p>
              <p className="text-sm font-medium text-emerald-950">
                The sample listing at <span className="font-bold">{summary.cheapestStore}</span> is <span className="font-extrabold text-emerald-700">₹{summary.priceDifference}</span> below the highest sample listing.
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-gray-500">Lowest sample price</span>
            <p className="text-2xl font-black text-emerald-600">₹{summary.cheapestPrice}</p>
          </div>
        </div>
      )}

      <p className="text-xs text-gray-500" role="note">Illustrative demo prices and retailer availability. Confirm current prices with the store.</p>
      {/* Comparison List Cards / Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-100">
        {deals.map((deal, index) => {
          const isCheapest = index === 0 || deal.price === cheapestPrice;

          return (
            <div
              key={deal.priceId || index}
              className={`p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition ${
                isCheapest ? 'bg-emerald-50/50 border-l-4 border-l-emerald-500' : 'hover:bg-gray-50/50'
              }`}
            >
              {/* Store Logo & Details */}
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex-shrink-0 flex items-center justify-center overflow-hidden">
                  <StoreLogo storeName={deal.storeName} />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-bold text-gray-900 text-base">{deal.storeName}</h4>
                    {isCheapest && (
                      <span className="inline-flex items-center space-x-1 bg-emerald-600 text-white text-[11px] font-extrabold px-2.5 py-0.5 rounded-full shadow-sm">
                        <Award className="w-3 h-3" />
                        <span>LOWEST SAMPLE</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-3 mt-1 text-xs text-gray-500">
                    {deal.storeRating && (
                      <span className="flex items-center text-amber-600 font-semibold">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 mr-1" />
                        {deal.storeRating}
                      </span>
                    )}
                    {deal.stockStatus === 'IN_STOCK' && (
                      <span className="flex items-center text-emerald-600 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                        Sample listing
                      </span>
                    )}
                    {deal.stockStatus === 'LOW_STOCK' && (
                      <span className="flex items-center text-amber-600 font-medium">
                        <AlertTriangle className="w-3.5 h-3.5 mr-1" />
                        Low Stock
                      </span>
                    )}
                    {deal.stockStatus === 'OUT_OF_STOCK' && (
                      <span className="flex items-center text-rose-600 font-medium">
                        <XCircle className="w-3.5 h-3.5 mr-1" />
                        Out of Stock
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Price & Discount info */}
              <div className="flex items-center space-x-4 self-end sm:self-center">
                {deal.discount > 0 && (
                  <div className="text-right">
                    <span className="text-xs bg-rose-100 text-rose-700 font-bold px-2 py-0.5 rounded-md">
                      ₹{deal.discount} OFF
                    </span>
                  </div>
                )}
                <div className="text-right">
                  <p className={`text-2xl font-black ${isCheapest ? 'text-emerald-700' : 'text-gray-900'}`}>
                    ₹{deal.price}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
