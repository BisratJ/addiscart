'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface Category {
  _id: string;
  name: string;
  slug: string;
  icon: string;
  productCount?: number;
  subcategories?: Category[];
}

interface CategorySidebarProps {
  storeId: string;
  currentCategorySlug?: string;
  className?: string;
}

export default function CategorySidebar({ 
  storeId, 
  currentCategorySlug,
  className = '' 
}: CategorySidebarProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/categories/hierarchy/${storeId}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        
        const data = await response.json();
        setCategories(data);
        
        // Auto-expand category if current category is a subcategory
        if (currentCategorySlug) {
          data.forEach((cat: Category) => {
            if (cat.subcategories?.some((sub: Category) => sub.slug === currentCategorySlug)) {
              setExpandedCategories(prev => new Set(prev).add(cat._id));
            }
          });
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [storeId, currentCategorySlug]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-2xl border border-gray-200 shadow-sm p-5 ${className}`}>
        <div className="space-y-2 animate-pulse">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-8 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <div className={`bg-white rounded-2xl border border-gray-200 shadow-sm p-5 ${className}`}>
      <div className="space-y-1">
        <h3 className="font-bold text-base text-gray-900 mb-4 flex items-center gap-2">
          <span className="text-green-600">📋</span>
          Browse categories
        </h3>
        
        <div className="max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pr-2">
          {categories.map((category) => (
            <div key={category._id} className="mb-1">
              {/* Parent Category */}
              <div className="flex items-center">
                <Link
                  href={`/stores/${storeId}/categories/${category.slug}`}
                  className={`flex-1 text-sm font-medium px-3 py-2 rounded-lg transition-all ${
                    currentCategorySlug === category.slug
                      ? 'text-green-600 bg-green-50'
                      : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                  }`}
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.name}
                  {category.productCount !== undefined && category.productCount > 0 && (
                    <span className="ml-2 text-xs text-gray-500">({category.productCount})</span>
                  )}
                </Link>
                
                {/* Expand/Collapse button if has subcategories */}
                {category.subcategories && category.subcategories.length > 0 && (
                  <button
                    onClick={() => toggleCategory(category._id)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    {expandedCategories.has(category._id) ? (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-500" />
                    )}
                  </button>
                )}
              </div>
              
              {/* Subcategories */}
              {category.subcategories && 
               category.subcategories.length > 0 && 
               expandedCategories.has(category._id) && (
                <div className="ml-6 mt-1 space-y-1">
                  {category.subcategories.map((subcat) => (
                    <Link
                      key={subcat._id}
                      href={`/stores/${storeId}/categories/${subcat.slug}`}
                      className={`block text-sm px-3 py-2 rounded-lg transition-all ${
                        currentCategorySlug === subcat.slug
                          ? 'text-green-600 bg-green-50 font-medium'
                          : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                      }`}
                    >
                      {subcat.name}
                      {subcat.productCount !== undefined && subcat.productCount > 0 && (
                        <span className="ml-2 text-xs text-gray-500">({subcat.productCount})</span>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
