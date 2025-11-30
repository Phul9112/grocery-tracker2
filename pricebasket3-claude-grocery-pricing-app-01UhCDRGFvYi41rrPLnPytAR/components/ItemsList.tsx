'use client';

import { GroceryItem, Store } from '@/types';
import ItemCard from './ItemCard';

interface ItemsListProps {
  items: GroceryItem[];
  stores: Store[];
  selectedItems: string[];
  onSelectItem: (id: string) => void;
  onEdit: (item: GroceryItem) => void;
  onViewHistory: (item: GroceryItem) => void;
}

export default function ItemsList({
  items,
  stores,
  selectedItems,
  onSelectItem,
  onEdit,
  onViewHistory,
}: ItemsListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <ItemCard
          key={item.id}
          item={item}
          stores={stores}
          isSelected={selectedItems.includes(item.id)}
          onSelect={() => onSelectItem(item.id)}
          onEdit={() => onEdit(item)}
          onViewHistory={() => onViewHistory(item)}
        />
      ))}
    </div>
  );
}
