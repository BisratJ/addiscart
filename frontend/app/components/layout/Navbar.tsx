'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/app/hooks/useAuth';
import { ShoppingCart, User, Menu, X, Search, ChevronRight, Store, Package, List, BookOpen, Settings, Star, Users, Gift, Tag, CreditCard, HelpCircle, Lightbulb, Smartphone, LogOut } from 'lucide-react';
import { topSearches, trendingItems, beyondGrocery, searchItems } from '@/app/lib/searchData';
import { useCart } from '@/app/contexts/CartContext';
import CartSidePanel from '@/app/components/cart/CartSidePanel';

export default function Navbar() {
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const { getTotalItems, setIsCartOpen } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  
  const totalItems = getTotalItems();

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    
    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isProfileOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSearchDropdown(false);
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  // Get search results using the search function
  const searchResults = searchQuery ? searchItems(searchQuery) : [];

  return (
    <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-3 sm:px-4 md:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Left Section */}
          <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
            {/* Hamburger Menu */}
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-green-600 focus:outline-none transition-colors p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg active:scale-95 touch-manipulation"
              aria-label="Toggle menu"
            >
              <Menu size={20} className="sm:w-[22px] sm:h-[22px]" strokeWidth={2} />
            </button>

            {/* Logo */}
            <Link 
              href="/" 
              className="flex items-center gap-2 group"
              title="Go to home page"
              aria-label="Go to home page"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-lime-400 blur-lg opacity-30 group-hover:opacity-50 transition-opacity rounded-full"></div>
                <div className="relative w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-green-500 via-emerald-500 to-lime-400 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-white" strokeWidth={2.5} />
                </div>
              </div>
              <span className="font-bold text-lg sm:text-xl bg-gradient-to-r from-green-600 via-emerald-600 to-lime-600 bg-clip-text text-transparent group-hover:from-green-500 group-hover:via-emerald-500 group-hover:to-lime-500 transition-all">
                Addiscart
              </span>
            </Link>
          </div>

          {/* Center - Search Bar */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-4 lg:mx-8 relative">
            <form onSubmit={handleSearch} className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative flex items-center bg-gray-50 hover:bg-white border border-gray-200 hover:border-green-300 rounded-2xl transition-all duration-300">
                <Search className="absolute left-4 text-gray-400 group-hover:text-green-600 transition-colors" size={20} strokeWidth={2} />
                <input
                  type="text"
                  placeholder="Search products, stores, and recipes"
                  className="w-full py-3 pl-12 pr-12 bg-transparent focus:outline-none text-sm font-medium text-gray-700 placeholder:text-gray-400"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowSearchDropdown(true)}
                  onBlur={() => setTimeout(() => setShowSearchDropdown(false), 200)}
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="absolute right-4 text-gray-400 hover:text-gray-700 transition-colors p-1 hover:bg-gray-100 rounded-full"
                    onClick={() => setSearchQuery('')}
                  >
                    <X size={16} strokeWidth={2} />
                  </button>
                )}
              </div>
            </form>

            {/* Search Dropdown */}
            {showSearchDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 max-h-[500px] overflow-y-auto z-50">
                {searchQuery ? (
                  /* Autocomplete Results */
                  <div className="p-4">
                    {searchResults.length > 0 ? (
                      <>
                        {searchResults.map((item, index) => (
                          item.type === 'store' ? (
                            <Link
                              key={`store-${index}`}
                              href={`/stores`}
                              className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors group"
                              onClick={() => setShowSearchDropdown(false)}
                            >
                              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl">
                                {item.image}
                              </div>
                              <span className="text-gray-900 font-medium flex-1">{item.name}</span>
                              <ChevronRight className="w-4 h-4 text-gray-400" />
                            </Link>
                          ) : (
                            <Link
                              key={`product-${index}`}
                              href={`/search?q=${item.name}`}
                              className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors"
                              onClick={() => setShowSearchDropdown(false)}
                            >
                              <span className="text-2xl">{item.image}</span>
                              <span className="text-gray-900 font-medium flex-1">{item.name}</span>
                              <Search className="w-4 h-4 text-gray-400" />
                            </Link>
                          )
                        ))}
                      </>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        No results found for "{searchQuery}"
                      </div>
                    )}
                  </div>
                ) : (
                  /* Top Searches, Trending & Beyond Grocery */
                  <div className="p-6">
                    {/* Top Searches */}
                    <div className="mb-6">
                      <h3 className="text-sm font-bold text-gray-900 mb-4">Top searches</h3>
                      <div className="grid grid-cols-4 gap-3">
                        {topSearches.map((item, index) => (
                          <Link
                            key={index}
                            href={`/search?q=${item.name}`}
                            className="flex flex-col items-center gap-2 p-3 hover:bg-gray-50 rounded-xl transition-colors"
                          >
                            <div className="w-16 h-16 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-3xl">
                              {item.image}
                            </div>
                            <span className="text-xs text-gray-700 font-medium text-center line-clamp-2">{item.name}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                    
                    {/* Trending */}
                    <div className="mb-6">
                      <h3 className="text-sm font-bold text-gray-900 mb-4">Trending</h3>
                      <div className="grid grid-cols-4 gap-3">
                        {trendingItems.map((item, index) => (
                          <Link
                            key={index}
                            href={`/search?q=${item.name}`}
                            className="flex flex-col items-center gap-2 p-3 hover:bg-gray-50 rounded-xl transition-colors"
                          >
                            <div className="w-16 h-16 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-3xl">
                              {item.image}
                            </div>
                            <span className="text-xs text-gray-700 font-medium text-center line-clamp-2">{item.name}</span>
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Beyond Grocery */}
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 mb-4">Beyond grocery</h3>
                      <div className="grid grid-cols-4 gap-3">
                        {beyondGrocery.map((item, index) => (
                          <Link
                            key={index}
                            href={`/search?q=${item.name}`}
                            className="flex flex-col items-center gap-2 p-3 hover:bg-gray-50 rounded-xl transition-colors"
                          >
                            <div className="w-16 h-16 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-3xl">
                              {item.image}
                            </div>
                            <span className="text-xs text-gray-700 font-medium text-center line-clamp-2">{item.name}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-1.5 sm:p-2 hover:bg-gray-100 rounded-xl transition-colors group active:scale-95 touch-manipulation"
            >
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 group-hover:text-green-600 transition-colors" strokeWidth={2} />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 bg-green-600 text-white text-[10px] sm:text-xs font-bold rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
            {!isLoading && (
              <>
                {isAuthenticated ? (
                  <div className="relative" ref={profileRef}>
                    <button
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl hover:bg-gray-100 transition-colors active:scale-95 touch-manipulation"
                    >
                      <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-semibold text-xs sm:text-sm">
                        {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <span className="text-xs sm:text-sm font-medium text-gray-700 hidden lg:block">
                        {user?.name || user?.email?.split('@')[0] || 'Account'}
                      </span>
                    </button>

                    {isProfileOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-semibold text-gray-900">{user?.name || 'User'}</p>
                          <p className="text-xs text-gray-500">{user?.email}</p>
                        </div>
                        <Link
                          href="/orders"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          Your Orders
                        </Link>
                        <Link
                          href="/account"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          Account Settings
                        </Link>
                        <div className="border-t border-gray-100 mt-2 pt-2">
                          <button
                            onClick={() => {
                              logout();
                              setIsProfileOpen(false);
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            Log out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <Link
                      href="/auth/login"
                      className="hidden sm:inline-flex text-xs sm:text-sm font-medium text-gray-700 hover:text-green-600 px-2 sm:px-4 py-1.5 sm:py-2 rounded-xl hover:bg-gray-50 transition-all touch-manipulation"
                    >
                      Log in
                    </Link>
                    <Link
                      href="/auth/register"
                      className="relative group bg-gradient-to-r from-green-600 to-green-500 text-white px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold hover:shadow-lg hover:shadow-green-500/50 transition-all duration-300 overflow-hidden active:scale-95 touch-manipulation"
                    >
                      <span className="relative z-10">Sign up</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Bar - Below navbar */}
      <div className="md:hidden border-t border-gray-200 bg-white">
        <div className="container mx-auto px-3 py-2">
          <form onSubmit={handleSearch} className="relative">
            <div className="relative flex items-center bg-gray-50 border border-gray-200 rounded-xl">
              <Search className="absolute left-3 text-gray-400" size={18} strokeWidth={2} />
              <input
                type="text"
                placeholder="Search products & stores"
                className="w-full py-2.5 pl-10 pr-10 bg-transparent focus:outline-none text-sm font-medium text-gray-700 placeholder:text-gray-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSearchDropdown(true)}
                onBlur={() => setTimeout(() => setShowSearchDropdown(false), 200)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="absolute right-3 text-gray-400 hover:text-gray-700 transition-colors p-1"
                  onClick={() => setSearchQuery('')}
                >
                  <X size={16} strokeWidth={2} />
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Slide-out Mobile Menu */}
      {isMenuOpen && (
        <>
          {/* Backdrop - Covers entire screen */}
          <div 
            className="fixed inset-0 bg-gradient-to-r from-black/60 to-black/40 backdrop-blur-sm z-[60] cursor-pointer animate-fade-in"
            onClick={() => setIsMenuOpen(false)}
            onTouchEnd={(e) => {
              e.preventDefault();
              setIsMenuOpen(false);
            }}
          />
          
          {/* Menu Panel */}
          <div className="fixed top-0 left-0 h-screen w-[280px] sm:w-80 bg-gradient-to-br from-white via-white to-gray-50 z-[70] shadow-2xl overflow-y-auto transition-transform duration-200 ease-in-out translate-x-0 animate-slide-in overscroll-contain">
            {/* Close Button */}
            <div className="flex items-center justify-between p-3 border-b border-gray-200">
              <h2 className="text-sm font-bold text-gray-900">Menu</h2>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close menu"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            
            <div className="p-4">
              {/* User Profile Section - Only show when authenticated */}
              {isAuthenticated && user && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2 p-1.5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
                    <div className="w-8 h-8 bg-gradient-to-br from-pink-400 via-pink-500 to-pink-600 rounded-full flex items-center justify-center text-white text-base font-bold shadow-md ring-2 ring-white">
                      🍎
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-xs">{user.name || user.email?.split('@')[0]}</h3>
                      <p className="text-[9px] text-gray-600">Customer since {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                    </div>
                  </div>
                  
                  {/* Addiscart+ Perk Alert */}
                  <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50 border border-green-200 rounded-lg p-2 mb-2 shadow-sm hover:shadow-md transition-shadow">
                    <h4 className="font-bold text-green-900 mb-1 flex items-center gap-1 text-[10px]">
                      <span className="text-xs">✨</span>
                      Addiscart+ perk alert!
                    </h4>
                    <p className="text-[9px] text-green-800 mb-1.5 leading-relaxed">
                      $0 delivery fee on grocery and retail orders of $10+. Service fees apply. Free delivery on all orders!
                    </p>
                    <div className="bg-gradient-to-br from-green-600 via-emerald-600 to-lime-500 rounded-lg p-2 text-white shadow-lg">
                      <h5 className="font-bold mb-0.5 text-[10px]">Start your free trial today!</h5>
                      <p className="text-[8px] mb-1.5 opacity-90">You can cancel at any time.</p>
                      <button className="w-full bg-white text-green-900 py-1.5 rounded-md font-bold text-[9px] hover:bg-green-50 transition-all hover:scale-105 shadow-md">
                        Try Addiscart+ for free
                      </button>
                      <p className="text-[8px] mt-1.5 opacity-70 font-semibold">addiscart+</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Manage your account section */}
              <div className="mb-4">
                <h4 className="text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 px-1.5">Manage your account</h4>
                <div className="space-y-0.5">
                  <Link
                    href="/stores"
                    className="flex items-center gap-1.5 px-2 py-1.5 text-gray-900 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 rounded-lg transition-all hover:scale-[1.01] group"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="p-0.5 bg-gray-100 rounded-md group-hover:bg-green-100 transition-colors">
                      <Store className="w-3 h-3 text-gray-700 group-hover:text-green-600" />
                    </div>
                    <span className="font-medium text-xs">Stores</span>
                  </Link>
                  
                  {isAuthenticated && (
                    <>
                      <Link
                        href="/orders"
                        className="flex items-center gap-1.5 px-2 py-1.5 text-gray-900 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 rounded-lg transition-all hover:scale-[1.01] group"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <div className="p-1 bg-gray-100 rounded-md group-hover:bg-green-100 transition-colors">
                          <Package className="w-3.5 h-3.5 text-gray-700 group-hover:text-green-600" />
                        </div>
                        <span className="font-medium text-xs">Your orders</span>
                      </Link>
                      <Link
                        href="/lists"
                        className="flex items-center gap-1.5 px-2 py-1.5 text-gray-900 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 rounded-lg transition-all hover:scale-[1.01] group"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <div className="p-1 bg-gray-100 rounded-md group-hover:bg-green-100 transition-colors">
                          <List className="w-3.5 h-3.5 text-gray-700 group-hover:text-green-600" />
                        </div>
                        <span className="font-medium text-xs">Your lists</span>
                      </Link>
                      <Link
                        href="/recipes"
                        className="flex items-center gap-1.5 px-2 py-1.5 text-gray-900 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 rounded-lg transition-all hover:scale-[1.01] group"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <div className="p-1 bg-gray-100 rounded-md group-hover:bg-green-100 transition-colors">
                          <BookOpen className="w-3.5 h-3.5 text-gray-700 group-hover:text-green-600" />
                        </div>
                        <span className="font-medium text-xs">Your recipes</span>
                      </Link>
                      <Link
                        href="/account"
                        className="flex items-center gap-1.5 px-2 py-1.5 text-gray-900 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 rounded-lg transition-all hover:scale-[1.01] group"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <div className="p-1 bg-gray-100 rounded-md group-hover:bg-green-100 transition-colors">
                          <Settings className="w-3.5 h-3.5 text-gray-700 group-hover:text-green-600" />
                        </div>
                        <span className="font-medium text-xs">Your account settings</span>
                      </Link>
                      <Link
                        href="/instacart-plus"
                        className="flex items-center gap-2 px-2 py-2 text-gray-900 hover:bg-gradient-to-r hover:from-pink-50 hover:to-rose-50 rounded-lg transition-all hover:scale-[1.01] group"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <div className="p-1 bg-pink-100 rounded-md group-hover:bg-pink-200 transition-colors">
                          <Star className="w-3.5 h-3.5 text-pink-600" />
                        </div>
                        <span className="font-medium text-xs">Try Addiscart+</span>
                      </Link>
                      <Link
                        href="/family"
                        className="flex items-center gap-1.5 px-2 py-1.5 text-gray-900 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 rounded-lg transition-all hover:scale-[1.01] group"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <div className="p-1 bg-gray-100 rounded-md group-hover:bg-green-100 transition-colors">
                          <Users className="w-3.5 h-3.5 text-gray-700 group-hover:text-green-600" />
                        </div>
                        <span className="font-medium text-xs">Start a family account</span>
                      </Link>
                    </>
                  )}
                </div>
              </div>

              {/* Credits and promos section */}
              <div className="mb-3">
                <h4 className="text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 px-1.5">Credits and promos</h4>
                <div className="space-y-1">
                  <Link
                    href="/invite"
                    className="flex items-center gap-3 px-3 py-2.5 text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Gift className="w-5 h-5 text-pink-600" />
                    <span className="font-medium text-pink-600">Invite friends, earn money</span>
                  </Link>
                  <Link
                    href="/gift-cards"
                    className="flex items-center gap-3 px-3 py-2.5 text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Gift className="w-5 h-5" />
                    <span className="font-medium text-xs">Buy gift cards</span>
                  </Link>
                  <Link
                    href="/credits"
                    className="flex items-center gap-3 px-3 py-2.5 text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Tag className="w-5 h-5" />
                    <span className="font-medium text-xs">Credits, promos, and gift cards</span>
                  </Link>
                  <Link
                    href="/mastercard"
                    className="flex items-center gap-3 px-3 py-2.5 text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <CreditCard className="w-5 h-5" />
                    <span className="font-medium text-xs">Apply: Addiscart Rewards Card</span>
                  </Link>
                </div>
              </div>

              {/* Support section */}
              <div className="mb-3">
                <h4 className="text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 px-1.5">Support</h4>
                <div className="space-y-1">
                  <Link
                    href="/help"
                    className="flex items-center gap-3 px-3 py-2.5 text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <HelpCircle className="w-5 h-5" />
                    <span className="font-medium text-xs">Help Center</span>
                  </Link>
                  <Link
                    href="/how-it-works"
                    className="flex items-center gap-3 px-3 py-2.5 text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Lightbulb className="w-5 h-5" />
                    <span className="font-medium text-xs">How Addiscart works</span>
                  </Link>
                </div>
              </div>

              {/* Our apps section */}
              <div className="mb-3">
                <h4 className="text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 px-1.5">Our apps</h4>
                <div className="space-y-1">
                  <a
                    href="https://apps.apple.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-3 py-2.5 text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <Smartphone className="w-5 h-5" />
                    <span className="font-medium text-xs">App Store</span>
                  </a>
                  <a
                    href="https://play.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-3 py-2.5 text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <Smartphone className="w-5 h-5" />
                    <span className="font-medium text-xs">Google Play</span>
                  </a>
                </div>
              </div>

              {/* Auth actions */}
              {isAuthenticated ? (
                <div className="border-t border-gray-200 pt-4">
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-3 py-2.5 text-gray-900 hover:bg-gray-50 rounded-lg transition-colors w-full"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium text-xs">Log out</span>
                  </button>
                </div>
              ) : (
                <div className="border-t border-gray-200 pt-4 space-y-2">
                  <Link
                    href="/auth/login"
                    className="block px-4 py-3 text-center text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-xl font-medium transition-all border border-gray-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Log in
                  </Link>
                  <Link
                    href="/auth/register"
                    className="block px-4 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-green-500/50 transition-all text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign up
                  </Link>
                </div>
              )}

              {/* Footer links */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                  <a href="/press" className="hover:text-gray-700">Press</a>
                  <span>•</span>
                  <a href="/jobs" className="hover:text-gray-700">Jobs</a>
                  <span>•</span>
                  <a href="/terms" className="hover:text-gray-700">Terms</a>
                  <span>•</span>
                  <a href="/privacy" className="hover:text-gray-700">Privacy</a>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Cart Side Panel */}
      <CartSidePanel />
    </nav>
  );
}
