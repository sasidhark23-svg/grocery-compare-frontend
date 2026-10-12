import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function PriceHistoryChart({ historyData = [] }) {
  if (!historyData || historyData.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 text-center text-sm text-gray-500">
        No price history recorded for this item yet.
      </div>
    );
  }

  const chartData = historyData.map(item => ({
    date: new Date(item.recordedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    price: item.price,
    store: item.store?.storeName || 'Store'
  }));

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-3">
      <div>
        <h4 className="font-bold text-gray-900 text-sm">Recorded price history</h4>
        <p className="mt-1 text-xs text-gray-500">Demo records, when present, are illustrative and are not verified retailer price history.</p>
      </div>
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} />
            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} domain={['auto', 'auto']} unit="₹" />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', border: 'none' }}
              formatter={(value) => [`₹${value}`, 'Price']}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#ffffff' }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
