'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/hooks/useAuth';
import { ShoppingBag, Clock, ChevronRight } from 'lucide-react';

// Mock order data since we don't have a real backend connection
const mockOrders = [
  {
    id: 'ORD-231109-1234',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'delivered',
    total: 45.67,
    items: 5,
    store: {
      name: 'Fresh Grocery',
      logo: 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
    }
  },
  {
    id: 'ORD-231105-5678',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'delivered',
    total: 32.99,
    items: 3,
    store: {
      name: 'Organic Market',
      logo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
    }
  }
];

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState(mockOrders);
  const [isLoading, setIsLoading] = useState(false);

  // Format date to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">Your Orders</h1>
        <Link 
          href="/stores" 
          className="bg-brand-500 text-white px-4 py-2 rounded-md hover:bg-brand-600 transition-colors text-sm sm:text-base active:scale-95 touch-manipulation w-full sm:w-auto"
        >
          Shop Now
        </Link>
      </div>

      {user && (
        <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 mb-4 sm:mb-6">
          <h2 className="text-base sm:text-lg font-semibold mb-1.5 sm:mb-2">Welcome back, {user.name}!</h2>
          <p className="text-sm sm:text-base text-gray-600">
            View your order history below or start shopping at our stores.
          </p>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <ShoppingBag className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No orders yet</h2>
          <p className="text-gray-500 mb-4">
            You haven't placed any orders yet. Start shopping to place your first order!
          </p>
          <Link
            href="/stores"
            className="bg-brand-500 text-white px-6 py-2 rounded-md hover:bg-brand-600 transition-colors"
          >
            Browse Stores
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-3 sm:p-4 md:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-3 sm:mb-4">
                  <div className="flex items-center">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden mr-2 sm:mr-3 flex-shrink-0">
                      <img
                        src={order.store.logo}
                        alt={order.store.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-semibold">{order.store.name}</h3>
                      <p className="text-xs sm:text-sm text-gray-500 flex items-center">
                        <Clock size={12} className="sm:w-3.5 sm:h-3.5 mr-1" />
                        {formatDate(order.date)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`${getStatusColor(
                        order.status
                      )} text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full capitalize`}
                    >
                      {order.status}
                    </span>
                    <span className="text-sm sm:text-base font-semibold">${order.total.toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span className="text-gray-600">{order.items} items</span>
                  <div className="flex items-center text-brand-500">
                    <span>View details</span>
                    <ChevronRight size={14} className="sm:w-4 sm:h-4" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
