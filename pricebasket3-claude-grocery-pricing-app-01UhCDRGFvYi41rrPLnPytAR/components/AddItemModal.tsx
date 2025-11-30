'use client';

import { useState, useEffect } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { addItem, updateItem, uploadImage, addPriceHistory } from '@/lib/db';
import { GroceryItem, Store } from '@/types';

interface AddItemModalProps {
  userId: string;
  stores: Store[];
  onClose: () => void;
  editingItem?: GroceryItem | null;
}

export default function AddItemModal({ userId, stores, onClose, editingItem }: AddItemModalProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [notes, setNotes] = useState('');
  const [prices, setPrices] = useState<{ [storeId: string]: string }>({});
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (editingItem) {
      setName(editingItem.name);
      setCategory(editingItem.category);
      setNotes(editingItem.notes || '');
      setPrices(
        Object.fromEntries(
          Object.entries(editingItem.prices).map(([storeId, price]) => [storeId, price.toString()])
        )
      );
      if (editingItem.imageUrl) {
        setImagePreview(editingItem.imageUrl);
      }
    }
  }, [editingItem]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !category.trim()) {
      alert('Please fill in required fields');
      return;
    }

    setUploading(true);

    try {
      let imageUrl = editingItem?.imageUrl || '';

      if (image) {
        imageUrl = await uploadImage(image, userId);
      }

      const pricesData = Object.fromEntries(
        Object.entries(prices)
          .filter(([_, price]) => price.trim() !== '')
          .map(([storeId, price]) => [storeId, parseFloat(price)])
      );

      if (editingItem) {
        // Track price history for changes
        for (const [storeId, newPrice] of Object.entries(pricesData)) {
          const oldPrice = editingItem.prices[storeId];
          if (oldPrice !== newPrice) {
            await addPriceHistory(editingItem.id, storeId, newPrice);
          }
        }

        await updateItem(editingItem.id, {
          name: name.trim(),
          category: category.trim(),
          notes: notes.trim(),
          prices: pricesData,
          imageUrl,
        });
      } else {
        const priceHistory = Object.entries(pricesData).map(([storeId, price]) => ({
          storeId,
          price,
          date: Date.now(),
        }));

        await addItem(userId, {
          name: name.trim(),
          category: category.trim(),
          notes: notes.trim(),
          prices: pricesData,
          priceHistory,
          imageUrl,
        });
      }

      onClose();
    } catch (error) {
      console.error('Error saving item:', error);
      alert('Failed to save item');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">
            {editingItem ? 'Edit Item' : 'Add New Item'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Image
            </label>
            <div className="flex items-center gap-4">
              {imagePreview ? (
                <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-gray-100">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-32 h-32 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <ImageIcon size={32} className="text-gray-400" />
                </div>
              )}
              <label className="cursor-pointer px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-2">
                <Upload size={18} />
                <span>Upload Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Item Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              placeholder="e.g., Organic Bananas"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              placeholder="e.g., Fruits, Dairy, Snacks"
              required
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
              rows={3}
              placeholder="Add any notes about this item..."
            />
          </div>

          {/* Prices */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prices by Store
            </label>
            {stores.length > 0 ? (
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
                        value={prices[store.id] || ''}
                        onChange={(e) =>
                          setPrices((prev) => ({ ...prev, [store.id]: e.target.value }))
                        }
                        className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 bg-yellow-50 p-3 rounded-lg">
                No stores added yet. Add stores in Settings to track prices.
              </p>
            )}
          </div>

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
              disabled={uploading}
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50"
            >
              {uploading ? 'Saving...' : editingItem ? 'Update Item' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
