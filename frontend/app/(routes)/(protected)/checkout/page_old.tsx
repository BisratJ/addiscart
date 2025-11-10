'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/hooks/useAuth';
import { useCart } from '@/app/contexts/CartContext';
import { Check, ChevronRight, CreditCard, MapPin, ShoppingBag, Truck } from 'lucide-react';

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
  // ... other products
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

// Mock delivery times
const deliveryTimes = [
  { id: 'dt1', time: 'Today, 1:00 PM - 2:00 PM' },
  { id: 'dt2', time: 'Today, 2:00 PM - 3:00 PM' },
  { id: 'dt3', time: 'Today, 3:00 PM - 4:00 PM' },
  { id: 'dt4', time: 'Today, 4:00 PM - 5:00 PM' },
];

// Mock payment methods
const paymentMethods = [
  { id: 'pm1', name: 'Credit Card', last4: '4242', brand: 'Visa' },
  { id: 'pm2', name: 'Credit Card', last4: '1234', brand: 'Mastercard' },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { cartItems, clearCart } = useCart();
  
  const [storeId, setStoreId] = useState<string | null>(null);
  const [store, setStore] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [total, setTotal] = useState(0);
  
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [selectedDeliveryTime, setSelectedDeliveryTime] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  
  // Mock addresses
  const [addresses] = useState([
    { id: 'addr1', street: '123 Main St', city: 'San Francisco', state: 'CA', zipCode: '94105', default: true },
    { id: 'addr2', street: '456 Market St', city: 'San Francisco', state: 'CA', zipCode: '94103', default: false },
  ]);

  // Load store info - using default store for now
  useEffect(() => {
    // Use default store (can be enhanced to track store per cart in future)
    const defaultStoreId = 'store1';
    
    setStoreId(defaultStoreId);
    const foundStore = mockStores.find(s => s.id === defaultStoreId) || mockStores[0];
    setStore(foundStore);
    setDeliveryFee(foundStore.deliveryFee);
    setIsLoading(false);
  }, []);

  // Calculate totals
  useEffect(() => {
    let calculatedSubtotal = 0;
    
    Object.values(cartItems).forEach((item) => {
      calculatedSubtotal += item.price * item.quantity;
    });
    
    const calculatedTax = calculatedSubtotal * 0.0875; // 8.75% tax rate
    const calculatedTotal = calculatedSubtotal + calculatedTax + deliveryFee;
    
    setSubtotal(calculatedSubtotal);
    setTax(calculatedTax);
    setTotal(calculatedTotal);
  }, [cartItems, deliveryFee]);

  // Set default selections
  useEffect(() => {
    if (addresses.length > 0) {
      const defaultAddress = addresses.find(addr => addr.default);
      setSelectedAddress(defaultAddress ? defaultAddress.id : addresses[0].id);
    }
    
    if (deliveryTimes.length > 0) {
      setSelectedDeliveryTime(deliveryTimes[0].id);
    }
    
    if (paymentMethods.length > 0) {
      setSelectedPaymentMethod(paymentMethods[0].id);
    }
  }, [addresses]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [authLoading, isAuthenticated, router]);

  // Handle place order
  const handlePlaceOrder = () => {
    if (!selectedAddress || !selectedDeliveryTime || !selectedPaymentMethod) {
      alert('Please select delivery address, time, and payment method');
      return;
    }
    
    // Simulate order placement
    setIsLoading(true);
    
    setTimeout(() => {
      // Generate order ID
      const orderId = `ORD-${Date.now().toString().substring(6)}`;
      
      // Convert cartItems to order items format
      const orderItems: {[key: string]: number} = {};
      Object.entries(cartItems).forEach(([id, item]) => {
        orderItems[id] = item.quantity;
      });
      
      // Save order to localStorage for demo purposes
      const order = {
        id: orderId,
        date: new Date().toISOString(),
        items: orderItems,
        store: store,
        subtotal,
        tax,
        deliveryFee,
        total,
        status: 'processing',
        address: addresses.find(addr => addr.id === selectedAddress),
        deliveryTime: deliveryTimes.find(dt => dt.id === selectedDeliveryTime)?.time,
        paymentMethod: paymentMethods.find(pm => pm.id === selectedPaymentMethod),
      };
      
      const savedOrders = localStorage.getItem('orders');
      const orders = savedOrders ? JSON.parse(savedOrders) : [];
      orders.push(order);
      localStorage.setItem('orders', JSON.stringify(orders));
      
      // Clear cart using context
      clearCart();
      
      // Redirect to order confirmation
      router.push(`/orders/${orderId}`);
    }, 1500);
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (Object.keys(cartItems).length === 0 || !store) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <ShoppingBag className="mx-auto h-16 w-16 text-gray-400 mb-4" />
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <p className="mb-4">Add some items to your cart before checking out.</p>
        <button
          onClick={() => router.push('/stores')}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
        >
          Browse Stores
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-2/3 space-y-6">
          {/* Delivery Address */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center">
                <MapPin className="mr-2 h-5 w-5 text-green-600" />
                Delivery Address
              </h2>
              <button className="text-green-600 text-sm font-medium">+ Add New</button>
            </div>
            
            <div className="space-y-3">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className={`border rounded-md p-4 cursor-pointer ${
                    selectedAddress === address.id
                      ? 'border-green-600 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedAddress(address.id)}
                >
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">
                        {address.street}
                        {address.default && (
                          <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                            Default
                          </span>
                        )}
                      </p>
                      <p className="text-gray-600 text-sm">
                        {address.city}, {address.state} {address.zipCode}
                      </p>
                    </div>
                    {selectedAddress === address.id && (
                      <div className="h-6 w-6 bg-green-600 rounded-full flex items-center justify-center">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Delivery Time */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <Truck className="mr-2 h-5 w-5 text-green-600" />
              <h2 className="text-lg font-semibold">Delivery Time</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {deliveryTimes.map((time) => (
                <div
                  key={time.id}
                  className={`border rounded-md p-4 cursor-pointer ${
                    selectedDeliveryTime === time.id
                      ? 'border-green-600 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedDeliveryTime(time.id)}
                >
                  <div className="flex justify-between items-center">
                    <p className="font-medium">{time.time}</p>
                    {selectedDeliveryTime === time.id && (
                      <div className="h-6 w-6 bg-green-600 rounded-full flex items-center justify-center">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Payment Method */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center">
                <CreditCard className="mr-2 h-5 w-5 text-green-600" />
                Payment Method
              </h2>
              <button className="text-green-600 text-sm font-medium">+ Add New</button>
            </div>
            
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className={`border rounded-md p-4 cursor-pointer ${
                    selectedPaymentMethod === method.id
                      ? 'border-green-600 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedPaymentMethod(method.id)}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="mr-3">
                        {method.brand === 'Visa' ? (
                          <div className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
                            VISA
                          </div>
                        ) : (
                          <div className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                            MC
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{method.name}</p>
                        <p className="text-gray-600 text-sm">•••• {method.last4}</p>
                      </div>
                    </div>
                    {selectedPaymentMethod === method.id && (
                      <div className="h-6 w-6 bg-green-600 rounded-full flex items-center justify-center">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            
            {/* Store Info */}
            <div className="flex items-center pb-4 border-b mb-4">
              <div className="w-10 h-10 rounded-full overflow-hidden mr-3 flex-shrink-0">
                <img
                  src={store.logo}
                  alt={store.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-medium">{store.name}</h3>
                <p className="text-sm text-gray-500">
                  {Object.keys(cartItems).length} {Object.keys(cartItems).length === 1 ? 'item' : 'items'}
                </p>
              </div>
            </div>
            
            {/* Cart Items */}
            <div className="space-y-3 mb-4">
              {Object.values(cartItems).map((item) => {
                const itemTotal = item.price * item.quantity;
                
                return (
                  <div key={item.id} className="flex justify-between">
                    <div className="flex items-start">
                      <div className="bg-gray-100 rounded-md w-10 h-10 flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="font-medium text-gray-700">{item.quantity}×</span>
                      </div>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">${item.price.toFixed(2)} each</p>
                      </div>
                    </div>
                    <span className="font-medium">${itemTotal.toFixed(2)}</span>
                  </div>
                );
              })}
            </div>
            
            {/* Price Breakdown */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Fee</span>
                <span>${deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            
            {/* Place Order Button */}
            <button
              onClick={handlePlaceOrder}
              disabled={isLoading}
              className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition-colors mt-6 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Processing...' : 'Place Order'}
            </button>
            
            <p className="text-xs text-gray-500 text-center mt-4">
              By placing your order, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
