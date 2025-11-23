'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock } from 'lucide-react';

interface Store {
  _id: string;
  name: string;
  description: string;
  logo: string;
  coverImage: string;
  rating: number;
  deliveryFee: number;
  minimumOrder: number;
}

// Fallback store data in case the API call fails
const fallbackStores: Store[] = [
  {
    _id: 'store1',
    name: 'Fresh Grocery',
    description: 'Your local grocery store with fresh produce and essentials.',
    logo: 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=800&h=600&fit=crop&q=90',
    coverImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&h=800&fit=crop&q=90',
    rating: 4.7,
    deliveryFee: 3.99,
    minimumOrder: 10.00,
  },
  {
    _id: 'store2',
    name: 'Organic Market',
    description: 'Specializing in organic and locally sourced products.',
    logo: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800&h=600&fit=crop&q=90',
    coverImage: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=1200&h=800&fit=crop&q=90',
    rating: 4.5,
    deliveryFee: 4.99,
    minimumOrder: 15.00,
  },
  {
    _id: 'store3',
    name: 'Quick Mart',
    description: 'Fast delivery of everyday essentials and groceries.',
    logo: 'https://images.unsplash.com/photo-1601598851547-4302969d0614?w=800&h=600&fit=crop&q=90',
    coverImage: 'https://images.unsplash.com/photo-1601598851547-4302969d0614?w=1200&h=800&fit=crop&q=90',
    rating: 4.2,
    deliveryFee: 2.99,
    minimumOrder: 5.00,
  },
  {
    _id: 'store4',
    name: 'Gourmet Deli',
    description: 'Premium deli selections, cheeses, and prepared foods.',
    logo: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&h=600&fit=crop&q=90',
    coverImage: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1200&h=800&fit=crop&q=90',
    rating: 4.8,
    deliveryFee: 5.99,
    minimumOrder: 20.00,
  },
];

export default function FeaturedStores() {
  const [stores, setStores] = useState<Store[]>(fallbackStores);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        // Only fetch in development or if API URL is configured
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiUrl && process.env.NODE_ENV === 'production') {
          console.warn('API URL not configured in production');
          return;
        }
        
        const baseUrl = apiUrl || 'http://localhost:5001';
        const response = await fetch(`${baseUrl}/api/stores?limit=4`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch stores');
        }
        
        const data = await response.json();
        if (data.stores && data.stores.length > 0) {
          setStores(data.stores);
        }
      } catch (err) {
        console.error('Error fetching stores:', err);
        setError('Failed to load stores. Using fallback data.');
        // Keep fallback stores
      }
    };

    fetchStores();
  }, []);

  const displayStores = stores;

  if (error && stores.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">{error}</p>
        <p>Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {displayStores.map((store) => (
        <Link
          key={store._id}
          href={`/stores/${store._id}`}
          className="group relative"
        >
          {/* Glow effect on hover */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
          
          {/* Card */}
          <div className="relative bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-2xl hover:border-gray-300 transition-all duration-300 hover:-translate-y-1">
            {/* Store Image */}
            <div className="relative h-44 bg-gradient-to-br from-gray-100 to-gray-50 overflow-hidden">
              <Image
                src={store.logo || '/images/store-placeholder.jpg'}
                alt={store.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                sizes="(max-width: 768px) 50vw, 25vw"
                quality={90}
                priority={false}
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Promotional badge */}
              {store.rating >= 4.5 && (
                <div className="absolute top-3 right-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm">
                  ⭐ Popular
                </div>
              )}
            </div>
            
            {/* Store Info */}
            <div className="p-5">
              <h3 className="font-bold text-lg mb-2 text-gray-900 group-hover:text-green-600 transition-colors">
                {store.name}
              </h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">
                {store.description}
              </p>
              
              {/* Stats */}
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 py-1 rounded-lg font-semibold">
                  <span className="text-yellow-500">★</span>
                  {store.rating.toFixed(1)}
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="font-medium">30-45 min</span>
                </div>
              </div>
              
              {/* Delivery Fee */}
              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-sm text-gray-500">Delivery fee</span>
                <span className="text-sm font-bold text-gray-900">
                  ${store.deliveryFee.toFixed(2)}
                </span>
              </div>
            </div>
            
            {/* Shimmer effect */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
