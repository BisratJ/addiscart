'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { ShoppingCart, Clock, Truck, Shield, Star, TrendingUp, Users, Package, CreditCard, MapPin, Search, ChevronRight, ChevronDown, Gift, Percent, Award, Heart, Plus, Minus, Trash2 } from 'lucide-react';
import FeaturedStores from './components/FeaturedStores';
import { useCart } from './contexts/CartContext';

export default function Home() {
  const [location, setLocation] = useState('San Francisco, CA');
  const { addToCart, cartItems, updateQuantity, removeFromCart } = useCart();

  const getItemQuantity = (productId: string) => {
    const item = cartItems[productId];
    return item?.quantity || 0;
  };

  const handleAddToCart = (product: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: String(product.id),
      name: product.name,
      price: parseFloat(product.price.replace('$', '')),
      image: product.image,
      unit: product.unit || 'each',
    });
  };

  const handleIncrement = (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const quantity = getItemQuantity(productId);
    updateQuantity(productId, quantity + 1);
  };

  const handleDecrement = (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const quantity = getItemQuantity(productId);
    if (quantity > 1) {
      updateQuantity(productId, quantity - 1);
    } else {
      removeFromCart(productId);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Hero Banner - Modern Futuristic Design */}
      <section className="relative bg-gradient-to-br from-[#0a5e3e] via-[#0d7347] to-[#0a5e3e] text-white overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-teal-400/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        
        <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16 relative z-10">
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-center">
            {/* Left Content */}
            <div className="space-y-4 sm:space-y-6 md:space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-300 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
                </span>
                <span>Fast delivery available now</span>
              </div>
              
              {/* Main Heading */}
              <div className="space-y-2 sm:space-y-3">
                <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="block">Order groceries</span>
                  <span className="block bg-gradient-to-r from-green-200 via-emerald-200 to-teal-200 bg-clip-text text-transparent">
                    for delivery
                  </span>
                  <span className="block">or pickup today</span>
                </h1>
                <p className="text-sm sm:text-base md:text-lg text-green-50/90 max-w-md">
                  Shop from your favorite stores and get fresh groceries delivered to your door in as fast as 30 minutes.
                </p>
              </div>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link
                  href="/stores"
                  prefetch={true}
                  className="group relative inline-flex items-center justify-center gap-2 bg-white text-green-700 px-5 sm:px-6 py-3 sm:py-3.5 rounded-2xl font-semibold text-sm sm:text-base hover:shadow-2xl hover:shadow-white/20 transition-all duration-300 overflow-hidden active:scale-95 touch-manipulation"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                    Start Shopping
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-green-50 to-emerald-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </Link>
                
                <Link
                  href="/stores"
                  prefetch={true}
                  className="group inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-md border border-white/30 text-white px-5 sm:px-6 py-3 sm:py-3.5 rounded-2xl font-semibold text-sm sm:text-base hover:bg-white/20 hover:border-white/50 transition-all duration-300 active:scale-95 touch-manipulation"
                >
                  <Gift className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Get $0 delivery fee</span>
                </Link>
              </div>
              
              {/* Features */}
              <div className="flex flex-wrap gap-4 sm:gap-6 pt-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <div className="font-semibold">30 min delivery</div>
                    <div className="text-[10px] sm:text-xs text-green-100">Fast delivery</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center">
                    <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <div className="font-semibold">100% Secure</div>
                    <div className="text-[10px] sm:text-xs text-green-100">Safe payments</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Image */}
            <div className="relative flex justify-center md:justify-end mt-6 md:mt-0">
              <div className="relative w-full max-w-lg">
                {/* Glow effect */}
                <div className="absolute -inset-4 bg-gradient-to-r from-green-400/30 to-emerald-400/30 rounded-3xl blur-2xl"></div>
                
                {/* Image container */}
                <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-2 shadow-2xl">
                  <div className="relative rounded-2xl overflow-hidden">
                    <Image
                      src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=90"
                      alt="Fresh groceries"
                      width={600}
                      height={400}
                      className="w-full h-auto object-cover"
                      priority
                    />
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-green-900/20 to-transparent"></div>
                  </div>
                </div>
                
                {/* Floating badge */}
                <div className="absolute -bottom-3 -left-2 sm:-bottom-4 sm:-left-4 bg-white text-gray-900 px-3 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl shadow-xl backdrop-blur-md">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                      <Star className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 fill-green-600" />
                    </div>
                    <div>
                      <div className="font-bold text-xs sm:text-sm">4.8/5 Rating</div>
                      <div className="text-[10px] sm:text-xs text-gray-600">10K+ reviews</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Store Categories Section */}
      <section className="py-8 sm:py-10 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              Stores to help you save
            </h2>
            <p className="text-sm text-gray-600">Fast delivery from your favorite stores</p>
          </div>
          
          <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 sm:mx-0 px-4 sm:px-0">
            {[
              { id: '1', name: 'Safeway', logo: 'https://logo.clearbit.com/safeway.com', time: '20 min', badge: null },
              { id: '2', name: 'Walgreens', logo: 'https://logo.clearbit.com/walgreens.com', time: '25 min', badge: '$5 off' },
              { id: '3', name: 'Costco', logo: 'https://logo.clearbit.com/costco.com', time: '30 min', badge: null },
              { id: '4', name: 'Sprouts Farmers...', logo: 'https://logo.clearbit.com/sprouts.com', time: '25 min', badge: 'In-store prices' },
              { id: '5', name: 'Target', logo: 'https://logo.clearbit.com/target.com', time: '25 min', badge: null },
              { id: '6', name: 'Walmart', logo: 'https://logo.clearbit.com/walmart.com', time: '30 min', badge: 'In-store prices' },
              { id: '7', name: 'CVS', logo: 'https://logo.clearbit.com/cvs.com', time: '15 min', badge: '$10 off' },
              { id: '8', name: 'Whole Foods', logo: 'https://logo.clearbit.com/wholefoodsmarket.com', time: '35 min', badge: null },
              { id: '9', name: 'Kroger', logo: 'https://logo.clearbit.com/kroger.com', time: '25 min', badge: null },
              { id: '10', name: 'Albertsons', logo: 'https://logo.clearbit.com/albertsons.com', time: '30 min', badge: 'In-store prices' },
              { id: '11', name: 'Trader Joe\'s', logo: 'https://logo.clearbit.com/traderjoes.com', time: '40 min', badge: null },
              { id: '12', name: 'Aldi', logo: 'https://logo.clearbit.com/aldi.us', time: '25 min', badge: '$5 off' },
              { id: '13', name: 'Publix', logo: 'https://logo.clearbit.com/publix.com', time: '30 min', badge: null },
              { id: '14', name: 'Rite Aid', logo: 'https://logo.clearbit.com/riteaid.com', time: '20 min', badge: null },
              { id: '15', name: 'HMart', logo: 'https://logo.clearbit.com/hmart.com', time: 'By 2:30pm', badge: null },
            ].map((store) => (
              <Link
                key={store.id}
                href={`/stores/${store.id}`}
                className="group flex-shrink-0"
              >
                <div className="flex flex-col items-center w-20 sm:w-24">
                  {/* Store logo */}
                  <div className="relative mb-1.5 sm:mb-2">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white border-2 border-gray-200 rounded-xl sm:rounded-2xl overflow-hidden group-hover:border-green-500 group-hover:shadow-lg transition-all duration-200 flex items-center justify-center p-1.5 sm:p-2 active:scale-95 touch-manipulation">
                      <Image
                        src={store.logo}
                        alt={store.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    {/* Badge */}
                    {store.badge && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-gray-900 text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full whitespace-nowrap">
                        {store.badge}
                      </div>
                    )}
                  </div>
                  
                  {/* Store name */}
                  <h3 className="text-[10px] sm:text-xs font-semibold text-center text-gray-900 mb-0.5 line-clamp-1 w-full">
                    {store.name}
                  </h3>
                  
                  {/* Delivery time */}
                  <p className="text-[10px] sm:text-xs text-gray-600">{store.time}</p>
                </div>
              </Link>
            ))}
            
            {/* Show all button */}
            <Link
              href="/stores"
              className="flex-shrink-0 flex flex-col items-center justify-center w-20 sm:w-24"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-100 hover:bg-gray-200 rounded-xl sm:rounded-2xl flex items-center justify-center transition-colors duration-200 active:scale-95 touch-manipulation">
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
              </div>
              <p className="text-[10px] sm:text-xs font-semibold text-gray-900 mt-1.5 sm:mt-2">Show all</p>
              <p className="text-[10px] sm:text-xs text-gray-600">108 stores</p>
            </Link>
          </div>
          
          <p className="text-[10px] sm:text-xs text-gray-500 mt-3 sm:mt-4">Offers subject to terms and eligibility</p>
        </div>
      </section>

      {/* All Stores Section */}
      <section className="py-10 sm:py-12 md:py-16 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(16,185,129,0.03),transparent_50%)]"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-1 sm:mb-2">
                All stores in San Francisco Bay Area
              </h2>
              <p className="text-sm sm:text-base text-gray-600">Browse all available stores near you</p>
            </div>
            <Link 
              href="/stores" 
              className="group hidden md:flex items-center gap-2 bg-white border-2 border-gray-200 hover:border-green-500 px-6 py-3 rounded-2xl font-semibold text-gray-900 hover:text-green-600 transition-all duration-300 hover:shadow-lg"
            >
              View all stores
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <FeaturedStores />
          
          {/* Mobile View All Button */}
          <div className="mt-6 sm:mt-8 md:hidden">
            <Link 
              href="/stores" 
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-500 text-white px-5 sm:px-6 py-3 sm:py-4 rounded-2xl font-semibold hover:shadow-lg hover:shadow-green-500/50 transition-all duration-300 w-full active:scale-95 touch-manipulation"
            >
              View all stores
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="py-8 sm:py-10 md:py-12 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Shop by category</h2>
            <p className="text-sm text-gray-600">Find what you need faster</p>
          </div>
          
          {/* Fallback to hardcoded categories if API fails */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {[
              { name: 'Fresh Produce', emoji: '🥬', color: 'from-green-100 to-emerald-100' },
              { name: 'Meat & Seafood', emoji: '🥩', color: 'from-red-100 to-pink-100' },
              { name: 'Dairy & Eggs', emoji: '🥛', color: 'from-blue-100 to-cyan-100' },
              { name: 'Bakery', emoji: '🍞', color: 'from-orange-100 to-amber-100' },
              { name: 'Snacks', emoji: '🍿', color: 'from-yellow-100 to-orange-100' },
              { name: 'Beverages', emoji: '🥤', color: 'from-purple-100 to-pink-100' },
              { name: 'Frozen Foods', emoji: '🧊', color: 'from-cyan-100 to-blue-100' },
              { name: 'Pantry', emoji: '🥫', color: 'from-amber-100 to-yellow-100' },
              { name: 'Health & Beauty', emoji: '💄', color: 'from-pink-100 to-rose-100' },
              { name: 'Household', emoji: '🧹', color: 'from-gray-100 to-slate-100' },
              { name: 'Pet Care', emoji: '🐕', color: 'from-orange-100 to-red-100' },
              { name: 'Baby Products', emoji: '👶', color: 'from-blue-100 to-indigo-100' },
            ].map((category, index) => (
              <Link
                key={index}
                href="/stores"
                className="group relative bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-green-500 active:scale-95 touch-manipulation"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl sm:rounded-2xl`}></div>
                <div className="relative z-10 text-center">
                  <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">{category.emoji}</div>
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-900">{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Deals & Promotions */}
      <section className="py-8 sm:py-10 md:py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Today's deals</h2>
              <p className="text-xs sm:text-sm text-gray-600">Limited time offers you don't want to miss</p>
            </div>
            <Link href="/stores" className="text-green-600 hover:text-green-700 font-semibold text-xs sm:text-sm flex items-center gap-1">
              See all
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {[
              { id: 1001, name: 'Organic Bananas', price: '$0.69', original: '$1.29', discount: '46% off', unit: 'lb', image: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=300&q=80' },
              { id: 1002, name: 'Fresh Strawberries', price: '$3.99', original: '$5.99', discount: '33% off', unit: '16 oz', image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=300&q=80' },
              { id: 1003, name: 'Avocados (4 pack)', price: '$4.99', original: '$7.99', discount: '38% off', unit: '4 pack', image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=300&q=80' },
              { id: 1004, name: 'Greek Yogurt', price: '$4.49', original: '$6.99', discount: '36% off', unit: '32 oz', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=300&q=80' },
              { id: 1005, name: 'Organic Eggs', price: '$5.99', original: '$8.99', discount: '33% off', unit: 'dozen', image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=300&q=80' },
            ].map((deal) => {
              const quantity = getItemQuantity(String(deal.id));
              return (
                <Link
                  key={deal.id}
                  href="/stores"
                  className="group bg-white rounded-xl border border-gray-200 hover:border-green-500 hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  <div className="relative aspect-square">
                    <Image
                      src={deal.image}
                      alt={deal.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {deal.discount}
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2">{deal.name}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg font-bold text-green-600">{deal.price}</span>
                      <span className="text-sm text-gray-500 line-through">{deal.original}</span>
                    </div>
                    
                    {/* Add to Cart Button */}
                    {quantity === 0 ? (
                      <button
                        onClick={(e) => handleAddToCart(deal, e)}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-1"
                      >
                        <Plus className="w-4 h-4" />
                        Add
                      </button>
                    ) : (
                      <div className="flex items-center justify-between bg-green-50 border-2 border-green-600 rounded-lg p-1">
                        <button
                          onClick={(e) => handleDecrement(String(deal.id), e)}
                          className="p-1 hover:bg-green-100 rounded transition-colors"
                        >
                          {quantity === 1 ? (
                            <Trash2 className="w-4 h-4 text-red-600" />
                          ) : (
                            <Minus className="w-4 h-4 text-green-600" />
                          )}
                        </button>
                        <span className="font-bold text-green-600 text-sm">{quantity}</span>
                        <button
                          onClick={(e) => handleIncrement(String(deal.id), e)}
                          className="p-1 hover:bg-green-100 rounded transition-colors"
                        >
                          <Plus className="w-4 h-4 text-green-600" />
                        </button>
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-green-600" />
                Trending now
              </h2>
              <p className="text-sm text-gray-600">Most popular items this week</p>
            </div>
            <Link href="/stores" className="text-green-600 hover:text-green-700 font-semibold text-sm flex items-center gap-1">
              View all
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { id: 2001, name: 'Almond Milk', price: '$3.99', rating: 4.8, unit: '64 oz', image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300&q=80' },
              { id: 2002, name: 'Sourdough Bread', price: '$4.49', rating: 4.9, unit: 'loaf', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&q=80' },
              { id: 2003, name: 'Cherry Tomatoes', price: '$2.99', rating: 4.7, unit: '10 oz', image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=300&q=80' },
              { id: 2004, name: 'Organic Spinach', price: '$3.49', rating: 4.6, unit: 'bunch', image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=300&q=80' },
              { id: 2005, name: 'Blueberries', price: '$4.99', rating: 4.8, unit: '18 oz', image: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=300&q=80' },
              { id: 2006, name: 'Chicken Breast', price: '$8.99', rating: 4.7, unit: 'lb', image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=300&q=80' },
            ].map((product) => {
              const quantity = getItemQuantity(String(product.id));
              return (
                <Link
                  key={product.id}
                  href="/stores"
                  className="group bg-white rounded-xl border border-gray-200 hover:border-green-500 hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  <div className="relative aspect-square">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">{product.name}</h3>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-base font-bold text-gray-900">{product.price}</span>
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        {product.rating}
                      </div>
                    </div>
                    
                    {/* Add to Cart Button */}
                    {quantity === 0 ? (
                      <button
                        onClick={(e) => handleAddToCart(product, e)}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-1"
                      >
                        <Plus className="w-4 h-4" />
                        Add
                      </button>
                    ) : (
                      <div className="flex items-center justify-between bg-green-50 border-2 border-green-600 rounded-lg p-1">
                        <button
                          onClick={(e) => handleDecrement(String(product.id), e)}
                          className="p-1 hover:bg-green-100 rounded transition-colors"
                        >
                          {quantity === 1 ? (
                            <Trash2 className="w-4 h-4 text-red-600" />
                          ) : (
                            <Minus className="w-4 h-4 text-green-600" />
                          )}
                        </button>
                        <span className="font-bold text-green-600 text-sm">{quantity}</span>
                        <button
                          onClick={(e) => handleIncrement(String(product.id), e)}
                          className="p-1 hover:bg-green-100 rounded transition-colors"
                        >
                          <Plus className="w-4 h-4 text-green-600" />
                        </button>
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl overflow-hidden">
            <div className="grid md:grid-cols-2 gap-8 items-center p-8 md:p-12">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  <Gift className="w-4 h-4" />
                  Special Offer
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Get $10 off your first 3 orders
                </h2>
                <p className="text-lg text-gray-600">
                  Sign up today and enjoy exclusive discounts on your favorite groceries. Limited time offer!
                </p>
                <Link
                  href="/stores"
                  prefetch={true}
                  className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  Start Shopping
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </div>
              <div className="relative h-64 md:h-80">
                <Image
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80"
                  alt="Fresh groceries"
                  fill
                  className="object-cover rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Stats Section - Modern Design */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900">
              This is your online grocery shopping experience
            </h2>
            <p className="text-base text-gray-600">
              Powered by smart technology and real people
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-7xl mx-auto">
            {[
              { 
                number: '10,000+', 
                label: 'Active shoppers', 
                subtitle: 'Ready to serve you',
                icon: Users,
              },
              { 
                number: '50,000+', 
                label: 'Happy customers', 
                subtitle: 'And counting',
                icon: Heart,
              },
              { 
                number: '14,000+', 
                label: 'Cities served', 
                subtitle: 'Across the US',
                icon: MapPin,
              },
              { 
                number: '1M+', 
                label: 'Orders delivered', 
                subtitle: 'This year alone',
                icon: Package,
              },
            ].map((stat, index) => (
              <div 
                key={index} 
                className="group relative bg-white rounded-2xl p-6 md:p-8 border border-gray-200 hover:border-green-500 hover:shadow-xl transition-all duration-300"
              >
                {/* Top accent line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Icon */}
                <div className="mb-4">
                  <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center group-hover:bg-green-100 transition-colors duration-300">
                    <stat.icon className="w-6 h-6 text-green-600" strokeWidth={2} />
                  </div>
                </div>
                
                {/* Number */}
                <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                  {stat.number}
                </div>
                
                {/* Label */}
                <div className="text-gray-700 font-medium text-sm md:text-base mb-1">
                  {stat.label}
                </div>
                
                {/* Subtitle */}
                <p className="text-xs md:text-sm text-gray-500">
                  {stat.subtitle}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900">Common questions</h2>
            <p className="text-gray-600">Everything you need to know about our service</p>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-3">
            {[
              {
                question: 'How does grocery delivery work?',
                answer: 'Simply browse stores, add items to your cart, choose a delivery time, and checkout. A personal shopper will pick and deliver your order.'
              },
              {
                question: 'How much does delivery cost?',
                answer: 'Delivery fees start at $3.99 for same-day orders over $35. Fees vary based on order size and delivery time.'
              },
              {
                question: 'What if something is out of stock?',
                answer: 'Your shopper will contact you to suggest replacements or refund the item if you prefer.'
              },
              {
                question: 'Can I schedule delivery for later?',
                answer: 'Yes! You can schedule delivery for as fast as 1 hour or up to a week in advance.'
              },
              {
                question: 'Is there a membership fee?',
                answer: 'No membership required! However, we offer a premium membership with unlimited free delivery and exclusive perks.'
              }
            ].map((faq, index) => (
              <details key={index} className="group bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors duration-200">
                <summary className="font-semibold text-base md:text-lg cursor-pointer flex items-center justify-between p-5 md:p-6">
                  <span className="text-gray-900">{faq.question}</span>
                  <ChevronDown className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform duration-200 flex-shrink-0 ml-4" />
                </summary>
                <div className="px-5 md:px-6 pb-5 md:pb-6">
                  <p className="text-gray-600 text-sm md:text-base leading-relaxed">{faq.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Footer - Modern Addiscart Style */}
      <footer className="bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-8">
            {/* Shop */}
            <div>
              <h4 className="font-bold mb-4 text-sm text-gray-900">Shop</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/stores" className="text-gray-600 hover:text-green-600">All Stores</Link></li>
                <li><Link href="/stores" className="text-gray-600 hover:text-green-600">Grocery</Link></li>
                <li><Link href="/stores" className="text-gray-600 hover:text-green-600">Alcohol</Link></li>
                <li><Link href="/stores" className="text-gray-600 hover:text-green-600">Convenience</Link></li>
              </ul>
            </div>
            
            {/* Account */}
            <div>
              <h4 className="font-bold mb-4 text-sm text-gray-900">Account</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/auth/login" className="text-gray-600 hover:text-green-600">Sign in</Link></li>
                <li><Link href="/auth/register" className="text-gray-600 hover:text-green-600">Sign up</Link></li>
                <li><Link href="/orders" className="text-gray-600 hover:text-green-600">Your orders</Link></li>
                <li><Link href="/cart" className="text-gray-600 hover:text-green-600">Your cart</Link></li>
              </ul>
            </div>
            
            {/* Company */}
            <div>
              <h4 className="font-bold mb-4 text-sm text-gray-900">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="text-gray-600 hover:text-green-600">About us</Link></li>
                <li><Link href="/careers" className="text-gray-600 hover:text-green-600">Careers</Link></li>
                <li><Link href="/press" className="text-gray-600 hover:text-green-600">Press</Link></li>
                <li><Link href="/blog" className="text-gray-600 hover:text-green-600">Blog</Link></li>
              </ul>
            </div>
            
            {/* Support */}
            <div>
              <h4 className="font-bold mb-4 text-sm text-gray-900">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/help" className="text-gray-600 hover:text-green-600">Help center</Link></li>
                <li><Link href="/contact" className="text-gray-600 hover:text-green-600">Contact us</Link></li>
                <li><Link href="/safety" className="text-gray-600 hover:text-green-600">Safety</Link></li>
                <li><Link href="/faq" className="text-gray-600 hover:text-green-600">FAQs</Link></li>
              </ul>
            </div>
            
            {/* Legal */}
            <div>
              <h4 className="font-bold mb-4 text-sm text-gray-900">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/terms" className="text-gray-600 hover:text-green-600">Terms</Link></li>
                <li><Link href="/privacy" className="text-gray-600 hover:text-green-600">Privacy</Link></li>
                <li><Link href="/cookies" className="text-gray-600 hover:text-green-600">Cookies</Link></li>
              </ul>
            </div>
            
            {/* Social */}
            <div>
              <h4 className="font-bold mb-4 text-sm text-gray-900">Follow us</h4>
              <div className="flex gap-3">
                <Link href="#" className="text-gray-600 hover:text-green-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
                  </svg>
                </Link>
                <Link href="#" className="text-gray-600 hover:text-green-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                  </svg>
                </Link>
                <Link href="#" className="text-gray-600 hover:text-green-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Bottom Bar */}
          <div className="border-t border-gray-200 pt-6">
            <p className="text-sm text-gray-500 text-center">
              © {new Date().getFullYear()} <span className="font-semibold bg-gradient-to-r from-green-600 via-emerald-600 to-lime-600 bg-clip-text text-transparent">Addiscart</span>. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
