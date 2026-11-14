'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { NeoCard } from '../common/NeoCard';
import { NeoButton } from '../common/NeoButton';
import { formatINR, exportToCSV } from '@/lib/utils';
import {
  ShoppingBag,
  Plus,
  Trash2,
  Check,
  Search,
  Download,
  Calendar,
  Sparkles
} from 'lucide-react';
import { ShoppingItem } from '@/types';

export const ShoppingListModule: React.FC = () => {
  const {
    shoppingItems,
    addShoppingItem,
    toggleShoppingItem,
    deleteShoppingItem,
    updateShoppingItem,
    selectedDate
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterPurchased, setFilterPurchased] = useState<'all' | 'pending' | 'purchased'>('all');

  // New item modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [itemQuantity, setItemQuantity] = useState('1');
  const [itemCategory, setItemCategory] = useState('Self-Care & Nutrition');
  const [itemPrice, setItemPrice] = useState('');

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName) return;

    addShoppingItem(
      itemName,
      itemQuantity || '1 pack',
      itemCategory,
      itemPrice ? parseFloat(itemPrice) : undefined
    );

    setItemName('');
    setItemQuantity('1');
    setItemPrice('');
    setIsModalOpen(false);
  };

  const filteredItems = shoppingItems.filter(item => {
    if (searchTerm && !item.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (filterPurchased === 'pending' && item.is_purchased) return false;
    if (filterPurchased === 'purchased' && !item.is_purchased) return false;
    return true;
  });

  const handleExportShopping = () => {
    const rows = filteredItems.map(item => ({
      'Item Name': item.name,
      'Quantity': item.quantity,
      'Category': item.category,
      'Purchased': item.is_purchased ? 'Yes' : 'No',
      'Purchase Date': item.purchase_date || 'N/A',
      'Price (INR)': item.price || 0
    }));
    exportToCSV('MyLife_OS_Shopping_List', rows);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-black pb-4">
        <div>
          <h2 className="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
            <span className="p-1 bg-rose-400 border border-black rounded shadow-[2px_2px_0px_#000]">
              <ShoppingBag className="w-5 h-5 text-black" />
            </span>
            Shopping List & Self-Care Inventory
          </h2>
          <p className="text-xs font-bold text-zinc-600 dark:text-zinc-400 mt-1">
            Prepopulated Ingredients: ABC powder, Oats, Soya, Nellikkai, Flax seeds, Fruit-water
          </p>
        </div>

        <div className="flex items-center gap-2">
          <NeoButton variant="neutral" size="sm" onClick={handleExportShopping}>
            <Download className="w-3.5 h-3.5" /> Export CSV
          </NeoButton>
          <NeoButton variant="primary" size="sm" onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4" /> Add Item
          </NeoButton>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white dark:bg-zinc-800 border-2 border-black rounded-lg shadow-[2px_2px_0px_#000]">
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <Search className="w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search items (e.g. Oats, Soya, Amla)..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full neo-input text-xs py-1"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setFilterPurchased('all')}
            className={`px-3 py-1 text-xs font-black rounded border border-black cursor-pointer ${
              filterPurchased === 'all' ? 'bg-amber-300 text-black shadow-[1.5px_1.5px_0px_#000]' : 'bg-white'
            }`}
          >
            All Items ({shoppingItems.length})
          </button>
          <button
            onClick={() => setFilterPurchased('pending')}
            className={`px-3 py-1 text-xs font-black rounded border border-black cursor-pointer ${
              filterPurchased === 'pending' ? 'bg-rose-400 text-black shadow-[1.5px_1.5px_0px_#000]' : 'bg-white'
            }`}
          >
            Need to Buy ({shoppingItems.filter(i => !i.is_purchased).length})
          </button>
          <button
            onClick={() => setFilterPurchased('purchased')}
            className={`px-3 py-1 text-xs font-black rounded border border-black cursor-pointer ${
              filterPurchased === 'purchased' ? 'bg-lime-400 text-black shadow-[1.5px_1.5px_0px_#000]' : 'bg-white'
            }`}
          >
            Purchased ({shoppingItems.filter(i => i.is_purchased).length})
          </button>
        </div>
      </div>

      {/* Shopping Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map(item => {
          const isDone = item.is_purchased;
          return (
            <NeoCard
              key={item.id}
              variant={isDone ? 'green' : 'white'}
              className="p-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-black text-white rounded">
                    {item.category}
                  </span>
                  <button
                    onClick={() => {
                      if (confirm(`Remove "${item.name}" from shopping list?`)) deleteShoppingItem(item.id);
                    }}
                    className="p-1 hover:bg-rose-400 border border-black rounded cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h3 className={`text-base font-black ${isDone ? 'line-through text-zinc-700' : 'text-zinc-900'}`}>
                  {item.name}
                </h3>
                <div className="text-xs font-bold text-zinc-600 mt-1">
                  Quantity: {item.quantity}
                </div>
                {item.price && (
                  <div className="text-xs font-extrabold text-blue-800 mt-0.5">
                    Est. Cost: {formatINR(item.price)}
                  </div>
                )}
                {isDone && item.purchase_date && (
                  <div className="text-[10px] font-bold text-emerald-800 mt-1">
                    Purchased on: {item.purchase_date}
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t-2 border-black flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-500">
                  {isDone ? 'In Stock ✓' : 'To Purchase'}
                </span>
                <button
                  onClick={() => toggleShoppingItem(item.id)}
                  className={`px-3 py-1.5 text-xs font-black border-2 border-black rounded-md shadow-[1.5px_1.5px_0px_#000] cursor-pointer flex items-center gap-1.5 ${
                    isDone ? 'bg-black text-white' : 'bg-white text-black hover:bg-zinc-100'
                  }`}
                >
                  {isDone ? <Check className="w-3.5 h-3.5" /> : null}
                  {isDone ? 'Purchased' : 'Mark Purchased'}
                </button>
              </div>
            </NeoCard>
          );
        })}
      </div>

      {/* Add Item Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <NeoCard className="w-full max-w-md bg-[#FAF6EE] p-5">
            <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-4">
              <h3 className="font-black text-lg uppercase text-zinc-900">Add Shopping Item</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 border border-black rounded bg-white">✕</button>
            </div>
            <form onSubmit={handleSaveItem} className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase mb-1">Item Name</label>
                <input
                  type="text"
                  placeholder="e.g. ABC Powder or Oats"
                  value={itemName}
                  onChange={e => setItemName(e.target.value)}
                  required
                  className="w-full neo-input"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">Quantity</label>
                  <input
                    type="text"
                    placeholder="e.g. 500g or 1 kg"
                    value={itemQuantity}
                    onChange={e => setItemQuantity(e.target.value)}
                    className="w-full neo-input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">Estimated Price (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 150"
                    value={itemPrice}
                    onChange={e => setItemPrice(e.target.value)}
                    className="w-full neo-input"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase mb-1">Category</label>
                <select
                  value={itemCategory}
                  onChange={e => setItemCategory(e.target.value)}
                  className="w-full neo-input"
                >
                  <option value="Self-Care & Nutrition">Self-Care & Nutrition</option>
                  <option value="Breakfast & Oatmeal">Breakfast & Oatmeal</option>
                  <option value="Protein & Gym Diet">Protein & Gym Diet</option>
                  <option value="Fruit-Water Essentials">Fruit-Water Essentials</option>
                  <option value="General Grocery">General Grocery</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t-2 border-black">
                <NeoButton type="button" variant="neutral" onClick={() => setIsModalOpen(false)}>Cancel</NeoButton>
                <NeoButton type="submit" variant="primary">Add to List</NeoButton>
              </div>
            </form>
          </NeoCard>
        </div>
      )}
    </div>
  );
};
