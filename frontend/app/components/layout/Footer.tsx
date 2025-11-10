import Link from 'next/link';
import { Facebook, Twitter, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Shop */}
          <div>
            <h4 className="font-bold mb-3 sm:mb-4 text-xs sm:text-sm text-gray-900">Shop</h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
              <li><Link href="/stores" className="text-gray-600 hover:text-green-600">All Stores</Link></li>
              <li><Link href="/stores" className="text-gray-600 hover:text-green-600">Grocery</Link></li>
              <li><Link href="/stores" className="text-gray-600 hover:text-green-600">Alcohol</Link></li>
              <li><Link href="/stores" className="text-gray-600 hover:text-green-600">Convenience</Link></li>
            </ul>
          </div>
          
          {/* Account */}
          <div>
            <h4 className="font-bold mb-3 sm:mb-4 text-xs sm:text-sm text-gray-900">Account</h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
              <li><Link href="/auth/login" className="text-gray-600 hover:text-green-600">Sign in</Link></li>
              <li><Link href="/auth/register" className="text-gray-600 hover:text-green-600">Sign up</Link></li>
              <li><Link href="/orders" className="text-gray-600 hover:text-green-600">Your orders</Link></li>
              <li><Link href="/cart" className="text-gray-600 hover:text-green-600">Your cart</Link></li>
            </ul>
          </div>
          
          {/* Company */}
          <div>
            <h4 className="font-bold mb-3 sm:mb-4 text-xs sm:text-sm text-gray-900">Company</h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
              <li><Link href="/about" className="text-gray-600 hover:text-green-600">About us</Link></li>
              <li><Link href="/careers" className="text-gray-600 hover:text-green-600">Careers</Link></li>
              <li><Link href="/press" className="text-gray-600 hover:text-green-600">Press</Link></li>
              <li><Link href="/blog" className="text-gray-600 hover:text-green-600">Blog</Link></li>
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h4 className="font-bold mb-3 sm:mb-4 text-xs sm:text-sm text-gray-900">Support</h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
              <li><Link href="/help" className="text-gray-600 hover:text-green-600">Help center</Link></li>
              <li><Link href="/contact" className="text-gray-600 hover:text-green-600">Contact us</Link></li>
              <li><Link href="/safety" className="text-gray-600 hover:text-green-600">Safety</Link></li>
              <li><Link href="/faq" className="text-gray-600 hover:text-green-600">FAQs</Link></li>
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h4 className="font-bold mb-3 sm:mb-4 text-xs sm:text-sm text-gray-900">Legal</h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
              <li><Link href="/terms" className="text-gray-600 hover:text-green-600">Terms</Link></li>
              <li><Link href="/privacy" className="text-gray-600 hover:text-green-600">Privacy</Link></li>
              <li><Link href="/cookies" className="text-gray-600 hover:text-green-600">Cookies</Link></li>
            </ul>
          </div>
          
          {/* Follow us */}
          <div className="col-span-2 sm:col-span-1">
            <h4 className="font-bold mb-3 sm:mb-4 text-xs sm:text-sm text-gray-900">Follow us</h4>
            <div className="flex space-x-3 sm:space-x-4">
              <Link href="#" className="text-gray-600 hover:text-green-600 transition p-2 hover:bg-gray-100 rounded-lg active:scale-95 touch-manipulation">
                <Facebook size={18} className="sm:w-5 sm:h-5" />
              </Link>
              <Link href="#" className="text-gray-600 hover:text-green-600 transition p-2 hover:bg-gray-100 rounded-lg active:scale-95 touch-manipulation">
                <Twitter size={18} className="sm:w-5 sm:h-5" />
              </Link>
              <Link href="#" className="text-gray-600 hover:text-green-600 transition p-2 hover:bg-gray-100 rounded-lg active:scale-95 touch-manipulation">
                <Instagram size={18} className="sm:w-5 sm:h-5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6 sm:pt-8 text-center">
          <p className="text-xs sm:text-sm text-gray-500">
            © {new Date().getFullYear()} <span className="font-semibold bg-gradient-to-r from-green-600 via-emerald-600 to-lime-600 bg-clip-text text-transparent">Addiscart</span>. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
