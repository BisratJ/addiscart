/**
 * Application-wide constants
 * Centralized configuration for easy maintenance
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 2,
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
} as const;

// App Configuration
export const APP_CONFIG = {
  NAME: 'Instacart Clone',
  DESCRIPTION: 'Order groceries for delivery or pickup',
  DEFAULT_LOCATION: 'San Francisco, CA',
  SUPPORT_EMAIL: 'support@instacart-clone.com',
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
  PRODUCTS_PER_PAGE: 20,
  STORES_PER_PAGE: 12,
} as const;

// Cart Configuration
export const CART_CONFIG = {
  MAX_QUANTITY: 99,
  MIN_ORDER_AMOUNT: 10,
  DEFAULT_DELIVERY_FEE: 3.99,
  FREE_DELIVERY_THRESHOLD: 35,
} as const;

// Image Configuration
export const IMAGE_CONFIG = {
  PLACEHOLDER: 'https://placehold.co/600x600/CCCCCC/666666/png?text=Product',
  QUALITY: 80,
  SIZES: {
    THUMBNAIL: 150,
    SMALL: 300,
    MEDIUM: 600,
    LARGE: 1200,
  },
} as const;

// Category Icons (for fallback)
export const CATEGORY_ICONS: Record<string, string> = {
  'fresh-produce': '🥬',
  'meat-seafood': '🥩',
  'dairy-eggs': '🥛',
  'bakery': '🍞',
  'pantry-staples': '🥫',
  'snacks-candy': '🍬',
  'beverages': '🥤',
  'frozen-foods': '🧊',
  'household-essentials': '🧹',
  'personal-care': '🧴',
  'health-wellness': '💊',
  'baby-kids': '👶',
  'pet-care': '🐾',
  'deli-prepared': '🥪',
  'alcohol': '🍷',
  'default': '📦',
};

// Product Units
export const PRODUCT_UNITS = [
  'each',
  'lb',
  'oz',
  'kg',
  'g',
  'l',
  'ml',
  'pack',
  'box',
  'bag',
] as const;

// Order Status
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
} as const;

// Payment Methods
export const PAYMENT_METHODS = {
  CARD: 'card',
  PAYPAL: 'paypal',
  APPLE_PAY: 'apple_pay',
  GOOGLE_PAY: 'google_pay',
} as const;

// Delivery Time Slots
export const DELIVERY_SLOTS = [
  { id: '1', label: 'ASAP (30-60 min)', value: 'asap' },
  { id: '2', label: 'Today 2-4 PM', value: 'today-afternoon' },
  { id: '3', label: 'Today 4-6 PM', value: 'today-evening' },
  { id: '4', label: 'Tomorrow 9-11 AM', value: 'tomorrow-morning' },
  { id: '5', label: 'Tomorrow 2-4 PM', value: 'tomorrow-afternoon' },
] as const;

// Regex Patterns
export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\+?[\d\s-()]+$/,
  ZIP_CODE: /^\d{5}(-\d{4})?$/,
  CREDIT_CARD: /^\d{13,19}$/,
  CVV: /^\d{3,4}$/,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'Please log in to continue.',
  NOT_FOUND: 'Resource not found.',
  VALIDATION_ERROR: 'Please check your input.',
  GENERIC_ERROR: 'Something went wrong. Please try again.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  ITEM_ADDED: 'Item added to cart',
  ITEM_REMOVED: 'Item removed from cart',
  ORDER_PLACED: 'Order placed successfully',
  PROFILE_UPDATED: 'Profile updated successfully',
  ADDRESS_SAVED: 'Address saved successfully',
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  CART: 'cart',
  RECENT_SEARCHES: 'recent_searches',
  FAVORITE_STORES: 'favorite_stores',
  LOCATION: 'location',
} as const;

// Animation Durations (ms)
export const ANIMATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;

// Breakpoints (matching Tailwind)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

// Feature Flags
export const FEATURES = {
  ENABLE_GOOGLE_AUTH: process.env.NEXT_PUBLIC_ENABLE_GOOGLE_AUTH === 'true',
  ENABLE_STRIPE: process.env.NEXT_PUBLIC_ENABLE_STRIPE === 'true',
  ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
  ENABLE_PWA: process.env.NEXT_PUBLIC_ENABLE_PWA === 'true',
} as const;

export type ProductUnit = typeof PRODUCT_UNITS[number];
export type OrderStatus = typeof ORDER_STATUS[keyof typeof ORDER_STATUS];
export type PaymentMethod = typeof PAYMENT_METHODS[keyof typeof PAYMENT_METHODS];
