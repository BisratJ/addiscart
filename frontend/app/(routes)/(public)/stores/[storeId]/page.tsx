'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Plus, ChevronRight, ChevronLeft, Trash2, Minus } from 'lucide-react';
import { useCart } from '@/app/contexts/CartContext';
import CategoryNav from '@/app/components/CategoryNav';
import CategorySidebar from '@/app/components/CategorySidebar';

// Mock store data
const storeData: any = {
  '1': { name: 'Safeway', logo: 'https://logo.clearbit.com/safeway.com', pricing: 'Pricing & fees' },
  '2': { name: 'Walgreens', logo: 'https://logo.clearbit.com/walgreens.com', pricing: 'Pricing & fees' },
  '3': { name: 'Costco', logo: 'https://logo.clearbit.com/costco.com', pricing: 'Pricing & fees' },
  '4': { name: 'Sprouts Farmers Market', logo: 'https://logo.clearbit.com/sprouts.com', pricing: 'Pricing & fees' },
  default: { name: 'Store', logo: 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=100&h=100&fit=crop', pricing: 'Pricing & fees' }
};

// Categories with icons
const categories = [
  { id: 'flyers', name: 'Flyers', icon: '📰' },
  { id: 'meat', name: 'Meat & Seafood', icon: '🥩' },
  { id: 'snacks', name: 'Snacks & Candy', icon: '🍬' },
  { id: 'dairy', name: 'Dairy & Eggs', icon: '🥛' },
  { id: 'alcohol', name: 'Alcohol', icon: '🍷' },
  { id: 'produce', name: 'Produce', icon: '🥬' },
  { id: 'frozen', name: 'Frozen', icon: '🧊' },
  { id: 'bakery', name: 'Bakery', icon: '🍞' },
  { id: 'beverages', name: 'Beverages', icon: '🥤' },
  { id: 'household', name: 'Household', icon: '🧹' },
  { id: 'prepared', name: 'Prepared Foods', icon: '🍱' },
  { id: 'deli', name: 'Deli', icon: '🥪' },
  { id: 'pantry', name: 'Pantry', icon: '🥫' },
  { id: 'personal', name: 'Personal Care', icon: '🧴' },
  { id: 'health', name: 'Health Care', icon: '💊' },
  { id: 'baby', name: 'Baby', icon: '👶' },
  { id: 'pets', name: 'Pets', icon: '🐾' },
  { id: 'floral', name: 'Floral', icon: '💐' },
];

// Mock deals
const deals = [
  {
    id: 1,
    name: 'Jell-O Butterscotch Pudding & Pie Filling Mix',
    image: 'https://placehold.co/600x600/FFD700/000000/png?text=Pudding',
    price: 1.69,
    originalPrice: 2.79,
    discount: 'Spend $24, save $4',
    unit: '3.5 oz',
    inStock: true,
  },
  {
    id: 2,
    name: 'Jell-O Zero Sugar Vanilla Flavor Instant Pudding',
    image: 'https://placehold.co/600x600/F5F5DC/000000/png?text=Vanilla',
    price: 1.99,
    badge: 'Low calorie',
    discount: 'Spend $24, save $4',
    unit: '1 oz',
    inStock: true,
  },
  {
    id: 3,
    name: "Alfaro's Artesano Hawaiian Bakery Buns",
    image: 'https://placehold.co/600x600/F4A460/FFFFFF/png?text=Buns',
    price: 4.49,
    originalPrice: 5.99,
    discount: '38% off',
    unit: '8 count',
    inStock: true,
  },
  {
    id: 4,
    name: 'Bertolli Garlic Vodka Sauce',
    image: 'https://placehold.co/600x600/DC143C/FFFFFF/png?text=Sauce',
    price: 3.99,
    originalPrice: 7.99,
    discount: '50% off',
    unit: '24 oz',
    inStock: true,
  },
];

// Mock products
const freshFruit = [
  {
    id: 101,
    name: 'Chilean Perfecto Grapes',
    image: 'https://placehold.co/600x600/9370DB/FFFFFF/png?text=Grapes',
    price: 3.99,
    originalPrice: 21.99,
    discount: '67% off',
    unit: '$1.99 / lb',
    weight: 'About 2.0 lb / package',
    badge: 'FRESH ESS GRAPES',
    inStock: true,
  },
  {
    id: 102,
    name: 'Red Seedless Grapes Bag',
    image: 'https://placehold.co/600x600/8B0000/FFFFFF/png?text=Red+Grapes',
    price: 4.99,
    originalPrice: 9.99,
    discount: '67% off',
    unit: '$1.99 / lb',
    weight: 'About 2.18 lb / package',
    inStock: true,
  },
  {
    id: 103,
    name: 'Banana',
    image: 'https://placehold.co/600x600/FFE135/000000/png?text=Banana',
    price: 0.49,
    unit: '$0.39 / lb',
    weight: 'About 0.45 lb each',
    inStock: true,
  },
  {
    id: 104,
    name: 'Fuyu Persimmons',
    image: 'https://placehold.co/600x600/FF8C00/FFFFFF/png?text=Persimmon',
    price: 1.49,
    originalPrice: 2.99,
    discount: '50% off',
    unit: '$2.99 / lb',
    inStock: true,
  },
  {
    id: 105,
    name: 'Strawberries',
    image: 'https://placehold.co/600x600/FF1493/FFFFFF/png?text=Strawberry',
    price: 9.99,
    discount: 'Buy 2, get 1 free',
    unit: '16 oz',
    inStock: true,
  },
  {
    id: 106,
    name: 'Honeycrisp Apples',
    image: 'https://placehold.co/600x600/DC143C/FFFFFF/png?text=Apple',
    price: 1.99,
    originalPrice: 2.49,
    discount: '25% off',
    unit: '$2.99 / lb',
    weight: 'About 0.5 lb each',
    badge: 'In season',
    inStock: true,
  },
];

// Sidebar categories
const sidebarCategories = [
  'Produce',
  'Meat & Seafood',
  'Dairy & Eggs',
  'Alcohol',
  'Snacks & Candy',
  'Prepared Foods',
  'Frozen',
  'Beverages',
  'Bakery',
  'Deli',
  'Household',
  'Breakfast',
  'Pets',
  'Floral',
  'Paper Goods & Laundry',
  'Canned Goods & Soups',
  'Dry Goods & Pasta',
  'Oils, Vinegars, & Spices',
  'Personal Care',
  'Condiments & Sauces',
  'Health Care',
  'Baking Essentials',
  'Kitchen Supplies',
  'Baby',
  'Miscellaneous',
  'Office & Craft',
  'Party & Gift Supplies',
  'Sales',
];

export default function StoreDetailPage() {
  const params = useParams();
  const storeId = params?.storeId as string;
  const store = storeData[storeId] || storeData.default;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { cartItems, addToCart, updateQuantity, removeFromCart } = useCart();

  const handleAddToCart = (product: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      unit: product.unit
    });
  };

  const handleIncrement = (product: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const currentQty = cartItems[product.id]?.quantity || 0;
    updateQuantity(product.id, currentQty + 1);
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Store Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-white rounded-xl shadow-md border-2 border-gray-100 flex items-center justify-center p-3 hover:shadow-lg transition-shadow">
                <Image
                  src={store.logo}
                  alt={store.name}
                  width={64}
                  height={64}
                  className="object-contain"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">{store.name}</h1>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-blue-600 hover:text-blue-700 hover:underline cursor-pointer font-medium">
                    ✓ 100% satisfaction guarantee
                  </span>
                  <span className="text-gray-300">•</span>
                  <span className="text-sm text-blue-600 hover:text-blue-700 hover:underline cursor-pointer font-medium">
                    + Add loyalty
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="#" className="text-sm text-gray-600 hover:text-green-600 font-medium transition-colors">
                {store.pricing}
              </Link>
              <button className="bg-gradient-to-r from-gray-900 to-gray-800 text-white px-8 py-3 rounded-xl font-bold hover:from-gray-800 hover:to-gray-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2">
                <span>🛒</span>
                Shop
              </button>
            </div>
          </div>

          {/* Category Navigation */}
          <div className="mt-8">
            <CategoryNav storeId={storeId} featured={true} />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 flex gap-6">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <CategorySidebar storeId={storeId} className="sticky top-32" />
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Flyer Deals Section */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6 pb-3 border-b-2 border-gray-100">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-1">Flyer deals Nov 5-11</h2>
                <p className="text-sm text-gray-600">Save big on your favorite items</p>
              </div>
              <Link href="#" className="text-sm font-bold text-green-600 hover:text-green-700 flex items-center gap-1 bg-green-50 px-4 py-2 rounded-lg hover:bg-green-100 transition-colors">
                View all (400+)
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {deals.map((product) => (
                <Link key={product.id} href={`/products/${product.id}`} className="bg-white rounded-2xl border border-gray-100 hover:border-green-200 hover:shadow-2xl transition-all duration-300 relative group overflow-hidden">
                  {/* Add Button or Cart Control - Top Right */}
                  {!cartItems[product.id] ? (
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
                          if (cartItems[product.id].quantity > 1) {
                            handleDecrement(product.id, e);
                          } else {
                            handleRemove(product.id, e);
                          }
                        }}
                        className="hover:bg-green-800 rounded-full p-1 transition-colors"
                      >
                        {cartItems[product.id].quantity > 1 ? (
                          <Minus className="w-4 h-4" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                      <span className="text-sm px-2">{cartItems[product.id].quantity} ct</span>
                      <button
                        onClick={(e) => handleIncrement(product, e)}
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
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-contain group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://placehold.co/600x600/CCCCCC/666666/png?text=Product';
                        }}
                      />
                    </div>
                    {/* Badge on Image */}
                    {product.badge && (
                      <div className="absolute top-2 left-2 bg-gray-100 px-2 py-1 rounded-md text-[10px] font-semibold text-gray-700">
                        {product.badge}
                      </div>
                    )}
                  </div>
                  
                  {/* Product Info */}
                  <div className="p-4 space-y-2">
                    {/* Product Name */}
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-2 leading-snug min-h-[40px]">{product.name}</h3>
                    
                    {/* Unit */}
                    <p className="text-xs text-gray-500">{product.unit}</p>
                    
                    {/* Price and Discount */}
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-lg font-bold text-gray-900">
                        ${product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-400 line-through">${product.originalPrice}</span>
                      )}
                      {product.discount && (
                        <span className="ml-auto bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                          {product.discount}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Fresh Fruit Section */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6 pb-3 border-b-2 border-gray-100">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-1">Fresh fruit</h2>
                <p className="text-sm text-gray-600">Handpicked and delivered fresh daily</p>
              </div>
              <Link href="#" className="text-sm font-bold text-green-600 hover:text-green-700 flex items-center gap-1 bg-green-50 px-4 py-2 rounded-lg hover:bg-green-100 transition-colors">
                View all (40+)
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {freshFruit.map((product) => (
                <Link key={product.id} href={`/products/${product.id}`} className="bg-white rounded-2xl border border-gray-100 hover:border-green-200 hover:shadow-2xl transition-all duration-300 relative group overflow-hidden">
                  {/* Add Button or Cart Control - Top Right */}
                  {!cartItems[product.id] ? (
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
                          if (cartItems[product.id].quantity > 1) {
                            handleDecrement(product.id, e);
                          } else {
                            handleRemove(product.id, e);
                          }
                        }}
                        className="hover:bg-green-800 rounded-full p-1 transition-colors"
                      >
                        {cartItems[product.id].quantity > 1 ? (
                          <Minus className="w-4 h-4" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                      <span className="text-sm px-2">{cartItems[product.id].quantity} ct</span>
                      <button
                        onClick={(e) => handleIncrement(product, e)}
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
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-contain group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://placehold.co/600x600/90EE90/006400/png?text=Fruit';
                        }}
                      />
                    </div>
                    {/* Badge on Image */}
                    {product.badge && (
                      <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded-md text-[10px] font-semibold">
                        {product.badge}
                      </div>
                    )}
                  </div>
                  
                  {/* Product Info */}
                  <div className="p-2.5 space-y-1.5 border-t border-gray-100">
                    {/* Price */}
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold text-gray-900">
                        ${product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-400 line-through">${product.originalPrice}</span>
                      )}
                    </div>
                    
                    {/* Discount Badge */}
                    {product.discount && (
                      <div className="bg-yellow-400 text-gray-900 text-xs font-bold px-2 py-0.5 rounded inline-block">
                        {product.discount}
                      </div>
                    )}
                    
                    {/* Product Name */}
                    <h3 className="text-sm text-gray-700 line-clamp-2 leading-snug min-h-[40px]">{product.name}</h3>
                    
                    {/* Unit */}
                    <p className="text-xs text-gray-500">{product.unit}</p>
                    
                    {/* Weight */}
                    {product.weight && (
                      <p className="text-xs text-gray-500">{product.weight}</p>
                    )}
                    
                    {/* Stock Status */}
                    {product.inStock && (
                      <p className="text-xs text-gray-600 flex items-center gap-1">
                        <span className="text-green-600">≡</span> Many in stock
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
