'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Clock } from 'lucide-react';

interface SimpleStore {
  _id: string;
  name: string;
  logo: string;
  deliveryTime: string;
  badge?: string;
}

interface DetailedStore {
  _id: string;
  name: string;
  logo: string;
  description: string;
  deliveryTime: string;
  distance: string;
  categories: string;
  badge?: string;
}

// Your stores - top section
const yourStores: SimpleStore[] = [
  { _id: '1', name: 'Safeway', logo: 'https://logo.clearbit.com/safeway.com', deliveryTime: '20 min' },
  { _id: '2', name: 'Walgreens', logo: 'https://logo.clearbit.com/walgreens.com', deliveryTime: '25 min', badge: '$5 off' },
  { _id: '3', name: 'Costco', logo: 'https://logo.clearbit.com/costco.com', deliveryTime: '30 min' },
  { _id: '4', name: 'Sprouts Farmers Market', logo: 'https://logo.clearbit.com/sprouts.com', deliveryTime: '25 min', badge: 'In-store prices' },
  { _id: '5', name: 'Target', logo: 'https://logo.clearbit.com/target.com', deliveryTime: '25 min' },
  { _id: '6', name: 'FoodsCo', logo: 'https://logo.clearbit.com/foodsco.net', deliveryTime: '20 min' },
  { _id: '7', name: 'Walmart', logo: 'https://logo.clearbit.com/walmart.com', deliveryTime: '30 min', badge: 'In-store prices' },
  { _id: '8', name: 'HMart', logo: 'https://logo.clearbit.com/hmart.com', deliveryTime: '25 min', badge: 'By 2:30pm' },
  { _id: '9', name: 'Rainbow Grocery', logo: 'https://logo.clearbit.com/rainbow.coop', deliveryTime: '25 min' },
  { _id: '10', name: 'Lucky Supermarkets', logo: 'https://logo.clearbit.com/luckysupermarkets.com', deliveryTime: '30 min', badge: 'In-store prices' },
  { _id: '11', name: 'Whole Foods', logo: 'https://logo.clearbit.com/wholefoodsmarket.com', deliveryTime: '30 min' },
  { _id: '12', name: 'Trader Joe\'s', logo: 'https://logo.clearbit.com/traderjoes.com', deliveryTime: '35 min' },
  { _id: '13', name: 'CVS', logo: 'https://logo.clearbit.com/cvs.com', deliveryTime: '20 min', badge: '$3 off' },
  { _id: '14', name: 'Rite Aid', logo: 'https://logo.clearbit.com/riteaid.com', deliveryTime: '25 min' },
  { _id: '15', name: 'Albertsons', logo: 'https://logo.clearbit.com/albertsons.com', deliveryTime: '25 min' },
  { _id: '16', name: 'Kroger', logo: 'https://logo.clearbit.com/kroger.com', deliveryTime: '30 min', badge: 'In-store prices' },
  { _id: '17', name: 'Smart & Final', logo: 'https://logo.clearbit.com/smartandfinal.com', deliveryTime: '25 min' },
  { _id: '18', name: 'Raley\'s', logo: 'https://logo.clearbit.com/raleys.com', deliveryTime: '30 min' },
];

// Beyond grocery stores
const beyondGrocery: SimpleStore[] = [
  { _id: '19', name: "Kohl's", logo: 'https://logo.clearbit.com/kohls.com', deliveryTime: '30 min', badge: '$15 off' },
  { _id: '20', name: 'Total Wine & More', logo: 'https://logo.clearbit.com/totalwine.com', deliveryTime: '25 min' },
  { _id: '21', name: "Lowe's", logo: 'https://logo.clearbit.com/lowes.com', deliveryTime: '30 min', badge: '$15 off' },
  { _id: '22', name: 'BevMo!', logo: 'https://logo.clearbit.com/bevmo.com', deliveryTime: '20 min' },
  { _id: '23', name: 'Staples', logo: 'https://logo.clearbit.com/staples.com', deliveryTime: '25 min', badge: 'In-store prices' },
  { _id: '24', name: 'Michaels', logo: 'https://logo.clearbit.com/michaels.com', deliveryTime: '30 min', badge: 'In-store prices' },
  { _id: '25', name: 'The Home Depot', logo: 'https://logo.clearbit.com/homedepot.com', deliveryTime: '30 min' },
  { _id: '26', name: 'Dollar Tree', logo: 'https://logo.clearbit.com/dollartree.com', deliveryTime: '25 min', badge: 'In-store prices' },
  { _id: '27', name: 'PetSmart', logo: 'https://logo.clearbit.com/petsmart.com', deliveryTime: '30 min', badge: 'In-store prices' },
  { _id: '28', name: "DICK'S Sporting Goods", logo: 'https://logo.clearbit.com/dickssportinggoods.com', deliveryTime: '30 min', badge: 'In-store prices' },
  { _id: '29', name: 'Petco', logo: 'https://logo.clearbit.com/petco.com', deliveryTime: '30 min', badge: 'In-store prices' },
  { _id: '30', name: 'Best Buy', logo: 'https://logo.clearbit.com/bestbuy.com', deliveryTime: '35 min' },
  { _id: '31', name: 'Bed Bath & Beyond', logo: 'https://logo.clearbit.com/bedbathandbeyond.com', deliveryTime: '30 min' },
  { _id: '32', name: 'Office Depot', logo: 'https://logo.clearbit.com/officedepot.com', deliveryTime: '25 min' },
  { _id: '33', name: 'Sephora', logo: 'https://logo.clearbit.com/sephora.com', deliveryTime: '30 min', badge: '$10 off' },
  { _id: '34', name: 'Ulta Beauty', logo: 'https://logo.clearbit.com/ulta.com', deliveryTime: '30 min' },
];

// Detailed stores for "Stores to help you save" section
const detailedStores: DetailedStore[] = [
  {
    _id: 'sprouts',
    name: 'Sprouts Farmers Market',
    logo: 'https://logo.clearbit.com/sprouts.com',
    description: 'Organic • Groceries • Butcher Shop',
    deliveryTime: 'Delivery by 1:45pm',
    distance: '9.3 mi',
    categories: 'In-store prices • Lots of deals',
    badge: 'In-store prices'
  },
  {
    _id: 'foodsco',
    name: 'FoodsCo',
    logo: 'https://logo.clearbit.com/foodsco.net',
    description: 'Pantry • Meat • Frozen Food',
    deliveryTime: 'Delivery by 1:10pm',
    distance: '2.0 mi',
    categories: 'Low prices • Loyalty savings',
    badge: '$'
  },
  {
    _id: 'walmart',
    name: 'Walmart',
    logo: 'https://logo.clearbit.com/walmart.com',
    description: 'Groceries • Home • Electronics',
    deliveryTime: 'Delivery by 3:45pm',
    distance: '5.8 mi',
    categories: 'In-store prices • Low prices',
    badge: 'In-store prices'
  },
  {
    _id: 'lucky',
    name: 'Lucky Supermarkets',
    logo: 'https://logo.clearbit.com/luckysupermarkets.com',
    description: 'Groceries • Produce • Organic',
    deliveryTime: 'Delivery by 1:00pm',
    distance: '3.0 mi',
    categories: 'In-store prices • Lots of deals',
    badge: 'In-store prices'
  },
  {
    _id: 'smart-final',
    name: 'Smart & Final',
    logo: 'https://logo.clearbit.com/smartandfinal.com',
    description: 'Alcohol • Groceries',
    deliveryTime: 'Delivery by 1:15pm',
    distance: '3.9 mi',
    categories: 'Bulk pricing',
  },
  {
    _id: 'raleys',
    name: "Raley's",
    logo: 'https://logo.clearbit.com/raleys.com',
    description: 'Groceries • Produce • Organic',
    deliveryTime: 'Delivery by 1:45pm',
    distance: '8.8 mi',
    categories: 'Lots of deals',
    badge: '$$'
  },
];

export default function StoresPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Page Header */}
        <div className="mb-8 sm:mb-10 md:mb-12 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 sm:mb-3">
            Shop from your favorite stores
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600">
            Browse 109+ stores and get delivery in as fast as 1 hour
          </p>
        </div>

        {/* Your stores Section */}
        <div className="mb-10 sm:mb-12 md:mb-16">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Your stores</h2>
            <Link href="#" className="text-sm font-medium text-green-600 hover:text-green-700 flex items-center gap-1">
              Show all
              <span className="text-gray-500">109 stores</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {yourStores.map((store) => (
              <Link
                key={store._id}
                href={`/stores/${store._id}`}
                className="flex-shrink-0 w-28 group"
              >
                <div className="relative">
                  {store.badge && (
                    <div className="absolute -top-2 left-0 right-0 z-10 flex justify-center">
                      <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-[10px] font-bold px-2 py-1 rounded-full text-gray-900 shadow-md whitespace-nowrap">
                        {store.badge}
                      </div>
                    </div>
                  )}
                  <div className="w-24 h-24 bg-white rounded-xl border-2 border-gray-200 flex items-center justify-center mb-2 group-hover:border-green-500 group-hover:shadow-lg transition-all duration-300 overflow-hidden p-3 mt-2">
                    <Image
                      src={store.logo}
                      alt={store.name}
                      width={72}
                      height={72}
                      className="object-contain group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=100&h=100&fit=crop';
                      }}
                    />
                  </div>
                </div>
                <p className="text-xs font-medium text-gray-900 text-center line-clamp-2 mb-1 group-hover:text-green-600 transition-colors">
                  {store.name}
                </p>
                <p className="text-xs text-gray-500 text-center">{store.deliveryTime}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Beyond grocery Section */}
        <div className="mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Beyond grocery</h2>
          
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {beyondGrocery.map((store) => (
              <Link
                key={store._id}
                href={`/stores/${store._id}`}
                className="flex-shrink-0 w-28 group"
              >
                <div className="relative">
                  {store.badge && (
                    <div className="absolute -top-2 left-0 right-0 z-10 flex justify-center">
                      <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-[10px] font-bold px-2 py-1 rounded-full text-gray-900 shadow-md whitespace-nowrap">
                        {store.badge}
                      </div>
                    </div>
                  )}
                  <div className="w-24 h-24 bg-white rounded-xl border-2 border-gray-200 flex items-center justify-center mb-2 group-hover:border-green-500 group-hover:shadow-lg transition-all duration-300 overflow-hidden p-3 mt-2">
                    <Image
                      src={store.logo}
                      alt={store.name}
                      width={72}
                      height={72}
                      className="object-contain group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=100&h=100&fit=crop';
                      }}
                    />
                  </div>
                </div>
                <p className="text-xs font-medium text-gray-900 text-center line-clamp-2 mb-1 group-hover:text-green-600 transition-colors">
                  {store.name}
                </p>
                <p className="text-xs text-gray-500 text-center">{store.deliveryTime}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Stores to help you save Section */}
        <div className="mb-10 sm:mb-12 md:mb-16">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Stores to help you save</h2>
            <Link href="#" className="text-sm font-medium text-gray-900 hover:text-green-600 flex items-center gap-1">
              Show all
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {detailedStores.map((store) => (
              <Link
                key={store._id}
                href={`/stores/${store._id}`}
                className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 hover:shadow-lg transition-shadow active:scale-[0.98] touch-manipulation"
              >
                <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-white rounded-lg border border-gray-200 flex items-center justify-center flex-shrink-0 p-1.5 sm:p-2">
                    <Image
                      src={store.logo}
                      alt={store.name}
                      width={48}
                      height={48}
                      className="object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=100&h=100&fit=crop';
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm sm:text-base text-gray-900 mb-1.5 sm:mb-2">{store.name}</h3>
                    {store.badge && (
                      <span className="inline-block bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-900 text-[10px] sm:text-xs font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md">
                        {store.badge}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span>{store.deliveryTime} • {store.distance} • $$</span>
                  </div>
                  <p className="text-gray-600">{store.description}</p>
                  <p className="text-gray-500 text-[10px] sm:text-xs">{store.categories}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* There's more to explore Section */}
        <div className="text-center py-10 sm:py-12 md:py-16 bg-white rounded-xl sm:rounded-2xl border border-gray-200 mt-8 sm:mt-10 md:mt-12">
          <div className="mb-4 sm:mb-6">
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
              </svg>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1.5 sm:mb-2">There's more to explore</h3>
            <p className="text-sm sm:text-base text-gray-600">Shop 109 stores (and counting) in San Francisco.</p>
          </div>
          <Link
            href="/stores"
            className="inline-flex items-center gap-2 bg-green-600 text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl font-semibold hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl active:scale-95 touch-manipulation"
          >
            View all stores
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
