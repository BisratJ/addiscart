'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  image: string;
  order: number;
  isFeatured: boolean;
  productCount?: number;
  metadata?: {
    color?: string;
    keywords?: string[];
  };
}

interface CategoryGridProps {
  storeId?: string;
  featured?: boolean;
  limit?: number;
  columns?: 2 | 3 | 4 | 6;
}

export default function CategoryGrid({ 
  storeId, 
  featured = false, 
  limit,
  columns = 6 
}: CategoryGridProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        
        if (storeId) params.append('store', storeId);
        if (featured) params.append('featured', 'true');
        
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/categories?${params}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        
        let data = await response.json();
        
        // Apply limit if specified
        if (limit && data.length > limit) {
          data = data.slice(0, limit);
        }
        
        setCategories(data);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [storeId, featured, limit]);

  if (loading) {
    return (
      <div className={`grid grid-cols-2 md:grid-cols-4 lg:grid-cols-${columns} gap-4`}>
        {[...Array(limit || 12)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-gray-200 animate-pulse">
            <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No categories available</p>
      </div>
    );
  }

  const gridColsClass = {
    2: 'grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
    6: 'lg:grid-cols-6'
  };

  return (
    <div className={`grid grid-cols-2 ${gridColsClass[columns]} gap-4`}>
      {categories.map((category) => (
        <Link
          key={category._id}
          href={storeId ? `/stores/${storeId}/categories/${category.slug}` : `/categories/${category.slug}`}
          className="group relative bg-white rounded-2xl p-6 hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-green-500"
        >
          {/* Gradient overlay on hover */}
          {category.metadata?.color && (
            <div className={`absolute inset-0 bg-gradient-to-br ${category.metadata.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl`}></div>
          )}
          
          <div className="relative z-10 text-center">
            {/* Icon */}
            <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform duration-300">
              {category.icon}
            </div>
            
            {/* Name */}
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              {category.name}
            </h3>
            
            {/* Product count */}
            {category.productCount !== undefined && category.productCount > 0 && (
              <p className="text-xs text-gray-500">
                {category.productCount} items
              </p>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
