import Link from 'next/link';
import { ShoppingCart, Home, Search } from 'lucide-react';

export const metadata = {
  title: '404 - Page Not Found | Addiscart',
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* Logo */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 mb-12 group"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 via-emerald-500 to-lime-400 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <ShoppingCart className="w-6 h-6 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-bold text-2xl bg-gradient-to-r from-green-600 via-emerald-600 to-lime-600 bg-clip-text text-transparent">
            Addiscart
          </span>
        </Link>

        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-green-50 to-emerald-50 rounded-full mb-6">
            <span className="text-6xl">🛒</span>
          </div>
          <h1 className="text-7xl font-black text-gray-900 mb-4">404</h1>
          <div className="w-20 h-1 bg-gradient-to-r from-green-500 to-lime-500 rounded-full mx-auto"></div>
        </div>

        {/* Message */}
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Page Not Found
        </h2>
        <p className="text-gray-600 mb-10">
          This page is out of stock! Let's get you back to shopping.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 via-emerald-600 to-lime-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all"
          >
            <Home className="w-5 h-5" />
            Go Home
          </Link>
          <Link
            href="/stores"
            className="inline-flex items-center justify-center gap-2 bg-gray-100 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 hover:scale-105 transition-all"
          >
            <Search className="w-5 h-5" />
            Browse Stores
          </Link>
        </div>
      </div>
    </div>
  );
}
