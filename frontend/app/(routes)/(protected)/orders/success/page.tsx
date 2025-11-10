'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CheckCircle, Package, Clock, MapPin, Home } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function OrderSuccessPage() {
  const router = useRouter();
  const [orderNumber] = useState(() => 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase());
  const [estimatedTime] = useState(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 35);
    return now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  });

  useEffect(() => {
    // Trigger confetti animation
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#10b981', '#34d399', '#6ee7b7']
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#10b981', '#34d399', '#6ee7b7']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-green-500 rounded-full blur-2xl opacity-30 animate-pulse"></div>
            <div className="relative w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-2xl">
              <CheckCircle className="w-14 h-14 text-white" strokeWidth={2.5} />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mt-6 mb-2">
            Order Placed Successfully!
          </h1>
          <p className="text-lg text-gray-600">
            Thank you for your order. We're preparing it now!
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-8 mb-6">
          {/* Order Number */}
          <div className="text-center mb-6 pb-6 border-b border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Order Number</p>
            <p className="text-2xl font-bold text-gray-900">{orderNumber}</p>
          </div>

          {/* Status Steps */}
          <div className="space-y-4 mb-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Order Confirmed</h3>
                <p className="text-sm text-gray-600">Your order has been received and confirmed</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Preparing Order</h3>
                <p className="text-sm text-gray-600">Your items are being picked and packed</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Out for Delivery</h3>
                <p className="text-sm text-gray-600">Your order will be on its way soon</p>
              </div>
            </div>
          </div>

          {/* Estimated Delivery */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 flex items-center gap-3">
            <Clock className="w-6 h-6 text-green-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-900">Estimated Delivery</p>
              <p className="text-lg font-bold text-green-600">{estimatedTime}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/orders"
            className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-xl font-semibold transition-colors"
          >
            <Package className="w-5 h-5" />
            Track Order
          </Link>
          
          <Link
            href="/"
            className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-900 px-6 py-4 rounded-xl font-semibold border-2 border-gray-200 transition-colors"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Link>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 mb-2">
            A confirmation email has been sent to your email address
          </p>
          <p className="text-xs text-gray-500">
            Need help? <Link href="/help" className="text-green-600 hover:text-green-700 font-semibold">Contact Support</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
