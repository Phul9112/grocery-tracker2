'use client';

import { useState, useEffect } from 'react';
import { Settings, Search, Download, Upload, RefreshCw } from 'lucide-react';
import { exportData, importData } from '@/lib/db';
import { GroceryItem, Store } from '@/types';

interface HeaderProps {
  onOpenSettings: () => void;
  onSearch: (query: string) => void;
  searchQuery: string;
  stores: Store[];
  items: GroceryItem[];
}

export default function Header({ onOpenSettings, onSearch, searchQuery, stores, items }: HeaderProps) {
  const [lastSynced, setLastSynced] = useState<Date>(new Date());
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    setLastSynced(new Date());
  }, [items, stores]);

  const handleExport = async () => {
    try {
      const data = await exportData((items[0] || stores[0])?.userId || '');
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pricebasket-export-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export data');
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      const userId = (items[0] || stores[0])?.userId || '';
      await importData(userId, data);
      alert('Data imported successfully!');
    } catch (error) {
      console.error('Import failed:', error);
      alert('Failed to import data. Please check the file format.');
    }
  };

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setLastSynced(new Date());
    }, 1000);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            <div className="text-4xl">🛒</div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">PriceBasket</h1>
              <p className="text-sm text-gray-500">Track & Compare Prices</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Sync Status */}
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded-lg">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-xs">
                Synced {lastSynced.toLocaleTimeString()}
              </span>
            </div>

            {/* Sync Button */}
            <button
              onClick={handleSync}
              disabled={isSyncing}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Sync now"
            >
              <RefreshCw size={20} className={`text-gray-700 ${isSyncing ? 'animate-spin' : ''}`} />
            </button>

            {/* Export */}
            <button
              onClick={handleExport}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Export data"
            >
              <Download size={20} className="text-gray-700" />
            </button>

            {/* Import */}
            <label className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer" title="Import data">
              <Upload size={20} className="text-gray-700" />
              <input
                type="file"
                accept="application/json"
                onChange={handleImport}
                className="hidden"
              />
            </label>

            {/* Settings */}
            <button
              onClick={onOpenSettings}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Settings"
            >
              <Settings size={20} className="text-gray-700" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
