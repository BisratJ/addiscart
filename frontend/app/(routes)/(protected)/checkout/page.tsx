'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/hooks/useAuth';
import { useCart } from '@/app/contexts/CartContext';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '@/app/components/checkout/CheckoutForm';
import ChapaPayment from '@/app/components/ChapaPayment';
import { MapPin, Clock, CreditCard, ShoppingBag, ChevronLeft, Check } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || '');

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('asap');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash' | 'chapa'>('card');
  const [clientSecret, setClientSecret] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      localStorage.setItem('redirectAfterLogin', '/checkout');
      router.push('/auth/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // Get cart items as array
  const items = Object.values(cartItems);
  const subtotal = getTotalPrice();
  const deliveryFee = subtotal > 35 ? 0 : 3.99;
  const serviceFee = 2.99;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + deliveryFee + serviceFee + tax;

  // Create payment intent when component mounts
  useEffect(() => {
    if (paymentMethod === 'card' && items.length > 0) {
      // In a real app, you'd call your backend to create a payment intent
      // For now, we'll simulate it
      const mockClientSecret = 'pi_mock_secret_' + Math.random().toString(36).substr(2, 9);
      setClientSecret(mockClientSecret);
    }
  }, [paymentMethod, items.length]);

  const handlePlaceOrder = async () => {
    if (paymentMethod === 'cash') {
      setIsProcessing(true);
      
      // Simulate order placement
      setTimeout(() => {
        // Clear cart
        clearCart();
        
        // Redirect to success page
        router.push('/orders/success');
      }, 1500);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some items to your cart to checkout</p>
          <Link
            href="/stores"
            className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Back Button */}
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to cart
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Delivery Address</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="123 Main St, Apt 4B"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Instructions (Optional)
                  </label>
                  <textarea
                    value={deliveryInstructions}
                    onChange={(e) => setDeliveryInstructions(e.target.value)}
                    placeholder="e.g., Leave at door, Ring doorbell"
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Time */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Delivery Time</h2>
              </div>
              
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-green-500 transition-colors">
                  <input
                    type="radio"
                    name="deliveryTime"
                    value="asap"
                    checked={deliveryTime === 'asap'}
                    onChange={(e) => setDeliveryTime(e.target.value)}
                    className="w-5 h-5 text-green-600"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">As soon as possible</div>
                    <div className="text-sm text-gray-600">30-45 minutes</div>
                  </div>
                </label>
                
                <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-green-500 transition-colors">
                  <input
                    type="radio"
                    name="deliveryTime"
                    value="scheduled"
                    checked={deliveryTime === 'scheduled'}
                    onChange={(e) => setDeliveryTime(e.target.value)}
                    className="w-5 h-5 text-green-600"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">Schedule for later</div>
                    <div className="text-sm text-gray-600">Choose a time slot</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-purple-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Payment Method</h2>
              </div>
              
              <div className="space-y-3 mb-6">
                <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-green-500 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'card')}
                    className="w-5 h-5 text-green-600"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">Credit/Debit Card</div>
                    <div className="text-sm text-gray-600">Pay securely with Stripe</div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-10 h-6 bg-gradient-to-r from-blue-600 to-blue-400 rounded flex items-center justify-center text-white text-xs font-bold">VISA</div>
                    <div className="w-10 h-6 bg-gradient-to-r from-red-600 to-orange-500 rounded flex items-center justify-center text-white text-xs font-bold">MC</div>
                  </div>
                </label>
                
                <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-green-500 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="chapa"
                    checked={paymentMethod === 'chapa'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'chapa')}
                    className="w-5 h-5 text-green-600"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">Pay with Chapa</div>
                    <div className="text-sm text-gray-600">Cards, Mobile Money, Bank Transfer</div>
                  </div>
                  <div className="flex gap-1">
                    <div className="w-8 h-6 bg-green-600 rounded flex items-center justify-center text-white text-xs font-bold">ETB</div>
                  </div>
                </label>
                
                <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-green-500 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    checked={paymentMethod === 'cash'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'cash')}
                    className="w-5 h-5 text-green-600"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">Cash on Delivery</div>
                    <div className="text-sm text-gray-600">Pay when you receive</div>
                  </div>
                </label>
              </div>

              {/* Stripe Payment Form */}
              {paymentMethod === 'card' && clientSecret && (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <CheckoutForm
                    amount={total}
                    onSuccess={() => {
                      clearCart();
                      router.push('/orders/success');
                    }}
                  />
                </Elements>
              )}

              {/* Chapa Payment Form */}
              {paymentMethod === 'chapa' && (
                <div className="mt-6">
                  <ChapaPayment
                    amount={total * 55}
                    cartId={`temp-cart-${Date.now()}`}
                    userEmail={user?.email || ''}
                    userPhone={user?.phone || '+251'}
                    onSuccess={(orderId) => {
                      clearCart();
                      router.push(`/orders/${orderId}/success`);
                    }}
                    onError={(error) => {
                      console.error('Chapa payment error:', error);
                    }}
                  />
                </div>
              )}

              {/* Cash Payment Button */}
              {paymentMethod === 'cash' && (
                <button
                  onClick={handlePlaceOrder}
                  disabled={!deliveryAddress || isProcessing}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      Place Order - ${total.toFixed(2)}
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
              
              {/* Items */}
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">{item.name}</h3>
                      <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                      <p className="text-sm font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold text-gray-900">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-semibold text-gray-900">
                    {deliveryFee === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      `$${deliveryFee.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Service Fee</span>
                  <span className="font-semibold text-gray-900">${serviceFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (8%)</span>
                  <span className="font-semibold text-gray-900">${tax.toFixed(2)}</span>
                </div>
                
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-lg font-bold text-green-600">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Free Delivery Banner */}
              {subtotal < 35 && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-xl">
                  <p className="text-xs text-green-800">
                    Add <span className="font-bold">${(35 - subtotal).toFixed(2)}</span> more for FREE delivery!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
