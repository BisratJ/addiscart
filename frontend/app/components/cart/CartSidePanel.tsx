'use client';

import { useCart } from '@/app/contexts/CartContext';
import { X, Plus, Minus, Trash2, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function CartSidePanel() {
  const { cartItems, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, getTotalPrice, getTotalItems } = useCart();

  const cartItemsArray = Object.values(cartItems);
  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  if (!isCartOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />
      
      {/* Side Panel */}
      <div className="fixed top-0 right-0 h-screen w-full max-w-md bg-white z-[101] shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
          <div className="flex-1 text-center">
            <h2 className="text-lg font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-lime-600 bg-clip-text text-transparent">Your Addiscart</h2>
            <p className="text-sm text-gray-500">Shopping in Addis Ababa</p>
          </div>
          <div className="w-10" />
        </div>

        {/* Store Info */}
        {cartItemsArray.length > 0 && (
          <div className="p-4 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900">ABC Fine Wine & Spirits</h3>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-green-600 font-semibold">⚡ Delivery by 1:26pm</span>
                </div>
                <p className="text-xs text-gray-500">✓ 100% satisfaction guarantee</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">${totalPrice.toFixed(2)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto">
          {cartItemsArray.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <ShoppingCart className="w-20 h-20 text-gray-300 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h3>
              <p className="text-gray-500 mb-6">Add items to get started</p>
              <Link
                href="/stores"
                onClick={() => setIsCartOpen(false)}
                className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors inline-block"
              >
                Start shopping
              </Link>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {cartItemsArray.map((item) => (
                <div key={item.id} className="flex gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-16 h-16 bg-white rounded-lg flex-shrink-0 overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1">
                      {item.name}
                    </h4>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-bold text-gray-900">${item.price.toFixed(2)}</span>
                      {item.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          ${item.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">{item.unit}</p>
                  </div>

                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-gray-500" />
                    </button>
                    
                    <div className="flex items-center gap-2 bg-white rounded-full px-2 py-1 border border-gray-200">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <Minus className="w-3 h-3 text-gray-600" />
                      </button>
                      <span className="text-sm font-semibold text-gray-900 min-w-[20px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <Plus className="w-3 h-3 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">🎁</div>
                  <span className="font-medium text-gray-900">Make this order a gift</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🐾</span>
                  <p className="text-sm text-gray-700">
                    Yes, I want <span className="font-bold">$0 delivery fee*</span> on my order! *Service fees apply.
                  </p>
                </div>
              </div>

              <div className="pt-4">
                <h3 className="font-bold text-gray-900 mb-2">Complete your cart</h3>
                <p className="text-sm text-gray-500 mb-4">Based on items in your cart</p>
                
                <div className="grid grid-cols-3 gap-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white border border-gray-200 rounded-xl p-2">
                      <div className="aspect-square bg-gray-100 rounded-lg mb-2"></div>
                      <p className="text-xs text-gray-600 line-clamp-2 mb-1">Product {i}</p>
                      <p className="text-sm font-bold text-gray-900">${(5.99 * i).toFixed(2)}</p>
                      <button className="w-full mt-2 bg-green-600 text-white text-xs py-1.5 rounded-full font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-1">
                        <Plus className="w-3 h-3" />
                        Add
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItemsArray.length > 0 && (
          <div className="border-t border-gray-200 p-4 bg-white flex-shrink-0">
            <div className="mb-3 flex items-center justify-center">
              <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg text-sm font-semibold">
                $0 delivery fee + saving $2.01 on this order
              </div>
            </div>
            <Link
              href="/checkout"
              className="block w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition-colors shadow-lg text-center"
              onClick={() => setIsCartOpen(false)}
            >
              Go to checkout
              <span className="float-right">${totalPrice.toFixed(2)}</span>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
