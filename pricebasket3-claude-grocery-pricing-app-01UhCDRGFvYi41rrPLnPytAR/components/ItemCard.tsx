'use client';

import { useState } from 'react';
import { GroceryItem, Store } from '@/types';
import { Edit2, Trash2, TrendingUp, TrendingDown, Image as ImageIcon } from 'lucide-react';
import { deleteItem, deleteImage } from '@/lib/db';

interface ItemCardProps {
  item: GroceryItem;
  stores: Store[];
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onViewHistory: () => void;
}

export default function ItemCard({
  item,
  stores,
  isSelected,
  onSelect,
  onEdit,
  onViewHistory,
}: ItemCardProps) {
  const [imageError, setImageError] = useState(false);

  const handleDelete = async () => {
    if (confirm(`Delete "${item.name}"?`)) {
      if (item.imageUrl) {
        await deleteImage(item.imageUrl);
      }
      await deleteItem(item.id);
    }
  };

  const prices = Object.entries(item.prices).map(([storeId, price]) => ({
    storeId,
    price,
    store: stores.find((s) => s.id === storeId),
  }));

  const lowestPrice = prices.length > 0 ? Math.min(...prices.map((p) => p.price)) : 0;
  const highestPrice = prices.length > 0 ? Math.max(...prices.map((p) => p.price)) : 0;

  // Calculate price trend
  const getPriceTrend = () => {
    if (!item.priceHistory || item.priceHistory.length < 2) return null;
    const sorted = [...item.priceHistory].sort((a, b) => b.date - a.date);
    const latest = sorted[0].price;
    const previous = sorted[1].price;
    return latest < previous ? 'down' : latest > previous ? 'up' : null;
  };

  const trend = getPriceTrend();

  return (
    <div
      className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden ${
        isSelected ? 'ring-4 ring-primary-500' : ''
      }`}
    >
      {/* Image */}
      {item.imageUrl && !imageError ? (
        <div className="relative h-48 bg-gray-100">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onSelect}
            className="absolute top-3 left-3 w-5 h-5 cursor-pointer accent-primary-600"
          />
        </div>
      ) : (
        <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          <ImageIcon size={48} className="text-gray-400" />
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onSelect}
            className="absolute top-3 left-3 w-5 h-5 cursor-pointer accent-primary-600"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-800 mb-1">{item.name}</h3>
            <span className="inline-block px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
              {item.category}
            </span>
          </div>
          {trend && (
            <div
              className={`p-1 rounded-full ${
                trend === 'down' ? 'bg-green-100' : 'bg-red-100'
              }`}
            >
              {trend === 'down' ? (
                <TrendingDown size={16} className="text-green-600" />
              ) : (
                <TrendingUp size={16} className="text-red-600" />
              )}
            </div>
          )}
        </div>

        {item.notes && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.notes}</p>
        )}

        {/* Prices */}
        <div className="space-y-2 mb-4">
          {prices.length > 0 ? (
            prices.map(({ storeId, price, store }) => (
              <div
                key={storeId}
                className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: store?.color || '#6b7280' }}
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {store?.name || 'Unknown Store'}
                  </span>
                </div>
                <span
                  className={`text-sm font-bold ${
                    price === lowestPrice && prices.length > 1
                      ? 'text-green-600'
                      : price === highestPrice && prices.length > 1
                      ? 'text-red-600'
                      : 'text-gray-800'
                  }`}
                >
                  ${price.toFixed(2)}
                </span>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 text-center py-2">No prices added</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={onViewHistory}
            className="flex-1 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
          >
            Price History
          </button>
          <button
            onClick={onEdit}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Edit"
          >
            <Edit2 size={18} className="text-gray-700" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 size={18} className="text-red-600" />
          </button>
        </div>
      </div>
    </div>
  );
}
