'use client';

import { useState } from 'react';
import { X, Plus, Edit2, Trash2, Store as StoreIcon } from 'lucide-react';
import { addStore, updateStore, deleteStore } from '@/lib/db';
import { Store } from '@/types';

interface SettingsModalProps {
  userId: string;
  stores: Store[];
  onClose: () => void;
}

const PRESET_COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16',
  '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
  '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
  '#ec4899', '#f43f5e',
];

export default function SettingsModal({ userId, stores, onClose }: SettingsModalProps) {
  const [storeName, setStoreName] = useState('');
  const [storeColor, setStoreColor] = useState(PRESET_COLORS[0]);
  const [editingStore, setEditingStore] = useState<Store | null>(null);
  const [saving, setSaving] = useState(false);

  const handleAddStore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeName.trim()) return;

    setSaving(true);
    try {
      if (editingStore) {
        await updateStore(editingStore.id, {
          name: storeName.trim(),
          color: storeColor,
        });
        setEditingStore(null);
      } else {
        await addStore(userId, {
          name: storeName.trim(),
          color: storeColor,
        });
      }
      setStoreName('');
      setStoreColor(PRESET_COLORS[0]);
    } catch (error) {
      console.error('Error saving store:', error);
      alert('Failed to save store');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (store: Store) => {
    setEditingStore(store);
    setStoreName(store.name);
    setStoreColor(store.color);
  };

  const handleDelete = async (storeId: string, storeName: string) => {
    if (confirm(`Delete "${storeName}"? This will remove all associated prices.`)) {
      await deleteStore(storeId);
    }
  };

  const cancelEdit = () => {
    setEditingStore(null);
    setStoreName('');
    setStoreColor(PRESET_COLORS[0]);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Add/Edit Store Form */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {editingStore ? 'Edit Store' : 'Add New Store'}
            </h3>
            <form onSubmit={handleAddStore} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Store Name
                </label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  placeholder="e.g., Walmart, Target, Costco"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Store Color
                </label>
                <div className="flex flex-wrap gap-2">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setStoreColor(color)}
                      className={`w-8 h-8 rounded-full transition-all ${
                        storeColor === color ? 'ring-4 ring-offset-2 ring-gray-400' : ''
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                {editingStore && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving ? (
                    'Saving...'
                  ) : (
                    <>
                      {editingStore ? (
                        <>
                          <Edit2 size={18} />
                          Update Store
                        </>
                      ) : (
                        <>
                          <Plus size={18} />
                          Add Store
                        </>
                      )}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Stores List */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <StoreIcon size={20} />
              Your Stores ({stores.length})
            </h3>
            {stores.length > 0 ? (
              <div className="space-y-2">
                {stores.map((store) => (
                  <div
                    key={store.id}
                    className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all"
                  >
                    <div
                      className="w-5 h-5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: store.color }}
                    />
                    <span className="flex-1 font-medium text-gray-800">{store.name}</span>
                    <button
                      onClick={() => handleEdit(store)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={16} className="text-gray-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(store.id, store.name)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} className="text-red-600" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <StoreIcon size={48} className="mx-auto text-gray-400 mb-2" />
                <p className="text-gray-600">No stores added yet</p>
                <p className="text-sm text-gray-500">Add your first store to start tracking prices</p>
              </div>
            )}
          </div>

          {/* About */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">About PriceBasket</h3>
            <p className="text-sm text-gray-600">
              Track and compare grocery prices across different stores. Your data is automatically
              synced across all your devices in real-time.
            </p>
            <p className="text-xs text-gray-500 mt-2">Version 1.0.0</p>
          </div>
        </div>
      </div>
    </div>
  );
}
