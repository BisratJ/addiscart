'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Plus, Minus, Trash2, Home } from 'lucide-react';
import { useCart } from '@/app/contexts/CartContext';
import CategorySidebar from '@/app/components/CategorySidebar';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  onSale?: boolean;
  images: string[];
  unit: string;
  stock: number;
  isFeatured?: boolean;
  brand?: string;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  image: string;
  parentCategory?: {
    _id: string;
    name: string;
    slug: string;
  };
  subcategories?: Array<{
    _id: string;
    name: string;
    slug: string;
    icon: string;
  }>;
  products?: Product[];
  store: {
    _id: string;
    name: string;
    logo: string;
  };
}

export default function CategoryPage() {
  const params = useParams();
  const storeId = params?.storeId as string;
  const categorySlug = params?.categorySlug as string;
  
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { cartItems, addToCart, updateQuantity, removeFromCart } = useCart();

  useEffect(() => {
    const fetchCategoryAndProducts = async () => {
      try {
        setLoading(true);
        
        // Fetch category details
        const categoryResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/categories/slug/${categorySlug}/${storeId}`
        );
        
        if (!categoryResponse.ok) {
          throw new Error('Category not found');
        }
        
        const categoryData = await categoryResponse.json();
        setCategory(categoryData);
        
        // Fetch products in this category
        const productsResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/products?category=${categoryData._id}&store=${storeId}`
        );
        
        if (productsResponse.ok) {
          const productsData = await productsResponse.json();
          setProducts(productsData.products || []);
        }
      } catch (err) {
        console.error('Error fetching category:', err);
        setError('Failed to load category');
      } finally {
        setLoading(false);
      }
    };

    if (storeId && categorySlug) {
      fetchCategoryAndProducts();
    }
  }, [storeId, categorySlug]);

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product._id,
      name: product.name,
      price: product.onSale && product.salePrice ? product.salePrice : product.price,
      originalPrice: product.price,
      image: product.images[0] || '',
      unit: product.unit
    });
  };

  const handleIncrement = (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const currentQty = cartItems[productId]?.quantity || 0;
    updateQuantity(productId, currentQty + 1);
  };

  const handleDecrement = (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const currentQty = cartItems[productId]?.quantity || 0;
    if (currentQty > 0) {
      updateQuantity(productId, currentQty - 1);
    }
  };

  const handleRemove = (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    removeFromCart(productId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4">
                  <div className="aspect-square bg-gray-200 rounded-xl mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Category Not Found</h1>
            <Link href={`/stores/${storeId}`} className="text-green-600 hover:text-green-700">
              Return to store
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-600 hover:text-green-600 flex items-center gap-1">
              <Home className="w-4 h-4" />
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <Link href={`/stores/${storeId}`} className="text-gray-600 hover:text-green-600">
              {category.store.name}
            </Link>
            {category.parentCategory && (
              <>
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <Link 
                  href={`/stores/${storeId}/categories/${category.parentCategory.slug}`}
                  className="text-gray-600 hover:text-green-600"
                >
                  {category.parentCategory.name}
                </Link>
              </>
            )}
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900 font-medium">{category.name}</span>
          </nav>
        </div>
      </div>

      {/* Category Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl flex items-center justify-center text-4xl">
              {category.icon}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{category.name}</h1>
              <p className="text-gray-600">{category.description}</p>
            </div>
          </div>

          {/* Subcategories */}
          {category.subcategories && category.subcategories.length > 0 && (
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
              {category.subcategories.map((subcat) => (
                <Link
                  key={subcat._id}
                  href={`/stores/${storeId}/categories/${subcat.slug}`}
                  className="flex-shrink-0 flex items-center gap-2 bg-gray-50 hover:bg-green-50 border border-gray-200 hover:border-green-500 px-4 py-2 rounded-xl transition-all"
                >
                  <span className="text-xl">{subcat.icon}</span>
                  <span className="text-sm font-medium text-gray-700">{subcat.name}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 flex gap-6">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <CategorySidebar 
            storeId={storeId} 
            currentCategorySlug={categorySlug}
            className="sticky top-32"
          />
        </aside>

        {/* Products Grid */}
        <main className="flex-1">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {products.length} {products.length === 1 ? 'Product' : 'Products'}
            </h2>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No products found in this category.</p>
              <Link 
                href={`/stores/${storeId}`}
                className="inline-block mt-4 text-green-600 hover:text-green-700 font-medium"
              >
                Browse all products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {products.map((product) => (
                <Link
                  key={product._id}
                  href={`/products/${product._id}`}
                  className="bg-white rounded-2xl border border-gray-100 hover:border-green-200 hover:shadow-2xl transition-all duration-300 relative group overflow-hidden"
                >
                  {/* Add to Cart Button */}
                  {!cartItems[product._id] ? (
                    <button 
                      onClick={(e) => handleAddToCart(product, e)}
                      className="absolute top-2 right-2 z-10 bg-green-600 text-white px-3 py-1.5 rounded-full font-semibold hover:bg-green-700 transition-colors shadow-sm flex items-center gap-1 text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </button>
                  ) : (
                    <div className="absolute top-2 right-2 z-10 bg-green-700 text-white rounded-full font-bold shadow-lg flex items-center gap-2 px-2 py-1.5">
                      <button
                        onClick={(e) => {
                          if (cartItems[product._id].quantity > 1) {
                            handleDecrement(product._id, e);
                          } else {
                            handleRemove(product._id, e);
                          }
                        }}
                        className="hover:bg-green-800 rounded-full p-1 transition-colors"
                      >
                        {cartItems[product._id].quantity > 1 ? (
                          <Minus className="w-4 h-4" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                      <span className="text-sm px-2">{cartItems[product._id].quantity}</span>
                      <button
                        onClick={(e) => handleIncrement(product._id, e)}
                        className="hover:bg-green-800 rounded-full p-1 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  
                  {/* Product Image */}
                  <div className="aspect-square relative bg-gradient-to-br from-gray-50 to-white p-4 flex items-center justify-center overflow-hidden">
                    <div className="relative w-full h-full">
                      <Image
                        src={product.images[0] || 'https://placehold.co/600x600/CCCCCC/666666/png?text=Product'}
                        alt={product.name}
                        fill
                        className="object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    {product.onSale && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
                        Sale
                      </div>
                    )}
                  </div>
                  
                  {/* Product Info */}
                  <div className="p-4 space-y-2">
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-2 leading-snug min-h-[40px]">
                      {product.name}
                    </h3>
                    
                    <p className="text-xs text-gray-500">{product.unit}</p>
                    
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-lg font-bold text-gray-900">
                        ${product.onSale && product.salePrice ? product.salePrice.toFixed(2) : product.price.toFixed(2)}
                      </span>
                      {product.onSale && product.salePrice && (
                        <span className="text-sm text-gray-400 line-through">
                          ${product.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
