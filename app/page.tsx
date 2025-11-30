'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, signInAnonymously, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { subscribeToItems, subscribeToStores } from '@/lib/db';
import { GroceryItem, Store } from '@/types';
import Header from '@/components/Header';
import ItemsList from '@/components/ItemsList';
import AddItemModal from '@/components/AddItemModal';
import SettingsModal from '@/components/SettingsModal';
import BulkEditModal from '@/components/BulkEditModal';
import PriceHistoryModal from '@/components/PriceHistoryModal';
import { Plus } from 'lucide-react';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [items, setItems] = useState<GroceryItem[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showBulkEdit, setShowBulkEdit] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [editingItem, setEditingItem] = useState<GroceryItem | null>(null);
  const [priceHistoryItem, setPriceHistoryItem] = useState<GroceryItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
      } else {
        const userCredential = await signInAnonymously(auth);
        setUser(userCredential.user);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    const unsubscribeItems = subscribeToItems(user.uid, (fetchedItems) => {
      setItems(fetchedItems);
    });

    const unsubscribeStores = subscribeToStores(user.uid, (fetchedStores) => {
      setStores(fetchedStores);
    });

    return () => {
      unsubscribeItems();
      unsubscribeStores();
    };
  }, [user]);

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(items.map((item) => item.category)));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-pulse text-6xl mb-4">🛒</div>
          <p className="text-gray-600">Loading PriceBasket...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header
        onOpenSettings={() => setShowSettings(true)}
        onSearch={setSearchQuery}
        searchQuery={searchQuery}
        stores={stores}
        items={items}
      />

      <main className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-3 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                categoryFilter === 'all'
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              All Items
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setCategoryFilter(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  categoryFilter === category
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {selectedItems.length > 0 && (
            <button
              onClick={() => setShowBulkEdit(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all shadow-md text-sm font-medium"
            >
              Bulk Edit ({selectedItems.length})
            </button>
          )}
        </div>

        {/* Items List */}
        <ItemsList
          items={filteredItems}
          stores={stores}
          selectedItems={selectedItems}
          onSelectItem={(id) => {
            setSelectedItems((prev) =>
              prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
            );
          }}
          onEdit={(item) => {
            setEditingItem(item);
            setShowAddModal(true);
          }}
          onViewHistory={(item) => setPriceHistoryItem(item)}
        />

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🛒</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {searchQuery || categoryFilter !== 'all' ? 'No items found' : 'No items yet'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery || categoryFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Start tracking prices by adding your first item'}
            </p>
            {!searchQuery && categoryFilter === 'all' && (
              <button
                onClick={() => setShowAddModal(true)}
                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all shadow-lg font-medium"
              >
                Add First Item
              </button>
            )}
          </div>
        )}

        {/* Floating Add Button */}
        <button
          onClick={() => {
            setEditingItem(null);
            setShowAddModal(true);
          }}
          className="fixed bottom-6 right-6 w-14 h-14 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-all flex items-center justify-center hover:scale-110 z-40"
          aria-label="Add item"
        >
          <Plus size={24} />
        </button>
      </main>

      {/* Modals */}
      {showAddModal && (
        <AddItemModal
          userId={user?.uid || ''}
          stores={stores}
          onClose={() => {
            setShowAddModal(false);
            setEditingItem(null);
          }}
          editingItem={editingItem}
        />
      )}

      {showSettings && (
        <SettingsModal
          userId={user?.uid || ''}
          stores={stores}
          onClose={() => setShowSettings(false)}
        />
      )}

      {showBulkEdit && (
        <BulkEditModal
          selectedItems={selectedItems}
          items={items}
          stores={stores}
          onClose={() => {
            setShowBulkEdit(false);
            setSelectedItems([]);
          }}
        />
      )}

      {priceHistoryItem && (
        <PriceHistoryModal
          item={priceHistoryItem}
          stores={stores}
          onClose={() => setPriceHistoryItem(null)}
        />
      )}
    </div>
  );
}
