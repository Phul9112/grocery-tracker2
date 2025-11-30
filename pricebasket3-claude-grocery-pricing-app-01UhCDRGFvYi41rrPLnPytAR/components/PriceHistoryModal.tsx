'use client';

import { useMemo } from 'react';
import { X, TrendingDown, TrendingUp, Calendar } from 'lucide-react';
import { GroceryItem, Store } from '@/types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

interface PriceHistoryModalProps {
  item: GroceryItem;
  stores: Store[];
  onClose: () => void;
}

export default function PriceHistoryModal({ item, stores, onClose }: PriceHistoryModalProps) {
  const chartData = useMemo(() => {
    if (!item.priceHistory || item.priceHistory.length === 0) return [];

    const dataByDate: { [date: string]: any } = {};

    item.priceHistory.forEach((entry) => {
      const dateKey = format(new Date(entry.date), 'MMM dd, yyyy');
      if (!dataByDate[dateKey]) {
        dataByDate[dateKey] = { date: dateKey, timestamp: entry.date };
      }
      const store = stores.find((s) => s.id === entry.storeId);
      if (store) {
        dataByDate[dateKey][store.name] = entry.price;
      }
    });

    return Object.values(dataByDate).sort((a, b) => a.timestamp - b.timestamp);
  }, [item.priceHistory, stores]);

  const storeLines = useMemo(() => {
    const storeIds = new Set(item.priceHistory?.map((h) => h.storeId) || []);
    return stores.filter((s) => storeIds.has(s.id));
  }, [item.priceHistory, stores]);

  const stats = useMemo(() => {
    if (!item.priceHistory || item.priceHistory.length === 0) {
      return null;
    }

    const prices = item.priceHistory.map((h) => h.price);
    const lowestPrice = Math.min(...prices);
    const highestPrice = Math.max(...prices);
    const averagePrice = prices.reduce((a, b) => a + b, 0) / prices.length;

    const sorted = [...item.priceHistory].sort((a, b) => b.date - a.date);
    const latestPrice = sorted[0]?.price || 0;
    const previousPrice = sorted[1]?.price || latestPrice;
    const priceChange = latestPrice - previousPrice;
    const percentChange = previousPrice ? (priceChange / previousPrice) * 100 : 0;

    return {
      lowestPrice,
      highestPrice,
      averagePrice,
      latestPrice,
      priceChange,
      percentChange,
    };
  }, [item.priceHistory]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{item.name}</h2>
            <p className="text-sm text-gray-500">Price History</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {stats ? (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-sm text-blue-600 font-medium mb-1">Current Price</div>
                  <div className="text-2xl font-bold text-blue-900">${stats.latestPrice.toFixed(2)}</div>
                  {stats.priceChange !== 0 && (
                    <div
                      className={`text-xs mt-1 flex items-center gap-1 ${
                        stats.priceChange < 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {stats.priceChange < 0 ? (
                        <TrendingDown size={14} />
                      ) : (
                        <TrendingUp size={14} />
                      )}
                      {stats.percentChange.toFixed(1)}%
                    </div>
                  )}
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-sm text-green-600 font-medium mb-1">Lowest Price</div>
                  <div className="text-2xl font-bold text-green-900">${stats.lowestPrice.toFixed(2)}</div>
                </div>

                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="text-sm text-red-600 font-medium mb-1">Highest Price</div>
                  <div className="text-2xl font-bold text-red-900">${stats.highestPrice.toFixed(2)}</div>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-sm text-purple-600 font-medium mb-1">Average Price</div>
                  <div className="text-2xl font-bold text-purple-900">${stats.averagePrice.toFixed(2)}</div>
                </div>
              </div>

              {/* Price Chart */}
              {chartData.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Price Trends</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12 }}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis
                        tick={{ fontSize: 12 }}
                        domain={['auto', 'auto']}
                        tickFormatter={(value) => `$${value}`}
                      />
                      <Tooltip
                        formatter={(value: any) => `$${value.toFixed(2)}`}
                        contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                      />
                      <Legend />
                      {storeLines.map((store) => (
                        <Line
                          key={store.id}
                          type="monotone"
                          dataKey={store.name}
                          stroke={store.color}
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* History Table */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Calendar size={20} />
                  Price History ({item.priceHistory.length} entries)
                </h3>
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Store
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Price
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {[...item.priceHistory]
                          .sort((a, b) => b.date - a.date)
                          .map((entry, index) => {
                            const store = stores.find((s) => s.id === entry.storeId);
                            return (
                              <tr key={index} className="hover:bg-gray-50">
                                <td className="px-4 py-3 text-sm text-gray-900">
                                  {format(new Date(entry.date), 'MMM dd, yyyy HH:mm')}
                                </td>
                                <td className="px-4 py-3 text-sm">
                                  <div className="flex items-center gap-2">
                                    <div
                                      className="w-3 h-3 rounded-full"
                                      style={{ backgroundColor: store?.color || '#6b7280' }}
                                    />
                                    <span className="text-gray-900">
                                      {store?.name || 'Unknown Store'}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                                  ${entry.price.toFixed(2)}
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No Price History</h3>
              <p className="text-gray-500">
                Price history will appear here as you update prices for this item.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
