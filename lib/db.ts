import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
  getDocs,
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from './firebase';
import { GroceryItem, Store, PriceHistory } from '@/types';

export const COLLECTIONS = {
  ITEMS: 'items',
  STORES: 'stores',
};

// Items operations
export const addItem = async (userId: string, item: Omit<GroceryItem, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
  const now = Date.now();
  return addDoc(collection(db, COLLECTIONS.ITEMS), {
    ...item,
    userId,
    createdAt: now,
    updatedAt: now,
  });
};

export const updateItem = async (itemId: string, updates: Partial<GroceryItem>) => {
  const itemRef = doc(db, COLLECTIONS.ITEMS, itemId);
  return updateDoc(itemRef, {
    ...updates,
    updatedAt: Date.now(),
  });
};

export const deleteItem = async (itemId: string) => {
  return deleteDoc(doc(db, COLLECTIONS.ITEMS, itemId));
};

export const subscribeToItems = (userId: string, callback: (items: GroceryItem[]) => void) => {
  const q = query(collection(db, COLLECTIONS.ITEMS), where('userId', '==', userId));
  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as GroceryItem));
    callback(items);
  });
};

// Stores operations
export const addStore = async (userId: string, store: Omit<Store, 'id' | 'userId' | 'createdAt'>) => {
  return addDoc(collection(db, COLLECTIONS.STORES), {
    ...store,
    userId,
    createdAt: Date.now(),
  });
};

export const updateStore = async (storeId: string, updates: Partial<Store>) => {
  const storeRef = doc(db, COLLECTIONS.STORES, storeId);
  return updateDoc(storeRef, updates);
};

export const deleteStore = async (storeId: string) => {
  return deleteDoc(doc(db, COLLECTIONS.STORES, storeId));
};

export const subscribeToStores = (userId: string, callback: (stores: Store[]) => void) => {
  const q = query(collection(db, COLLECTIONS.STORES), where('userId', '==', userId));
  return onSnapshot(q, (snapshot) => {
    const stores = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Store));
    callback(stores);
  });
};

// Image upload
export const uploadImage = async (file: File, userId: string): Promise<string> => {
  const filename = `${userId}/${Date.now()}_${file.name}`;
  const storageRef = ref(storage, `images/${filename}`);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
};

export const deleteImage = async (imageUrl: string) => {
  try {
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
  } catch (error) {
    console.error('Error deleting image:', error);
  }
};

// Price history
export const addPriceHistory = async (itemId: string, storeId: string, price: number) => {
  const itemRef = doc(db, COLLECTIONS.ITEMS, itemId);
  const item = (await getDocs(query(collection(db, COLLECTIONS.ITEMS), where('__name__', '==', itemId)))).docs[0];

  if (item) {
    const currentData = item.data() as GroceryItem;
    const priceHistory = currentData.priceHistory || [];

    priceHistory.push({
      storeId,
      price,
      date: Date.now(),
    });

    await updateDoc(itemRef, {
      priceHistory,
      updatedAt: Date.now(),
    });
  }
};

// Bulk operations
export const bulkUpdateItems = async (itemIds: string[], updates: Partial<GroceryItem>) => {
  const batch = writeBatch(db);

  itemIds.forEach(itemId => {
    const itemRef = doc(db, COLLECTIONS.ITEMS, itemId);
    batch.update(itemRef, {
      ...updates,
      updatedAt: Date.now(),
    });
  });

  return batch.commit();
};

// Export/Import
export const exportData = async (userId: string) => {
  const itemsQuery = query(collection(db, COLLECTIONS.ITEMS), where('userId', '==', userId));
  const storesQuery = query(collection(db, COLLECTIONS.STORES), where('userId', '==', userId));

  const [itemsSnapshot, storesSnapshot] = await Promise.all([
    getDocs(itemsQuery),
    getDocs(storesQuery),
  ]);

  const items = itemsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  const stores = storesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  return {
    items,
    stores,
    exportDate: Date.now(),
    version: '1.0.0',
  };
};

export const importData = async (userId: string, data: any) => {
  const batch = writeBatch(db);

  // Import stores
  data.stores?.forEach((store: any) => {
    const storeRef = doc(collection(db, COLLECTIONS.STORES));
    const { id, ...storeData } = store;
    batch.set(storeRef, { ...storeData, userId });
  });

  // Import items
  data.items?.forEach((item: any) => {
    const itemRef = doc(collection(db, COLLECTIONS.ITEMS));
    const { id, ...itemData } = item;
    batch.set(itemRef, { ...itemData, userId });
  });

  return batch.commit();
};
