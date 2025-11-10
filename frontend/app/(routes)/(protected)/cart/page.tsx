'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/hooks/useAuth';
import { ShoppingBag, Trash2, Plus, Minus, ChevronRight } from 'lucide-react';

// Mock products data (same as in store page)
const mockProducts = [
  {
    id: 'prod1',
    name: 'Organic Bananas',
    description: 'Sweet and nutritious organic bananas, perfect for snacking or baking.',
    price: 0.79,
    salePrice: 0.69,
    onSale: true,
    image: 'https://images.unsplash.com/photo-1543218024-57a70143c369?auto=format&fit=crop&w=300&q=80',
    category: 'Produce',
    unit: 'each',
    stock: 100,
  },
  {
    id: 'prod2',
    name: 'Avocado',
    description: 'Ripe and ready to eat avocados, perfect for guacamole or toast.',
    price: 1.99,
    image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=300&q=80',
    category: 'Produce',
    unit: 'each',
    stock: 50,
  },
  {
    id: 'prod3',
    name: 'Fresh Strawberries',
    description: 'Juicy and sweet strawberries, perfect for desserts or snacking.',
    price: 4.99,
    salePrice: 3.99,
    onSale: true,
    image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=300&q=80',
    category: 'Produce',
    unit: 'lb',
    stock: 30,
  },
  {
    id: 'prod4',
    name: 'Whole Milk',
    description: 'Fresh whole milk from local farms.',
    price: 3.49,
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=300&q=80',
    category: 'Dairy',
    unit: 'gallon',
    stock: 40,
  },
  {
    id: 'prod5',
    name: 'Organic Eggs',
    description: 'Farm fresh organic eggs, dozen.',
    price: 5.99,
    image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=300&q=80',
    category: 'Dairy',
    unit: 'dozen',
    stock: 60,
  },
];

// Mock stores data
const mockStores = [
  {
    id: 'store1',
    name: 'Fresh Grocery',
    logo: 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?auto=format&fit=crop&w=300&q=80',
    deliveryFee: 3.99,
    minimumOrder: 10.00,
  },
  {
    id: 'store2',
    name: 'Organic Market',
    logo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=300&q=80',
    deliveryFee: 4.99,
    minimumOrder: 15.00,
  },
];

export default function CartPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  
  const [cart, setCart] = useState<{[key: string]: number}>({});
  const [storeId, setStoreId] = useState<string | null>(null);
  const [store, setStore] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [subtotal, setSubtotal] = useState(0);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    const savedStoreId = localStorage.getItem('storeId');
    
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    
    if (savedStoreId) {
      setStoreId(savedStoreId);
      const foundStore = mockStores.find(s => s.id === savedStoreId);
      if (foundStore) {
        setStore(foundStore);
      }
    }
    
    setIsLoading(false);
  }, []);

  // Calculate subtotal
  useEffect(() => {
    let calculatedSubtotal = 0;
    
    Object.entries(cart).forEach(([productId, quantity]) => {
      const product = mockProducts.find(p => p.id === productId);
      if (product) {
        const price = product.onSale ? (product.salePrice || product.price) : product.price;
        calculatedSubtotal += price * quantity;
      }
    });
    
    setSubtotal(calculatedSubtotal);
  }, [cart]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (Object.keys(cart).length > 0) {
      localStorage.setItem('cart', JSON.stringify(cart));
    } else {
      localStorage.removeItem('cart');
    }
  }, [cart]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [authLoading, isAuthenticated, router]);

  // Update quantity
  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    const product = mockProducts.find(p => p.id === productId);
    if (product && newQuantity > product.stock) {
      alert(`Only ${product.stock} ${product.unit}(s) available in stock`);
      return;
    }
    
    setCart(prev => ({
      ...prev,
      [productId]: newQuantity
    }));
  };

  // Remove from cart
  const removeFromCart = (productId: string) => {
    setCart(prev => {
      const newCart = { ...prev };
      delete newCart[productId];
      return newCart;
    });
  };

  // Clear entire cart
  const clearCart = () => {
    if (confirm('Are you sure you want to clear your cart?')) {
      setCart({});
      localStorage.removeItem('cart');
      localStorage.removeItem('storeId');
      setStoreId(null);
      setStore(null);
    }
  };

  // Proceed to checkout
  const proceedToCheckout = () => {
    if (Object.keys(cart).length === 0) {
      alert('Your cart is empty');
      return;
    }
    
    if (store && subtotal < store.minimumOrder) {
      alert(`Minimum order amount is $${store.minimumOrder.toFixed(2)}`);
      return;
    }
    
    router.push('/checkout');
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  if (Object.keys(cart).length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <ShoppingBag className="mx-auto h-16 w-16 text-gray-400 mb-4" />
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-gray-600 mb-6">Start shopping to add items to your cart.</p>
        <button
          onClick={() => router.push('/stores')}
          className="bg-brand-500 text-white px-6 py-3 rounded-md hover:bg-brand-600 transition-colors"
        >
          Browse Stores
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">Shopping Cart</h1>
        <button
          onClick={clearCart}
          className="text-red-500 hover:text-red-600 text-xs sm:text-sm font-medium flex items-center active:scale-95 touch-manipulation"
        >
          <Trash2 className="mr-1 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Clear Cart
        </button>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
        {/* Cart Items */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow-md">
            {/* Store Header */}
            {store && (
              <div className="flex items-center p-4 border-b">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden mr-2 sm:mr-3 flex-shrink-0">
                  <img
                    src={store.logo}
                    alt={store.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-semibold">{store.name}</h2>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Minimum order: ${store.minimumOrder.toFixed(2)}
                  </p>
                </div>
              </div>
            )}
            
            {/* Cart Items List */}
            <div className="divide-y">
              {Object.entries(cart).map(([productId, quantity]) => {
                const product = mockProducts.find(p => p.id === productId);
                if (!product) return null;
                
                const price = product.onSale ? (product.salePrice || product.price) : product.price;
                const itemTotal = price * quantity;
                
                return (
                  <div key={productId} className="p-3 sm:p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start">
                      {/* Product Image */}
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-md overflow-hidden mr-3 sm:mr-4 flex-shrink-0">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* Product Details */}
                      <div className="flex-grow">
                        <div className="flex justify-between items-start mb-1.5 sm:mb-2">
                          <div>
                            <h3 className="text-sm sm:text-base font-semibold">{product.name}</h3>
                            <p className="text-xs sm:text-sm text-gray-500">{product.description}</p>
                            <div className="flex items-center mt-0.5 sm:mt-1">
                              <span className="text-sm sm:text-base text-brand-600 font-medium">
                                ${price.toFixed(2)}
                              </span>
                              {product.onSale && (
                                <span className="text-gray-400 line-through ml-2 text-sm">
                                  ${product.price.toFixed(2)}
                                </span>
                              )}
                              <span className="text-gray-500 text-sm ml-2">/ {product.unit}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => removeFromCart(productId)}
                            className="text-red-500 hover:text-red-600 p-1"
                            title="Remove from cart"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between mt-2 sm:mt-3">
                          <div className="flex items-center border rounded-md">
                            <button
                              onClick={() => updateQuantity(productId, quantity - 1)}
                              className="p-1.5 sm:p-2 hover:bg-gray-100 transition-colors active:scale-95 touch-manipulation"
                            >
                              <Minus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </button>
                            <span className="px-3 sm:px-4 py-1.5 sm:py-2 font-medium min-w-[2.5rem] sm:min-w-[3rem] text-center text-sm sm:text-base">
                              {quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(productId, quantity + 1)}
                              className="p-1.5 sm:p-2 hover:bg-gray-100 transition-colors active:scale-95 touch-manipulation"
                            >
                              <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </button>
                          </div>
                          
                          <div className="text-right">
                            <p className="font-semibold text-base sm:text-lg">
                              ${itemTotal.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Continue Shopping Button */}
          <button
            onClick={() => router.push(storeId ? `/stores/${storeId}` : '/stores')}
            className="mt-3 sm:mt-4 text-brand-500 hover:text-brand-600 font-medium flex items-center text-sm sm:text-base active:scale-95 touch-manipulation"
          >
            ← Continue Shopping
          </button>
        </div>
        
        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 sticky top-4">
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Order Summary</h2>
            
            <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
              <div className="flex justify-between text-sm sm:text-base">
                <span className="text-gray-600">Items ({Object.keys(cart).length})</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              
              {store && (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="text-gray-600">${store.deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax (estimated)</span>
                    <span className="text-gray-600">${(subtotal * 0.0875).toFixed(2)}</span>
                  </div>
                </>
              )}
            </div>
            
            <div className="border-t pt-3 sm:pt-4 mb-4 sm:mb-6">
              <div className="flex justify-between font-bold text-base sm:text-lg">
                <span>Estimated Total</span>
                <span>
                  ${store 
                    ? (subtotal + store.deliveryFee + (subtotal * 0.0875)).toFixed(2)
                    : subtotal.toFixed(2)
                  }
                </span>
              </div>
            </div>
            
            {/* Minimum Order Warning */}
            {store && subtotal < store.minimumOrder && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
                <p className="text-sm text-yellow-800">
                  Add ${(store.minimumOrder - subtotal).toFixed(2)} more to reach the minimum order amount
                </p>
              </div>
            )}
            
            {/* Checkout Button */}
            <button
              onClick={proceedToCheckout}
              disabled={store && subtotal < store.minimumOrder}
              className="w-full bg-brand-500 text-white py-2.5 sm:py-3 rounded-md hover:bg-brand-600 transition-colors font-medium flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base active:scale-95 touch-manipulation"
            >
              Proceed to Checkout
              <ChevronRight className="ml-2 h-5 w-5" />
            </button>
            
            <p className="text-[10px] sm:text-xs text-gray-500 text-center mt-3 sm:mt-4">
              Tax and delivery fee calculated at checkout
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
