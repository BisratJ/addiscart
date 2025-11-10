'use client';

import { useState, useRef, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Plus, Minus, Heart, Share2, ChevronLeft, ChevronDown, Check } from 'lucide-react';
import { useCart } from '@/app/contexts/CartContext';

// Mock product data
const productData: any = {
  '1': {
    id: '1',
    name: 'Red On the Vine Tomato',
    price: 0.62,
    originalPrice: 1.24,
    discount: '50% off',
    unit: 'each (est.)',
    weight: '$0.62 / lb',
    estimatedPrice: '$0.62 ea (0.62 lb / 1.24 per / package)',
    image: 'https://placehold.co/600x600/DC143C/FFFFFF/png?text=Tomato',
    description: 'Fresh red tomatoes on the vine',
    inStock: true,
    organic: false,
  },
  '2': {
    id: '2',
    name: 'Chilean Perfecto Grapes',
    price: 3.99,
    originalPrice: 21.99,
    discount: '67% off',
    unit: '$1.99 / lb',
    weight: 'About 2.0 lb / package',
    image: 'https://placehold.co/600x600/9370DB/FFFFFF/png?text=Grapes',
    description: 'Sweet and juicy purple grapes',
    inStock: true,
    organic: false,
  },
  '3': {
    id: '3',
    name: 'Banana',
    price: 0.49,
    unit: '$0.39 / lb',
    weight: 'About 0.45 lb each',
    image: 'https://placehold.co/600x600/FFE135/000000/png?text=Banana',
    description: 'Fresh yellow bananas',
    inStock: true,
    organic: false,
  },
};

// Mock related products
const relatedProducts = [
  {
    id: '101',
    name: 'Red Beefsteak Tomato',
    price: 0.99,
    unit: 'each',
    image: 'https://placehold.co/300x300/FF6347/FFFFFF/png?text=Beefsteak',
    inStock: true,
  },
  {
    id: '102',
    name: 'Cherry Tomatoes',
    price: 2.99,
    unit: '10 oz',
    image: 'https://placehold.co/300x300/FF4500/FFFFFF/png?text=Cherry',
    inStock: true,
  },
  {
    id: '103',
    name: 'Roma Tomatoes',
    price: 1.49,
    unit: 'lb',
    image: 'https://placehold.co/300x300/CD5C5C/FFFFFF/png?text=Roma',
    inStock: true,
  },
  {
    id: '104',
    name: 'Grape Tomatoes',
    price: 3.49,
    unit: '16 oz',
    image: 'https://placehold.co/300x300/B22222/FFFFFF/png?text=Grape',
    inStock: true,
  },
];

const frequentlyBought = [
  {
    id: '201',
    name: 'Red On the Vine Tomato',
    price: 0.62,
    unit: 'each',
    image: 'https://placehold.co/300x300/DC143C/FFFFFF/png?text=Tomato',
    inStock: true,
  },
  {
    id: '202',
    name: 'Organic Broccoli',
    price: 4.99,
    unit: 'each',
    image: 'https://placehold.co/300x300/228B22/FFFFFF/png?text=Broccoli',
    inStock: true,
  },
  {
    id: '203',
    name: 'Cucumber',
    price: 1.29,
    unit: 'each',
    image: 'https://placehold.co/300x300/2E8B57/FFFFFF/png?text=Cucumber',
    inStock: true,
  },
];

const oftenBought = [
  {
    id: '301',
    name: 'Cucumber',
    price: 1.29,
    unit: 'each',
    image: 'https://placehold.co/300x300/2E8B57/FFFFFF/png?text=Cucumber',
    inStock: true,
  },
  {
    id: '302',
    name: 'Organic Cilantro',
    price: 1.99,
    unit: 'bunch',
    image: 'https://placehold.co/300x300/32CD32/FFFFFF/png?text=Cilantro',
    inStock: true,
  },
  {
    id: '303',
    name: 'Romaine Hearts',
    price: 2.99,
    unit: '3 pack',
    image: 'https://placehold.co/300x300/90EE90/006400/png?text=Romaine',
    inStock: true,
  },
  {
    id: '304',
    name: 'Fresh Basil',
    price: 2.49,
    unit: 'bunch',
    image: 'https://placehold.co/300x300/228B22/FFFFFF/png?text=Basil',
    inStock: true,
  },
  {
    id: '305',
    name: 'Organic Zucchini',
    price: 0.99,
    unit: 'each',
    image: 'https://placehold.co/300x300/556B2F/FFFFFF/png?text=Zucchini',
    inStock: true,
  },
  {
    id: '306',
    name: 'Organic Grape Tomatoes',
    price: 4.99,
    unit: '16 oz',
    image: 'https://placehold.co/300x300/8B0000/FFFFFF/png?text=Organic',
    inStock: true,
  },
];

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.productId as string;
  const product = productData[productId] || productData['1'];
  const { addToCart, cartItems, updateQuantity, removeFromCart } = useCart();
  
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showQuantityDropdown, setShowQuantityDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const productIdStr = product.id;
  const itemInCart = cartItems[productIdStr];
  const cartQuantity = itemInCart?.quantity || 0;

  const handleQuantityChange = (value: number) => {
    if (value >= 1) {
      setQuantity(value);
    }
  };
  
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowQuantityDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const handleCartQuantityChange = (newQty: number) => {
    if (newQty === 0) {
      removeFromCart(productIdStr);
    } else {
      updateQuantity(productIdStr, newQty);
    }
    setShowQuantityDropdown(false);
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        unit: product.unit,
      });
    }
    // Reset quantity after adding
    setQuantity(1);
  };

  const totalPrice = (product.price * quantity).toFixed(2);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Image */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="relative aspect-square">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <p className="text-gray-600 mb-4">{product.unit} • {product.weight}</p>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-4xl font-bold text-gray-900">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-400 line-through">${product.originalPrice}</span>
                )}
                {product.discount && (
                  <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-bold">
                    {product.discount}
                  </span>
                )}
              </div>
              {product.estimatedPrice && (
                <p className="text-sm text-gray-600">{product.estimatedPrice}</p>
              )}
            </div>

            {/* Quantity Selector - Only show when item not in cart */}
            {cartQuantity === 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border-2 border-gray-300 rounded-lg">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      className="p-3 hover:bg-gray-100 transition-colors"
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-5 h-5 text-gray-600" />
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                      className="w-16 text-center font-semibold text-lg border-none focus:outline-none"
                      min="1"
                    />
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      className="p-3 hover:bg-gray-100 transition-colors"
                    >
                      <Plus className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                  <span className="text-gray-600">Total: <span className="font-bold text-gray-900">${totalPrice}</span></span>
                </div>
              </div>
            )}

            {/* Add to Cart Button or Cart Quantity Dropdown */}
            {cartQuantity === 0 ? (
              <button 
                onClick={handleAddToCart}
                className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl mb-4"
              >
                Add to cart
              </button>
            ) : (
              <div className="relative mb-4" ref={dropdownRef}>
                <button
                  onClick={() => setShowQuantityDropdown(!showQuantityDropdown)}
                  className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <span>{cartQuantity} in cart</span>
                  <ChevronDown className="w-5 h-5" />
                </button>
                
                {showQuantityDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50 max-h-96 overflow-y-auto">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                      <button
                        key={num}
                        onClick={() => handleCartQuantityChange(num)}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center justify-between"
                      >
                        <span className="text-gray-900 font-medium">{num} in cart</span>
                        {cartQuantity === num && <Check className="w-5 h-5 text-green-600" />}
                      </button>
                    ))}
                    <div className="border-t border-gray-200 my-2"></div>
                    <button
                      onClick={() => handleCartQuantityChange(0)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors text-red-600 font-medium"
                    >
                      Remove from cart
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-semibold transition-colors ${
                  isFavorite
                    ? 'border-red-500 text-red-500 bg-red-50'
                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                Save
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:border-gray-400 transition-colors">
                <Share2 className="w-5 h-5" />
                Add to New List
              </button>
            </div>

            {/* Stock Status */}
            {product.inStock && (
              <div className="mt-6 flex items-center gap-2 text-green-600">
                <span className="text-xl">✓</span>
                <span className="font-medium">100% satisfaction guarantee</span>
              </div>
            )}
          </div>
        </div>

        {/* Customers also considered */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Customers also considered</h2>
            <Link href="#" className="text-green-600 font-semibold hover:text-green-700">
              View all (20+) →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {relatedProducts.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-200 relative"
              >
                <button 
                  onClick={() => {
                    addToCart({
                      id: item.id,
                      name: item.name,
                      price: item.price,
                      image: item.image,
                      unit: item.unit,
                    });
                  }}
                  className="absolute top-2 right-2 z-10 bg-green-600 text-white p-2 rounded-full hover:bg-green-700 transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <div className="aspect-square relative bg-white p-4">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="p-3 border-t border-gray-100">
                  <p className="text-lg font-bold text-gray-900 mb-1">${item.price}</p>
                  <h3 className="text-sm text-gray-700 line-clamp-2 mb-1">{item.name}</h3>
                  <p className="text-xs text-gray-500">{item.unit}</p>
                  {item.inStock && (
                    <p className="text-xs text-gray-600 flex items-center gap-1 mt-2">
                      <span className="text-green-600">≡</span> Many in stock
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Frequently bought together */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Frequently bought together</h2>
          <div className="grid grid-cols-3 gap-4">
            {frequentlyBought.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-200 relative"
              >
                <button 
                  onClick={() => {
                    addToCart({
                      id: item.id,
                      name: item.name,
                      price: item.price,
                      image: item.image,
                      unit: item.unit,
                    });
                  }}
                  className="absolute top-2 right-2 z-10 bg-green-600 text-white p-2 rounded-full hover:bg-green-700 transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <div className="aspect-square relative bg-white p-4">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="p-3 border-t border-gray-100">
                  <p className="text-lg font-bold text-gray-900 mb-1">${item.price}</p>
                  <h3 className="text-sm text-gray-700 line-clamp-2 mb-1">{item.name}</h3>
                  <p className="text-xs text-gray-500">{item.unit}</p>
                  {item.inStock && (
                    <p className="text-xs text-gray-600 flex items-center gap-1 mt-2">
                      <span className="text-green-600">≡</span> Many in stock
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
          <button 
            onClick={() => {
              frequentlyBought.forEach(item => {
                addToCart({
                  id: item.id,
                  name: item.name,
                  price: item.price,
                  image: item.image,
                  unit: item.unit,
                });
              });
            }}
            className="w-full mt-4 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-colors"
          >
            Add all 3 items • ${(frequentlyBought.reduce((sum, item) => sum + item.price, 0)).toFixed(2)}
          </button>
        </section>

        {/* Often Bought With */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Often Bought With</h2>
            <Link href="#" className="text-green-600 font-semibold hover:text-green-700">
              View all (60+) →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {oftenBought.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-200 relative"
              >
                <button 
                  onClick={() => {
                    addToCart({
                      id: item.id,
                      name: item.name,
                      price: item.price,
                      image: item.image,
                      unit: item.unit,
                    });
                  }}
                  className="absolute top-2 right-2 z-10 bg-green-600 text-white p-2 rounded-full hover:bg-green-700 transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <div className="aspect-square relative bg-white p-4">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="p-3 border-t border-gray-100">
                  <p className="text-lg font-bold text-gray-900 mb-1">${item.price}</p>
                  <h3 className="text-sm text-gray-700 line-clamp-2 mb-1">{item.name}</h3>
                  <p className="text-xs text-gray-500">{item.unit}</p>
                  {item.inStock && (
                    <p className="text-xs text-gray-600 flex items-center gap-1 mt-2">
                      <span className="text-green-600">≡</span> Many in stock
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
