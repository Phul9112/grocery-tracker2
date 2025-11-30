export interface Store {
  id: string;
  name: string;
  color: string;
  createdAt: number;
  userId: string;
}

export interface PriceHistory {
  storeId: string;
  price: number;
  date: number;
}

export interface GroceryItem {
  id: string;
  name: string;
  category: string;
  imageUrl?: string;
  prices: { [storeId: string]: number };
  priceHistory: PriceHistory[];
  notes?: string;
  createdAt: number;
  updatedAt: number;
  userId: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface SyncStatus {
  lastSynced: number;
  isSyncing: boolean;
}

export interface ExportData {
  items: GroceryItem[];
  stores: Store[];
  exportDate: number;
  version: string;
}
