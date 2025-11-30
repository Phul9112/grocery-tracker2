'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { bulkUpdateItems } from '@/lib/db';
import { GroceryItem, Store } from '@/types';

interface BulkEditModalProps {
  selectedItems: string[];
  items: GroceryItem[];
  stores: Store[];
  onClose: () => void;
}

export default function BulkEditModal({ selectedItems, items, stores, onClose }: BulkEditModalProps) {
  const [editMode, setEditMode] = useState<'category' | 'prices'>('category');
  const [newCategory, setNewCategory] = useState('');
  const [storePrices, setStorePrices] = useState<{ [storeId: string]: string }>({});
  const [saving, setSaving] = useState(false);

  const selectedItemsData = items.filter((item) => selectedItems.includes(item.id));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const updates: Partial<GroceryItem> = {};

      if (editMode === 'category' && newCategory.trim()) {
        updates.category = newCategory.trim();
      } else if (editMode === 'prices') {
        const pricesData: { [storeId: string]: number } = {};
        for (const [storeId, price] of Object.entries(storePrices)) {
          if (price.trim() !== '') {
            pricesData[storeId] = parseFloat(price);
          }
        }
        if (Object.keys(pricesData).length > 0) {
          updates.prices = pricesData;
        }
      }

      if (Object.keys(updates).length > 0) {
        await bulkUpdateItems(selectedItems, updates);
        onClose();
      } else {
        alert('Please provide values to update');
      }
    } catch (error) {
      console.error('Error updating items:', error);
      alert('Failed to update items');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">
            Bulk Edit ({selectedItems.length} items)
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Selected Items Preview */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">Selected Items:</h3>
            <div className="flex flex-wrap gap-2">
              {selectedItemsData.slice(0, 10).map((item) => (
                <span
                  key={item.id}
                  className="px-3 py-1 bg-white text-blue-700 rounded-full text-sm"
                >
                  {item.name}
                </span>
              ))}
              {selectedItemsData.length > 10 && (
                <span className="px-3 py-1 bg-blue-200 text-blue-700 rounded-full text-sm">
                  +{selectedItemsData.length - 10} more
                </span>
              )}
            </div>
          </div>

          {/* Edit Mode Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What would you like to edit?
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setEditMode('category')}
                className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
                  editMode === 'category'
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="font-semibold">Category</div>
                <div className="text-xs mt-1">Change category for all items</div>
              </button>
              <button
                type="button"
                onClick={() => setEditMode('prices')}
                className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
                  editMode === 'prices'
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="font-semibold">Prices</div>
                <div className="text-xs mt-1">Update prices for stores</div>
              </button>
            </div>
          </div>

          {/* Edit Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {editMode === 'category' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Category
                </label>
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  placeholder="e.g., Fruits, Dairy, Snacks"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  This will update the category for all {selectedItems.length} selected items
                </p>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Set Prices by Store
                </label>
                <div className="space-y-3">
                  {stores.map((store) => (
                    <div key={store.id} className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full flex-shrink-0"
                        style={{ backgroundColor: store.color }}
                      />
                      <label className="flex-1 font-medium text-gray-700">{store.name}</label>
                      <div className="relative w-32">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                          $
                        </span>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={storePrices[store.id] || ''}
                          onChange={(e) =>
                            setStorePrices((prev) => ({ ...prev, [store.id]: e.target.value }))
                          }
                          className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Leave blank to keep existing prices. Filled prices will be updated for all selected items.
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50"
              >
                {saving ? 'Updating...' : `Update ${selectedItems.length} Items`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
