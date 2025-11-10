// Comprehensive search data for products and stores

export interface SearchItem {
  name: string;
  image: string;
  type: 'product' | 'store';
  category?: string;
}

export const topSearches: SearchItem[] = [
  { name: 'milk', image: '🥛', type: 'product', category: 'dairy' },
  { name: 'eggs', image: '🥚', type: 'product', category: 'dairy' },
  { name: 'rotisserie chicken', image: '🍗', type: 'product', category: 'meat' },
  { name: 'bananas', image: '🍌', type: 'product', category: 'produce' },
  { name: 'chicken breast', image: '🍗', type: 'product', category: 'meat' },
  { name: 'toilet paper', image: '🧻', type: 'product', category: 'household' },
  { name: 'flowers', image: '🌹', type: 'product', category: 'floral' },
  { name: 'covid test', image: '🧪', type: 'product', category: 'health' },
];

export const trendingItems: SearchItem[] = [
  { name: 'drizzilicious', image: '🍿', type: 'product', category: 'snacks' },
  { name: 'aa batteries', image: '🔋', type: 'product', category: 'electronics' },
  { name: 'ginger', image: '🫚', type: 'product', category: 'produce' },
  { name: 'ground turkey', image: '🦃', type: 'product', category: 'meat' },
  { name: 'lighter', image: '🔥', type: 'product', category: 'household' },
  { name: 'pomegranate', image: '🍎', type: 'product', category: 'produce' },
  { name: 'garlic', image: '🧄', type: 'product', category: 'produce' },
  { name: 'heavy cream', image: '🥛', type: 'product', category: 'dairy' },
];

export const beyondGrocery: SearchItem[] = [
  { name: 'vodka', image: '🍸', type: 'product', category: 'alcohol' },
  { name: 'mums', image: '🌼', type: 'product', category: 'floral' },
  { name: 'room spray', image: '💨', type: 'product', category: 'household' },
  { name: 'dog treats', image: '🦴', type: 'product', category: 'pets' },
  { name: 'paper towels', image: '🧻', type: 'product', category: 'household' },
  { name: 'tequila', image: '🍹', type: 'product', category: 'alcohol' },
  { name: 'moving boxes', image: '📦', type: 'product', category: 'household' },
  { name: 'hand soap', image: '🧼', type: 'product', category: 'personal care' },
];

export const stores: SearchItem[] = [
  { name: 'Safeway', image: '🏪', type: 'store' },
  { name: 'Walgreens', image: '💊', type: 'store' },
  { name: 'Costco', image: '🛒', type: 'store' },
  { name: 'Sprouts Farmers Market', image: '🥬', type: 'store' },
  { name: 'Target', image: '🎯', type: 'store' },
  { name: 'Walmart', image: '🛍️', type: 'store' },
  { name: 'CVS', image: '💊', type: 'store' },
  { name: 'Whole Foods', image: '🥬', type: 'store' },
  { name: 'Kroger', image: '🏬', type: 'store' },
  { name: 'Albertsons', image: '🏪', type: 'store' },
  { name: 'Trader Joe\'s', image: '🛒', type: 'store' },
  { name: 'Aldi', image: '🏬', type: 'store' },
  { name: 'Publix', image: '🏪', type: 'store' },
  { name: 'Rite Aid', image: '💊', type: 'store' },
  { name: 'HMart', image: '🏬', type: 'store' },
  { name: 'Aldea Home & Baby', image: '🏪', type: 'store' },
  { name: 'Sports Basement', image: '⚽', type: 'store' },
  { name: 'The Gifted Basket', image: '🎁', type: 'store' },
  { name: 'Bath & Body Works', image: '🧴', type: 'store' },
  { name: 'Cardenas Markets', image: '🛒', type: 'store' },
  { name: 'Bianchini\'s Market San Carlos', image: '🏬', type: 'store' },
];

export const allProducts: SearchItem[] = [
  // Produce
  { name: 'avocado', image: '🥑', type: 'product', category: 'produce' },
  { name: 'apple', image: '🍎', type: 'product', category: 'produce' },
  { name: 'asparagus', image: '🌿', type: 'product', category: 'produce' },
  { name: 'arugula', image: '🥬', type: 'product', category: 'produce' },
  { name: 'bananas', image: '🍌', type: 'product', category: 'produce' },
  { name: 'basil', image: '🌿', type: 'product', category: 'produce' },
  { name: 'broccoli', image: '🥦', type: 'product', category: 'produce' },
  { name: 'bell pepper', image: '🫑', type: 'product', category: 'produce' },
  { name: 'carrot', image: '🥕', type: 'product', category: 'produce' },
  { name: 'carrots bag', image: '🥕', type: 'product', category: 'produce' },
  { name: 'carrots fresh', image: '🥕', type: 'product', category: 'produce' },
  { name: 'celery', image: '🥬', type: 'product', category: 'produce' },
  { name: 'cucumber', image: '🥒', type: 'product', category: 'produce' },
  { name: 'garlic', image: '🧄', type: 'product', category: 'produce' },
  { name: 'ginger', image: '🫚', type: 'product', category: 'produce' },
  { name: 'grapes', image: '🍇', type: 'product', category: 'produce' },
  { name: 'lettuce', image: '🥬', type: 'product', category: 'produce' },
  { name: 'onion', image: '🧅', type: 'product', category: 'produce' },
  { name: 'orange', image: '🍊', type: 'product', category: 'produce' },
  { name: 'pomegranate', image: '🍎', type: 'product', category: 'produce' },
  { name: 'potato', image: '🥔', type: 'product', category: 'produce' },
  { name: 'spinach', image: '🥬', type: 'product', category: 'produce' },
  { name: 'strawberries', image: '🍓', type: 'product', category: 'produce' },
  { name: 'tomato', image: '🍅', type: 'product', category: 'produce' },
  
  // Dairy & Eggs
  { name: 'milk', image: '🥛', type: 'product', category: 'dairy' },
  { name: 'almond milk', image: '🥛', type: 'product', category: 'dairy' },
  { name: 'oat milk', image: '🥛', type: 'product', category: 'dairy' },
  { name: 'eggs', image: '🥚', type: 'product', category: 'dairy' },
  { name: 'butter', image: '🧈', type: 'product', category: 'dairy' },
  { name: 'cheese', image: '🧀', type: 'product', category: 'dairy' },
  { name: 'cream cheese', image: '🧀', type: 'product', category: 'dairy' },
  { name: 'heavy cream', image: '🥛', type: 'product', category: 'dairy' },
  { name: 'sour cream', image: '🥛', type: 'product', category: 'dairy' },
  { name: 'yogurt', image: '🥛', type: 'product', category: 'dairy' },
  
  // Meat & Seafood
  { name: 'chicken breast', image: '🍗', type: 'product', category: 'meat' },
  { name: 'rotisserie chicken', image: '🍗', type: 'product', category: 'meat' },
  { name: 'ground turkey', image: '🦃', type: 'product', category: 'meat' },
  { name: 'ground beef', image: '🥩', type: 'product', category: 'meat' },
  { name: 'bacon', image: '🥓', type: 'product', category: 'meat' },
  { name: 'sausage', image: '🌭', type: 'product', category: 'meat' },
  { name: 'steak', image: '🥩', type: 'product', category: 'meat' },
  { name: 'carne asada', image: '🥩', type: 'product', category: 'meat' },
  { name: 'salmon', image: '🐟', type: 'product', category: 'seafood' },
  { name: 'shrimp', image: '🦐', type: 'product', category: 'seafood' },
  { name: 'tuna', image: '🐟', type: 'product', category: 'seafood' },
  
  // Bakery
  { name: 'bread', image: '🍞', type: 'product', category: 'bakery' },
  { name: 'bagel', image: '🥯', type: 'product', category: 'bakery' },
  { name: 'croissant', image: '🥐', type: 'product', category: 'bakery' },
  { name: 'muffin', image: '🧁', type: 'product', category: 'bakery' },
  { name: 'cake', image: '🎂', type: 'product', category: 'bakery' },
  { name: 'carrot cake', image: '🍰', type: 'product', category: 'bakery' },
  { name: 'cookies', image: '🍪', type: 'product', category: 'bakery' },
  { name: 'donuts', image: '🍩', type: 'product', category: 'bakery' },
  
  // Beverages
  { name: 'apple juice', image: '🧃', type: 'product', category: 'beverages' },
  { name: 'orange juice', image: '🧃', type: 'product', category: 'beverages' },
  { name: 'coffee', image: '☕', type: 'product', category: 'beverages' },
  { name: 'tea', image: '🍵', type: 'product', category: 'beverages' },
  { name: 'soda', image: '🥤', type: 'product', category: 'beverages' },
  { name: 'water', image: '💧', type: 'product', category: 'beverages' },
  { name: 'energy drink', image: '🥤', type: 'product', category: 'beverages' },
  
  // Snacks
  { name: 'chips', image: '🥔', type: 'product', category: 'snacks' },
  { name: 'avocado oil chips', image: '🥑', type: 'product', category: 'snacks' },
  { name: 'popcorn', image: '🍿', type: 'product', category: 'snacks' },
  { name: 'drizzilicious', image: '🍿', type: 'product', category: 'snacks' },
  { name: 'pretzels', image: '🥨', type: 'product', category: 'snacks' },
  { name: 'crackers', image: '🍘', type: 'product', category: 'snacks' },
  { name: 'nuts', image: '🥜', type: 'product', category: 'snacks' },
  { name: 'trail mix', image: '🥜', type: 'product', category: 'snacks' },
  
  // Pantry
  { name: 'pasta', image: '🍝', type: 'product', category: 'pantry' },
  { name: 'rice', image: '🍚', type: 'product', category: 'pantry' },
  { name: 'beans', image: '🫘', type: 'product', category: 'pantry' },
  { name: 'cereal', image: '🥣', type: 'product', category: 'pantry' },
  { name: 'oatmeal', image: '🥣', type: 'product', category: 'pantry' },
  { name: 'flour', image: '🌾', type: 'product', category: 'pantry' },
  { name: 'sugar', image: '🍬', type: 'product', category: 'pantry' },
  { name: 'salt', image: '🧂', type: 'product', category: 'pantry' },
  { name: 'olive oil', image: '🫒', type: 'product', category: 'pantry' },
  { name: 'avocado oil', image: '🫒', type: 'product', category: 'pantry' },
  { name: 'avocado oil spray', image: '🫒', type: 'product', category: 'pantry' },
  { name: 'peanut butter', image: '🥜', type: 'product', category: 'pantry' },
  { name: 'jam', image: '🍓', type: 'product', category: 'pantry' },
  { name: 'honey', image: '🍯', type: 'product', category: 'pantry' },
  { name: 'maple syrup', image: '🍁', type: 'product', category: 'pantry' },
  { name: 'tortillas', image: '🌮', type: 'product', category: 'pantry' },
  { name: 'carb balance tortillas', image: '🌮', type: 'product', category: 'pantry' },
  
  // Frozen
  { name: 'ice cream', image: '🍦', type: 'product', category: 'frozen' },
  { name: 'frozen pizza', image: '🍕', type: 'product', category: 'frozen' },
  { name: 'frozen vegetables', image: '🥦', type: 'product', category: 'frozen' },
  { name: 'frozen fruit', image: '🍓', type: 'product', category: 'frozen' },
  
  // Personal Care
  { name: 'shampoo', image: '🧴', type: 'product', category: 'personal care' },
  { name: 'conditioner', image: '🧴', type: 'product', category: 'personal care' },
  { name: 'body wash', image: '🧴', type: 'product', category: 'personal care' },
  { name: 'aveeno body wash', image: '🧴', type: 'product', category: 'personal care' },
  { name: 'hand soap', image: '🧼', type: 'product', category: 'personal care' },
  { name: 'toothpaste', image: '🦷', type: 'product', category: 'personal care' },
  { name: 'deodorant', image: '🧴', type: 'product', category: 'personal care' },
  { name: 'lotion', image: '🧴', type: 'product', category: 'personal care' },
  { name: 'aveeno lotion', image: '🧴', type: 'product', category: 'personal care' },
  { name: 'sunscreen', image: '🧴', type: 'product', category: 'personal care' },
  
  // Household
  { name: 'toilet paper', image: '🧻', type: 'product', category: 'household' },
  { name: 'paper towels', image: '🧻', type: 'product', category: 'household' },
  { name: 'tissues', image: '🧻', type: 'product', category: 'household' },
  { name: 'trash bags', image: '🗑️', type: 'product', category: 'household' },
  { name: 'dish soap', image: '🧼', type: 'product', category: 'household' },
  { name: 'laundry detergent', image: '🧺', type: 'product', category: 'household' },
  { name: 'cleaning spray', image: '🧹', type: 'product', category: 'household' },
  { name: 'room spray', image: '💨', type: 'product', category: 'household' },
  { name: 'carpet cleaner', image: '🧹', type: 'product', category: 'household' },
  { name: 'sponges', image: '🧽', type: 'product', category: 'household' },
  { name: 'aluminum foil', image: '📄', type: 'product', category: 'household' },
  { name: 'plastic wrap', image: '📄', type: 'product', category: 'household' },
  { name: 'ziplock bags', image: '📦', type: 'product', category: 'household' },
  { name: 'moving boxes', image: '📦', type: 'product', category: 'household' },
  { name: 'lighter', image: '🔥', type: 'product', category: 'household' },
  { name: 'candles', image: '🕯️', type: 'product', category: 'household' },
  { name: 'batteries', image: '🔋', type: 'product', category: 'household' },
  { name: 'aa batteries', image: '🔋', type: 'product', category: 'household' },
  
  // Baby & Kids
  { name: 'diapers', image: '🍼', type: 'product', category: 'baby' },
  { name: 'baby wipes', image: '🧻', type: 'product', category: 'baby' },
  { name: 'baby food', image: '🍼', type: 'product', category: 'baby' },
  { name: 'formula', image: '🍼', type: 'product', category: 'baby' },
  
  // Pets
  { name: 'dog food', image: '🐕', type: 'product', category: 'pets' },
  { name: 'cat food', image: '🐈', type: 'product', category: 'pets' },
  { name: 'dog treats', image: '🦴', type: 'product', category: 'pets' },
  { name: 'cat treats', image: '🐈', type: 'product', category: 'pets' },
  { name: 'pet toys', image: '🎾', type: 'product', category: 'pets' },
  
  // Floral & Gifts
  { name: 'flowers', image: '🌹', type: 'product', category: 'floral' },
  { name: 'roses', image: '🌹', type: 'product', category: 'floral' },
  { name: 'mums', image: '🌼', type: 'product', category: 'floral' },
  { name: 'bouquet', image: '💐', type: 'product', category: 'floral' },
  
  // Health
  { name: 'vitamins', image: '💊', type: 'product', category: 'health' },
  { name: 'medicine', image: '💊', type: 'product', category: 'health' },
  { name: 'bandages', image: '🩹', type: 'product', category: 'health' },
  { name: 'covid test', image: '🧪', type: 'product', category: 'health' },
  { name: 'thermometer', image: '🌡️', type: 'product', category: 'health' },
  
  // Alcohol
  { name: 'beer', image: '🍺', type: 'product', category: 'alcohol' },
  { name: 'wine', image: '🍷', type: 'product', category: 'alcohol' },
  { name: 'vodka', image: '🍸', type: 'product', category: 'alcohol' },
  { name: 'tequila', image: '🍹', type: 'product', category: 'alcohol' },
  { name: 'whiskey', image: '🥃', type: 'product', category: 'alcohol' },
  { name: 'rum', image: '🍹', type: 'product', category: 'alcohol' },
];

// Search function
export function searchItems(query: string): SearchItem[] {
  if (!query.trim()) return [];
  
  const lowerQuery = query.toLowerCase();
  const allItems = [...stores, ...allProducts];
  
  // Filter items that match the query
  const matches = allItems.filter(item => 
    item.name.toLowerCase().includes(lowerQuery)
  );
  
  // Sort: stores first, then products, then by relevance (starts with query)
  return matches.sort((a, b) => {
    // Stores come first
    if (a.type === 'store' && b.type !== 'store') return -1;
    if (a.type !== 'store' && b.type === 'store') return 1;
    
    // Then sort by whether name starts with query
    const aStarts = a.name.toLowerCase().startsWith(lowerQuery);
    const bStarts = b.name.toLowerCase().startsWith(lowerQuery);
    if (aStarts && !bStarts) return -1;
    if (!aStarts && bStarts) return 1;
    
    // Finally alphabetically
    return a.name.localeCompare(b.name);
  });
}
