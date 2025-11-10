'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Category {
  _id: string;
  name: string;
  slug: string;
  icon: string;
  order: number;
  metadata?: {
    color?: string;
  };
}

interface CategoryNavProps {
  storeId: string;
  featured?: boolean;
  className?: string;
}

export default function CategoryNav({ 
  storeId, 
  featured = true,
  className = '' 
}: CategoryNavProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        params.append('store', storeId);
        if (featured) params.append('featured', 'true');
        params.append('level', '0'); // Only top-level categories
        
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/categories?${params}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [storeId, featured]);

  if (loading) {
    return (
      <div className={`flex items-center gap-4 overflow-x-auto scrollbar-hide pb-3 ${className}`}>
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex-shrink-0 flex flex-col items-center gap-2 p-3 min-w-[95px] animate-pulse">
            <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
            <div className="h-3 w-16 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <div className={`flex items-center gap-4 overflow-x-auto scrollbar-hide pb-3 ${className}`}>
      {categories.map((category) => (
        <Link
          key={category._id}
          href={`/stores/${storeId}/categories/${category.slug}`}
          className="flex-shrink-0 flex flex-col items-center gap-2 p-3 hover:bg-gradient-to-b hover:from-green-50 hover:to-white rounded-2xl transition-all duration-200 min-w-[95px] group"
        >
          <div className={`w-16 h-16 bg-gradient-to-br ${category.metadata?.color || 'from-gray-50 to-gray-100'} rounded-full flex items-center justify-center text-3xl group-hover:scale-110 group-hover:shadow-md transition-all duration-200`}>
            {category.icon}
          </div>
          <span className="text-sm font-medium text-gray-700 text-center leading-tight group-hover:text-green-600 transition-colors">
            {category.name}
          </span>
        </Link>
      ))}
    </div>
  );
}
