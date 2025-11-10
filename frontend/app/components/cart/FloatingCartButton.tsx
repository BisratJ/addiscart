'use client';

import { useCart } from '@/app/contexts/CartContext';
import { ShoppingCart } from 'lucide-react';

export default function FloatingCartButton() {
  const { getTotalItems, setIsCartOpen } = useCart();
  const totalItems = getTotalItems();

  if (totalItems === 0) return null;

  return (
    <button
      onClick={() => setIsCartOpen(true)}
      className="fixed top-20 right-6 z-30 bg-green-700 hover:bg-green-800 text-white rounded-full shadow-2xl transition-all duration-300 hover:scale-110 flex items-center gap-2 px-4 py-3 font-bold"
    >
      <ShoppingCart className="w-6 h-6" />
      <span className="text-lg">{totalItems}</span>
    </button>
  );
}
