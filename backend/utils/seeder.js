require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Store = require('../models/Store');
const Category = require('../models/Category');
const Product = require('../models/Product');

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/instacart-clone')
  .then(() => console.log('MongoDB connected for seeding'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    console.log('Continuing without MongoDB connection for demo purposes...');
    // Instead of exiting, we'll continue with mock data
    // process.exit(1);
  });

// Sample data
const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password123',
    phone: '555-123-4567',
    role: 'admin',
    addresses: [
      {
        street: '123 Admin St',
        city: 'Admin City',
        state: 'AS',
        zipCode: '12345',
        default: true,
      },
    ],
  },
  {
    name: 'Test User',
    email: 'user@example.com',
    password: 'password123',
    phone: '555-987-6543',
    role: 'customer',
    addresses: [
      {
        street: '456 User Ave',
        city: 'User Town',
        state: 'UT',
        zipCode: '67890',
        default: true,
      },
    ],
  },
  {
    name: 'Shopper User',
    email: 'shopper@example.com',
    password: 'password123',
    phone: '555-456-7890',
    role: 'shopper',
    addresses: [
      {
        street: '789 Shopper Blvd',
        city: 'Shopper City',
        state: 'SC',
        zipCode: '45678',
        default: true,
      },
    ],
  },
];

const stores = [
  {
    name: 'Fresh Grocery',
    description: 'Your local grocery store with fresh produce and essentials.',
    logo: 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
    coverImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    address: {
      street: '100 Market St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94105',
    },
    phone: '415-555-1234',
    email: 'info@freshgrocery.com',
    website: 'https://freshgrocery.example.com',
    hours: {
      monday: { open: '08:00', close: '22:00' },
      tuesday: { open: '08:00', close: '22:00' },
      wednesday: { open: '08:00', close: '22:00' },
      thursday: { open: '08:00', close: '22:00' },
      friday: { open: '08:00', close: '22:00' },
      saturday: { open: '08:00', close: '22:00' },
      sunday: { open: '08:00', close: '20:00' },
    },
    deliveryFee: 3.99,
    minimumOrder: 10.00,
  },
  {
    name: 'Organic Market',
    description: 'Specializing in organic and locally sourced products.',
    logo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
    coverImage: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    address: {
      street: '200 Organic Ave',
      city: 'Berkeley',
      state: 'CA',
      zipCode: '94704',
    },
    phone: '510-555-5678',
    email: 'info@organicmarket.com',
    website: 'https://organicmarket.example.com',
    hours: {
      monday: { open: '09:00', close: '21:00' },
      tuesday: { open: '09:00', close: '21:00' },
      wednesday: { open: '09:00', close: '21:00' },
      thursday: { open: '09:00', close: '21:00' },
      friday: { open: '09:00', close: '21:00' },
      saturday: { open: '09:00', close: '21:00' },
      sunday: { open: '10:00', close: '18:00' },
    },
    deliveryFee: 4.99,
    minimumOrder: 15.00,
  },
  {
    name: 'Quick Mart',
    description: 'Fast delivery of everyday essentials and groceries.',
    logo: 'https://images.unsplash.com/photo-1567103472667-6898f3a79cf2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
    coverImage: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    address: {
      street: '300 Quick St',
      city: 'Oakland',
      state: 'CA',
      zipCode: '94612',
    },
    phone: '510-555-9012',
    email: 'info@quickmart.com',
    website: 'https://quickmart.example.com',
    hours: {
      monday: { open: '07:00', close: '23:00' },
      tuesday: { open: '07:00', close: '23:00' },
      wednesday: { open: '07:00', close: '23:00' },
      thursday: { open: '07:00', close: '23:00' },
      friday: { open: '07:00', close: '23:00' },
      saturday: { open: '07:00', close: '23:00' },
      sunday: { open: '07:00', close: '23:00' },
    },
    deliveryFee: 2.99,
    minimumOrder: 5.00,
  },
  {
    name: 'Gourmet Deli',
    description: 'Premium deli selections, cheeses, and prepared foods.',
    logo: 'https://images.unsplash.com/photo-1625604087024-7fb3c6c3d7b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
    coverImage: 'https://images.unsplash.com/photo-1547496502-affa22e38842?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    address: {
      street: '400 Gourmet Blvd',
      city: 'San Jose',
      state: 'CA',
      zipCode: '95113',
    },
    phone: '408-555-3456',
    email: 'info@gourmetdeli.com',
    website: 'https://gourmetdeli.example.com',
    hours: {
      monday: { open: '10:00', close: '20:00' },
      tuesday: { open: '10:00', close: '20:00' },
      wednesday: { open: '10:00', close: '20:00' },
      thursday: { open: '10:00', close: '20:00' },
      friday: { open: '10:00', close: '21:00' },
      saturday: { open: '10:00', close: '21:00' },
      sunday: { open: '11:00', close: '19:00' },
    },
    deliveryFee: 5.99,
    minimumOrder: 20.00,
  },
  {
    name: 'Whole Foods Market',
    description: 'Premium organic and natural foods with a wide selection.',
    logo: 'https://images.unsplash.com/photo-1588964895597-cfccd6e2dbf9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
    coverImage: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    address: {
      street: '500 Whole Ave',
      city: 'Palo Alto',
      state: 'CA',
      zipCode: '94301',
    },
    phone: '650-555-7890',
    email: 'info@wholefoodsmarket.com',
    website: 'https://wholefoodsmarket.example.com',
    hours: {
      monday: { open: '08:00', close: '22:00' },
      tuesday: { open: '08:00', close: '22:00' },
      wednesday: { open: '08:00', close: '22:00' },
      thursday: { open: '08:00', close: '22:00' },
      friday: { open: '08:00', close: '22:00' },
      saturday: { open: '08:00', close: '22:00' },
      sunday: { open: '08:00', close: '21:00' },
    },
    deliveryFee: 4.99,
    minimumOrder: 15.00,
  },
  {
    name: 'Trader Joes',
    description: 'Unique and affordable groceries with friendly service.',
    logo: 'https://images.unsplash.com/photo-1601599561213-832382fd07ba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
    coverImage: 'https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    address: {
      street: '600 Trader Ln',
      city: 'Mountain View',
      state: 'CA',
      zipCode: '94041',
    },
    phone: '650-555-2345',
    email: 'info@traderjoes.com',
    website: 'https://traderjoes.example.com',
    hours: {
      monday: { open: '08:00', close: '21:00' },
      tuesday: { open: '08:00', close: '21:00' },
      wednesday: { open: '08:00', close: '21:00' },
      thursday: { open: '08:00', close: '21:00' },
      friday: { open: '08:00', close: '21:00' },
      saturday: { open: '08:00', close: '21:00' },
      sunday: { open: '08:00', close: '21:00' },
    },
    deliveryFee: 3.49,
    minimumOrder: 12.00,
  },
  {
    name: 'Safeway',
    description: 'Your neighborhood supermarket with great deals and variety.',
    logo: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
    coverImage: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    address: {
      street: '700 Safeway Dr',
      city: 'Sunnyvale',
      state: 'CA',
      zipCode: '94086',
    },
    phone: '408-555-6789',
    email: 'info@safeway.com',
    website: 'https://safeway.example.com',
    hours: {
      monday: { open: '06:00', close: '23:00' },
      tuesday: { open: '06:00', close: '23:00' },
      wednesday: { open: '06:00', close: '23:00' },
      thursday: { open: '06:00', close: '23:00' },
      friday: { open: '06:00', close: '23:00' },
      saturday: { open: '06:00', close: '23:00' },
      sunday: { open: '06:00', close: '23:00' },
    },
    deliveryFee: 3.99,
    minimumOrder: 10.00,
  },
  {
    name: 'Costco Wholesale',
    description: 'Bulk groceries and household items at wholesale prices.',
    logo: 'https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
    coverImage: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    address: {
      street: '800 Wholesale Way',
      city: 'Fremont',
      state: 'CA',
      zipCode: '94538',
    },
    phone: '510-555-4567',
    email: 'info@costco.com',
    website: 'https://costco.example.com',
    hours: {
      monday: { open: '10:00', close: '20:30' },
      tuesday: { open: '10:00', close: '20:30' },
      wednesday: { open: '10:00', close: '20:30' },
      thursday: { open: '10:00', close: '20:30' },
      friday: { open: '10:00', close: '20:30' },
      saturday: { open: '09:30', close: '18:00' },
      sunday: { open: '10:00', close: '18:00' },
    },
    deliveryFee: 0.00,
    minimumOrder: 35.00,
  },
];

// Professional category structure following major e-commerce best practices
const categories = [
  {
    name: 'Fresh Produce',
    slug: 'fresh-produce',
    description: 'Fresh fruits and vegetables delivered daily',
    icon: '🥬',
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=500&q=80',
    order: 1,
    isFeatured: true,
    metadata: {
      color: 'from-green-100 to-emerald-100',
      keywords: ['fruits', 'vegetables', 'organic', 'fresh', 'produce'],
    },
  },
  {
    name: 'Meat & Seafood',
    slug: 'meat-seafood',
    description: 'Premium cuts and fresh seafood',
    icon: '🥩',
    image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=500&q=80',
    order: 2,
    isFeatured: true,
    metadata: {
      color: 'from-red-100 to-pink-100',
      keywords: ['meat', 'seafood', 'chicken', 'beef', 'fish', 'protein'],
    },
  },
  {
    name: 'Dairy & Eggs',
    slug: 'dairy-eggs',
    description: 'Milk, cheese, yogurt, and farm-fresh eggs',
    icon: '🥛',
    image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=500&q=80',
    order: 3,
    isFeatured: true,
    metadata: {
      color: 'from-blue-100 to-cyan-100',
      keywords: ['dairy', 'milk', 'cheese', 'yogurt', 'eggs', 'butter'],
    },
  },
  {
    name: 'Bakery',
    slug: 'bakery',
    description: 'Freshly baked bread, pastries, and desserts',
    icon: '🍞',
    image: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=500&q=80',
    order: 4,
    isFeatured: true,
    metadata: {
      color: 'from-orange-100 to-amber-100',
      keywords: ['bread', 'bakery', 'pastries', 'cakes', 'desserts'],
    },
  },
  {
    name: 'Pantry Staples',
    slug: 'pantry-staples',
    description: 'Pasta, rice, sauces, and canned goods',
    icon: '🥫',
    image: 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=500&q=80',
    order: 5,
    isFeatured: true,
    metadata: {
      color: 'from-amber-100 to-yellow-100',
      keywords: ['pantry', 'pasta', 'rice', 'canned', 'sauces', 'staples'],
    },
  },
  {
    name: 'Snacks & Candy',
    slug: 'snacks-candy',
    description: 'Chips, cookies, candy, and sweet treats',
    icon: '🍬',
    image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=500&q=80',
    order: 6,
    isFeatured: true,
    metadata: {
      color: 'from-yellow-100 to-orange-100',
      keywords: ['snacks', 'candy', 'chips', 'cookies', 'treats'],
    },
  },
  {
    name: 'Beverages',
    slug: 'beverages',
    description: 'Drinks, juices, coffee, tea, and more',
    icon: '🥤',
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=500&q=80',
    order: 7,
    isFeatured: false,
    metadata: {
      color: 'from-purple-100 to-pink-100',
      keywords: ['beverages', 'drinks', 'juice', 'soda', 'coffee', 'tea'],
    },
  },
  {
    name: 'Frozen Foods',
    slug: 'frozen-foods',
    description: 'Frozen meals, vegetables, and ice cream',
    icon: '🧊',
    image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=500&q=80',
    order: 8,
    isFeatured: false,
    metadata: {
      color: 'from-cyan-100 to-blue-100',
      keywords: ['frozen', 'ice cream', 'frozen meals', 'frozen vegetables'],
    },
  },
  {
    name: 'Household Essentials',
    slug: 'household-essentials',
    description: 'Cleaning supplies and household items',
    icon: '🧹',
    image: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=500&q=80',
    order: 9,
    isFeatured: false,
    metadata: {
      color: 'from-gray-100 to-slate-100',
      keywords: ['household', 'cleaning', 'supplies', 'essentials'],
    },
  },
  {
    name: 'Personal Care',
    slug: 'personal-care',
    description: 'Beauty, hygiene, and wellness products',
    icon: '🧴',
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500&q=80',
    order: 10,
    isFeatured: false,
    metadata: {
      color: 'from-pink-100 to-rose-100',
      keywords: ['personal care', 'beauty', 'hygiene', 'wellness'],
    },
  },
  {
    name: 'Health & Wellness',
    slug: 'health-wellness',
    description: 'Vitamins, supplements, and health products',
    icon: '💊',
    image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&q=80',
    order: 11,
    isFeatured: false,
    metadata: {
      color: 'from-green-100 to-teal-100',
      keywords: ['health', 'wellness', 'vitamins', 'supplements'],
    },
  },
  {
    name: 'Baby & Kids',
    slug: 'baby-kids',
    description: 'Baby food, diapers, and kids essentials',
    icon: '👶',
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=500&q=80',
    order: 12,
    isFeatured: false,
    metadata: {
      color: 'from-blue-100 to-indigo-100',
      keywords: ['baby', 'kids', 'diapers', 'baby food', 'children'],
    },
  },
  {
    name: 'Pet Care',
    slug: 'pet-care',
    description: 'Pet food, treats, and supplies',
    icon: '🐾',
    image: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=500&q=80',
    order: 13,
    isFeatured: false,
    metadata: {
      color: 'from-orange-100 to-red-100',
      keywords: ['pet', 'pet food', 'dog', 'cat', 'pet supplies'],
    },
  },
  {
    name: 'Deli & Prepared Foods',
    slug: 'deli-prepared',
    description: 'Ready-to-eat meals and deli selections',
    icon: '🥪',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&q=80',
    order: 14,
    isFeatured: false,
    metadata: {
      color: 'from-yellow-100 to-amber-100',
      keywords: ['deli', 'prepared', 'ready-to-eat', 'sandwiches'],
    },
  },
  {
    name: 'Alcohol',
    slug: 'alcohol',
    description: 'Beer, wine, and spirits',
    icon: '🍷',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=500&q=80',
    order: 15,
    isFeatured: false,
    metadata: {
      color: 'from-purple-100 to-pink-100',
      keywords: ['alcohol', 'beer', 'wine', 'spirits', 'drinks'],
    },
  },
];

const products = [
  // Fruits & Vegetables
  {
    name: 'Organic Bananas',
    description: 'Sweet and nutritious organic bananas, perfect for snacking or baking.',
    price: 0.79,
    salePrice: 0.69,
    onSale: true,
    images: [
      'https://images.unsplash.com/photo-1543218024-57a70143c369?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    ],
    stock: 100,
    unit: 'each',
    weight: 0.2,
    brand: 'Organic Farms',
    tags: ['organic', 'fruit', 'banana'],
    isFeatured: true,
    nutritionFacts: {
      calories: 105,
      fat: 0.4,
      carbs: 27,
      protein: 1.3,
      ingredients: '100% Organic Bananas',
      allergens: [],
    },
  },
  {
    name: 'Avocado',
    description: 'Ripe and ready to eat avocados, perfect for guacamole or toast.',
    price: 1.99,
    images: [
      'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    ],
    stock: 50,
    unit: 'each',
    weight: 0.3,
    brand: 'Fresh Produce',
    tags: ['fruit', 'avocado'],
    nutritionFacts: {
      calories: 240,
      fat: 22,
      carbs: 12,
      protein: 3,
      ingredients: '100% Avocado',
      allergens: [],
    },
  },
  // Dairy & Eggs
  {
    name: 'Organic Whole Milk',
    description: 'Fresh organic whole milk from grass-fed cows.',
    price: 4.99,
    images: [
      'https://images.unsplash.com/photo-1550583724-b2692b85b150?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    ],
    stock: 30,
    unit: 'each',
    weight: 1,
    brand: 'Dairy Farms',
    tags: ['organic', 'dairy', 'milk'],
    isFeatured: true,
    nutritionFacts: {
      calories: 150,
      fat: 8,
      carbs: 12,
      protein: 8,
      ingredients: '100% Organic Whole Milk',
      allergens: ['milk'],
    },
  },
  {
    name: 'Large Eggs',
    description: 'Farm fresh large eggs, perfect for breakfast or baking.',
    price: 3.99,
    salePrice: 2.99,
    onSale: true,
    images: [
      'https://images.unsplash.com/photo-1506976785307-8732e854ad03?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    ],
    stock: 40,
    unit: 'each',
    weight: 0.6,
    brand: 'Farm Fresh',
    tags: ['eggs', 'dairy'],
    nutritionFacts: {
      calories: 70,
      fat: 5,
      carbs: 0,
      protein: 6,
      ingredients: '100% Eggs',
      allergens: ['eggs'],
    },
  },
  // Bakery
  {
    name: 'Sourdough Bread',
    description: 'Freshly baked sourdough bread with a crispy crust and soft interior.',
    price: 4.49,
    images: [
      'https://images.unsplash.com/photo-1585478259715-4ddc6bc4f9ed?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    ],
    stock: 20,
    unit: 'each',
    weight: 0.8,
    brand: 'Artisan Bakery',
    tags: ['bread', 'bakery', 'sourdough'],
    nutritionFacts: {
      calories: 120,
      fat: 0.5,
      carbs: 24,
      protein: 4,
      ingredients: 'Flour, Water, Salt, Sourdough Starter',
      allergens: ['wheat', 'gluten'],
    },
  },
  // Meat & Seafood
  {
    name: 'Organic Chicken Breast',
    description: 'Boneless, skinless organic chicken breast from free-range chickens.',
    price: 9.99,
    images: [
      'https://images.unsplash.com/photo-1604503468506-a8da13d82791?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    ],
    stock: 15,
    unit: 'lb',
    weight: 1,
    brand: 'Organic Farms',
    tags: ['organic', 'meat', 'chicken'],
    isFeatured: true,
    nutritionFacts: {
      calories: 165,
      fat: 3.6,
      carbs: 0,
      protein: 31,
      ingredients: '100% Organic Chicken Breast',
      allergens: [],
    },
  },
  // Pantry
  {
    name: 'Organic Pasta',
    description: 'Organic spaghetti pasta made with durum wheat.',
    price: 2.99,
    images: [
      'https://images.unsplash.com/photo-1551462147-ff29053bfc14?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    ],
    stock: 60,
    unit: 'each',
    weight: 0.5,
    brand: 'Organic Pantry',
    tags: ['organic', 'pasta', 'pantry'],
    nutritionFacts: {
      calories: 200,
      fat: 1,
      carbs: 42,
      protein: 7,
      ingredients: 'Organic Durum Wheat Semolina',
      allergens: ['wheat', 'gluten'],
    },
  },
];

// Seed data function
const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Store.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});

    console.log('Previous data cleared');

    // Create users
    const createdUsers = [];
    for (const user of users) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.password, salt);
      
      const newUser = await User.create({
        ...user,
        password: hashedPassword,
      });
      
      createdUsers.push(newUser);
    }

    console.log(`${createdUsers.length} users created`);

    // Create stores
    const createdStores = [];
    for (const store of stores) {
      const newStore = await Store.create(store);
      createdStores.push(newStore);
    }

    console.log(`${createdStores.length} stores created`);

    // Create categories for each store
    const createdCategories = [];
    for (const store of createdStores) {
      for (const category of categories) {
        const newCategory = await Category.create({
          ...category,
          store: store._id,
        });
        createdCategories.push(newCategory);
      }
    }

    console.log(`${createdCategories.length} categories created`);

    // Create products for each store and category
    const createdProducts = [];
    for (const store of createdStores) {
      const storeCategories = await Category.find({ store: store._id });
      
      for (let i = 0; i < products.length; i++) {
        const categoryIndex = i % storeCategories.length;
        const category = storeCategories[categoryIndex];
        
        const newProduct = await Product.create({
          ...products[i],
          store: store._id,
          category: category._id,
        });
        
        createdProducts.push(newProduct);
      }
    }

    console.log(`${createdProducts.length} products created`);

    // Add featured products to stores
    for (const store of createdStores) {
      const storeProducts = await Product.find({ 
        store: store._id,
        isFeatured: true,
      }).limit(3);
      
      store.featuredProducts = storeProducts.map(product => product._id);
      await store.save();
    }

    console.log('Featured products added to stores');
    console.log('Database seeded successfully!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

// Run the seed function
seedData();
