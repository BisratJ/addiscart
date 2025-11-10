'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { SkeletonProductCard } from '@/app/components/ui/SkeletonCard';
import { useAuth } from '@/app/hooks/useAuth';
import { 
  ArrowLeft, 
  Check, 
  ChevronRight, 
  Clock, 
  CreditCard, 
  MapPin, 
  Package, 
  ShoppingBag, 
  Truck,
  X
} from 'lucide-react';

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

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { orderId } = params;
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Format date to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'out_for_delivery':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5" />;
      case 'processing':
        return <Package className="h-5 w-5" />;
      case 'out_for_delivery':
        return <Truck className="h-5 w-5" />;
      case 'delivered':
        return <Check className="h-5 w-5" />;
      case 'cancelled':
        return <X className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  // Load order from API or fallback to localStorage with caching
  useEffect(() => {
    // Skip if still loading auth or not authenticated
    if (authLoading) return;
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    
    const fetchOrder = async () => {
      setIsLoading(true);
      
      // Check for cached order data first
      const cachedOrderKey = `order_${orderId}`;
      const cachedOrder = sessionStorage.getItem(cachedOrderKey);
      
      if (cachedOrder) {
        try {
          const parsedOrder = JSON.parse(cachedOrder);
          // Update status based on time if needed
          const orderDate = new Date(parsedOrder.date);
          const now = new Date();
          const minutesSinceOrder = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60));
          
          let status = parsedOrder.status;
          if (minutesSinceOrder > 30 && status === 'processing') {
            status = 'out_for_delivery';
          }
          if (minutesSinceOrder > 60 && status === 'out_for_delivery') {
            status = 'delivered';
          }
          
          setOrder({
            ...parsedOrder,
            status,
          });
          setIsLoading(false);
          return;
        } catch (e) {
          console.error('Error parsing cached order:', e);
          // Continue with fetch if cache parsing fails
        }
      }
      
      try {
        // Try to fetch from API with AbortController for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
        
        try {
          const response = await fetch(`http://localhost:5001/api/orders/${orderId}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            signal: controller.signal
          });
          
          clearTimeout(timeoutId);
          
          if (response.ok) {
            const data = await response.json();
            // Cache the result
            sessionStorage.setItem(cachedOrderKey, JSON.stringify(data));
            setOrder(data);
            setIsLoading(false);
            return;
          }
        } catch (fetchError) {
          // If fetch aborted or failed, continue to fallback
          clearTimeout(timeoutId);
          console.log('API fetch failed, using fallback:', fetchError);
        }
        
        // If API fails, try localStorage
        const savedOrders = localStorage.getItem('orders');
        
        if (savedOrders) {
          const orders = JSON.parse(savedOrders);
          const foundOrder = orders.find((o: any) => o.id === orderId);
          
          if (foundOrder) {
            // Simulate a status update based on time
            const orderDate = new Date(foundOrder.date);
            const now = new Date();
            const minutesSinceOrder = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60));
            
            let status = foundOrder.status;
            if (minutesSinceOrder > 30) {
              status = 'out_for_delivery';
            }
            if (minutesSinceOrder > 60) {
              status = 'delivered';
            }
            
            const updatedOrder = {
              ...foundOrder,
              status,
            };
            
            // Cache the result
            sessionStorage.setItem(cachedOrderKey, JSON.stringify(updatedOrder));
            setOrder(updatedOrder);
            setIsLoading(false);
            return;
          }
        }
        
        // If no order found, create a mock one
        const mockOrder = {
          id: orderId as string,
          date: new Date().toISOString(),
          status: 'processing',
          items: {
            'prod1': 2,
            'prod2': 1,
          },
          store: {
            id: 'store1',
            name: 'Fresh Grocery',
            logo: '/images/store1.jpg',
          },
          subtotal: 3.37,
          tax: 0.29,
          deliveryFee: 3.99,
          total: 7.65,
          address: {
            street: '123 Main St',
            city: 'San Francisco',
            state: 'CA',
            zipCode: '94105',
          },
          deliveryTime: 'Today, 2:00 PM - 3:00 PM',
          paymentMethod: {
            brand: 'Visa',
            last4: '4242',
          },
        };
        
        // Cache the mock order
        sessionStorage.setItem(cachedOrderKey, JSON.stringify(mockOrder));
        setOrder(mockOrder);
      } catch (error) {
        console.error('Error in order fetching flow:', error);
        // Create a mock order if all else fails
        const fallbackOrder = {
          id: orderId as string,
          date: new Date().toISOString(),
          status: 'processing',
          items: {
            'prod1': 2,
            'prod2': 1,
          },
          store: {
            id: 'store1',
            name: 'Fresh Grocery',
            logo: '/images/store1.jpg',
          },
          subtotal: 3.37,
          tax: 0.29,
          deliveryFee: 3.99,
          total: 7.65,
          address: {
            street: '123 Main St',
            city: 'San Francisco',
            state: 'CA',
            zipCode: '94105',
          },
          deliveryTime: 'Today, 2:00 PM - 3:00 PM',
          paymentMethod: {
            brand: 'Visa',
            last4: '4242',
          },
        };
        setOrder(fallbackOrder);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [authLoading, isAuthenticated, orderId, router]);

  if (authLoading || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="h-6 w-32 bg-gray-200 rounded-md animate-pulse"></div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <div className="h-8 w-48 bg-gray-200 rounded-md animate-pulse mb-2"></div>
            <div className="h-5 w-36 bg-gray-200 rounded-md animate-pulse"></div>
          </div>
          <div className="mt-2 md:mt-0 h-6 w-24 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items Skeleton */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse mr-3"></div>
                <div className="h-6 w-32 bg-gray-200 rounded-md animate-pulse"></div>
              </div>
              
              <div className="space-y-4">
                {[...Array(3)].map((_, index) => (
                  <SkeletonProductCard key={index} />
                ))}
              </div>
            </div>
            
            {/* Delivery Information Skeleton */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="h-6 w-48 bg-gray-200 rounded-md animate-pulse mb-4"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="h-6 w-36 bg-gray-200 rounded-md animate-pulse mb-2"></div>
                  <div className="h-4 w-48 bg-gray-200 rounded-md animate-pulse mb-1"></div>
                  <div className="h-4 w-32 bg-gray-200 rounded-md animate-pulse"></div>
                </div>
                
                <div>
                  <div className="h-6 w-32 bg-gray-200 rounded-md animate-pulse mb-2"></div>
                  <div className="h-4 w-40 bg-gray-200 rounded-md animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Order Summary Skeleton */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="h-6 w-36 bg-gray-200 rounded-md animate-pulse mb-4"></div>
              
              <div className="space-y-2 mb-4">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="flex justify-between">
                    <div className="h-4 w-20 bg-gray-200 rounded-md animate-pulse"></div>
                    <div className="h-4 w-16 bg-gray-200 rounded-md animate-pulse"></div>
                  </div>
                ))}
              </div>
              
              <div className="h-10 w-full bg-gray-200 rounded-md animate-pulse mt-6"></div>
              <div className="h-10 w-full bg-gray-200 rounded-md animate-pulse mt-3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <ShoppingBag className="mx-auto h-16 w-16 text-gray-400 mb-4" />
        <h1 className="text-2xl font-bold mb-4">Order not found</h1>
        <p className="mb-4">We couldn't find the order you're looking for.</p>
        <Link
          href="/orders"
          className="bg-brand-500 text-white px-4 py-2 rounded-md hover:bg-brand-600 transition-colors"
        >
          View All Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/orders" className="flex items-center text-brand-500 font-medium">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Orders
        </Link>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Order #{order.id}</h1>
          <p className="text-gray-600">Placed on {formatDate(order.date)}</p>
        </div>
        <div className={`${getStatusColor(order.status)} px-3 py-1 rounded-full flex items-center mt-2 md:mt-0`}>
          {getStatusIcon(order.status)}
          <span className="ml-1 font-medium capitalize">{order.status.replace('_', ' ')}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3 flex-shrink-0">
                <Image
                  src={order.store.logo || '/images/store-placeholder.jpg'}
                  alt={order.store.name}
                  fill
                  sizes="40px"
                  className="object-cover"
                  priority
                />
              </div>
              <h2 className="text-lg font-semibold">{order.store.name}</h2>
            </div>
            
            <div className="space-y-4">
              {Object.entries(order.items).map(([productId, quantity]: [string, any]) => {
                const product = mockProducts.find(p => p.id === productId);
                if (!product) return null;
                
                const price = product.onSale ? (product.salePrice || product.price) : product.price;
                const itemTotal = price * quantity;
                
                return (
                  <div key={productId} className="flex items-center">
                    <div className="relative w-16 h-16 rounded-md overflow-hidden mr-4 flex-shrink-0">
                      <Image
                        src={product.image || '/images/product-placeholder.jpg'}
                        alt={product.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-medium">{product.name}</h3>
                      <p className="text-sm text-gray-600">
                        ${price.toFixed(2)} × {quantity} {product.unit}
                        {quantity > 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="font-medium">${itemTotal.toFixed(2)}</div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Delivery Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Delivery Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center mb-2">
                  <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                  <h3 className="font-medium">Delivery Address</h3>
                </div>
                <p className="text-gray-600">{order.address.street}</p>
                <p className="text-gray-600">
                  {order.address.city}, {order.address.state} {order.address.zipCode}
                </p>
              </div>
              
              <div>
                <div className="flex items-center mb-2">
                  <Clock className="h-5 w-5 text-gray-400 mr-2" />
                  <h3 className="font-medium">Delivery Time</h3>
                </div>
                <p className="text-gray-600">{order.deliveryTime}</p>
              </div>
            </div>
          </div>
          
          {/* Order Timeline */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Order Timeline</h2>
            
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
              
              <div className="relative pl-12 pb-8">
                <div className="absolute left-0 rounded-full bg-green-500 text-white w-8 h-8 flex items-center justify-center">
                  <Check className="h-5 w-5" />
                </div>
                <h3 className="font-medium">Order Placed</h3>
                <p className="text-sm text-gray-600">{formatDate(order.date)}</p>
              </div>
              
              <div className={`relative pl-12 pb-8 ${order.status === 'pending' ? 'opacity-50' : ''}`}>
                <div className={`absolute left-0 rounded-full w-8 h-8 flex items-center justify-center ${
                  order.status !== 'pending' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {order.status !== 'pending' ? <Check className="h-5 w-5" /> : <Package className="h-5 w-5" />}
                </div>
                <h3 className="font-medium">Order Processing</h3>
                <p className="text-sm text-gray-600">Your order is being prepared</p>
              </div>
              
              <div className={`relative pl-12 pb-8 ${['pending', 'processing'].includes(order.status) ? 'opacity-50' : ''}`}>
                <div className={`absolute left-0 rounded-full w-8 h-8 flex items-center justify-center ${
                  order.status === 'out_for_delivery' || order.status === 'delivered' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {order.status === 'out_for_delivery' || order.status === 'delivered' ? <Check className="h-5 w-5" /> : <Truck className="h-5 w-5" />}
                </div>
                <h3 className="font-medium">Out for Delivery</h3>
                <p className="text-sm text-gray-600">Your order is on its way</p>
              </div>
              
              <div className={`relative pl-12 ${order.status !== 'delivered' ? 'opacity-50' : ''}`}>
                <div className={`absolute left-0 rounded-full w-8 h-8 flex items-center justify-center ${
                  order.status === 'delivered' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {order.status === 'delivered' ? <Check className="h-5 w-5" /> : <ShoppingBag className="h-5 w-5" />}
                </div>
                <h3 className="font-medium">Delivered</h3>
                <p className="text-sm text-gray-600">Enjoy your groceries!</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span>${order.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Fee</span>
                <span>${order.deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <div className="flex items-center mb-2">
                <CreditCard className="h-5 w-5 text-gray-400 mr-2" />
                <h3 className="font-medium">Payment Method</h3>
              </div>
              <div className="flex items-center">
                <div className="mr-3">
                  {order.paymentMethod.brand === 'Visa' ? (
                    <div className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
                      VISA
                    </div>
                  ) : (
                    <div className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                      MC
                    </div>
                  )}
                </div>
                <p className="text-gray-600">•••• {order.paymentMethod.last4}</p>
              </div>
            </div>
            
            <div className="mt-6">
              <Link
                href={`/stores/${order.store.id}`}
                className="block w-full bg-brand-500 text-white py-2 rounded-md hover:bg-brand-600 transition-colors text-center font-medium"
              >
                Order Again
              </Link>
              
              <button className="w-full border border-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-50 transition-colors mt-3 font-medium">
                Need Help?
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
