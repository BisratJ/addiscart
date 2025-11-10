# Category System Documentation

## Overview

The category system has been completely redesigned following best practices from major e-commerce platforms like Amazon, Instacart, and Walmart. It provides a modern, hierarchical, and user-friendly way to organize products.

## Features

### Backend Features

1. **Enhanced Category Model**
   - `slug`: URL-friendly identifier
   - `icon`: Emoji or icon for visual representation
   - `order`: Custom sorting order
   - `level`: Hierarchical depth (0 = top-level, 1 = subcategory, etc.)
   - `isFeatured`: Mark categories for homepage display
   - `metadata`: Additional data like color themes and keywords
   - `productCount`: Cached count for performance

2. **Comprehensive API Routes** (`/api/categories`)
   - `GET /api/categories` - List all categories with filtering
   - `GET /api/categories/:id` - Get single category with details
   - `GET /api/categories/slug/:slug/:storeId` - Get by slug
   - `GET /api/categories/hierarchy/:storeId` - Get full hierarchy
   - `POST /api/categories` - Create category (admin)
   - `PUT /api/categories/:id` - Update category (admin)
   - `DELETE /api/categories/:id` - Deactivate category (admin)
   - `PUT /api/categories/:id/reorder` - Update order (admin)

3. **Smart Indexing**
   - Text search on name and description
   - Compound indexes for efficient queries
   - Unique slug per store

### Frontend Features

1. **CategoryGrid Component**
   - Responsive grid layout
   - Configurable columns (2, 3, 4, or 6)
   - Featured categories filter
   - Loading states and error handling
   - Hover effects with gradient overlays

2. **CategoryNav Component**
   - Horizontal scrollable navigation
   - Perfect for store pages
   - Featured categories only
   - Icon-based design

3. **CategorySidebar Component**
   - Hierarchical navigation
   - Expandable/collapsible subcategories
   - Product count display
   - Active state highlighting
   - Sticky positioning

4. **Category Page**
   - Breadcrumb navigation
   - Category header with icon and description
   - Subcategory quick links
   - Product grid with filters
   - Integrated cart functionality

## Usage Examples

### Display Featured Categories on Homepage

```tsx
import CategoryGrid from '@/app/components/CategoryGrid';

<CategoryGrid featured={true} limit={12} columns={6} />
```

### Add Category Navigation to Store Page

```tsx
import CategoryNav from '@/app/components/CategoryNav';

<CategoryNav storeId={storeId} featured={true} />
```

### Add Category Sidebar

```tsx
import CategorySidebar from '@/app/components/CategorySidebar';

<CategorySidebar 
  storeId={storeId} 
  currentCategorySlug={categorySlug}
  className="sticky top-32"
/>
```

## Category Structure

### Top-Level Categories (15 total)

1. **Fresh Produce** 🥬 - Fruits and vegetables
2. **Meat & Seafood** 🥩 - Premium cuts and fresh seafood
3. **Dairy & Eggs** 🥛 - Milk, cheese, yogurt, eggs
4. **Bakery** 🍞 - Bread, pastries, desserts
5. **Pantry Staples** 🥫 - Pasta, rice, sauces, canned goods
6. **Snacks & Candy** 🍬 - Chips, cookies, candy
7. **Beverages** 🥤 - Drinks, juices, coffee, tea
8. **Frozen Foods** 🧊 - Frozen meals, vegetables, ice cream
9. **Household Essentials** 🧹 - Cleaning supplies
10. **Personal Care** 🧴 - Beauty, hygiene products
11. **Health & Wellness** 💊 - Vitamins, supplements
12. **Baby & Kids** 👶 - Baby food, diapers
13. **Pet Care** 🐾 - Pet food, treats, supplies
14. **Deli & Prepared Foods** 🥪 - Ready-to-eat meals
15. **Alcohol** 🍷 - Beer, wine, spirits

## API Query Parameters

### GET /api/categories

- `store` - Filter by store ID
- `parentCategory` - Filter by parent (use 'null' for top-level)
- `level` - Filter by hierarchy level (0, 1, 2)
- `featured` - Show only featured categories (true/false)
- `includeSubcategories` - Include subcategories in response (true/false)

### Example Queries

```javascript
// Get all top-level categories for a store
GET /api/categories?store=123&level=0

// Get featured categories
GET /api/categories?featured=true

// Get category hierarchy
GET /api/categories/hierarchy/123

// Get category by slug
GET /api/categories/slug/fresh-produce/123
```

## Database Schema

```javascript
{
  name: String,           // "Fresh Produce"
  slug: String,           // "fresh-produce"
  description: String,    // "Fresh fruits and vegetables..."
  icon: String,           // "🥬"
  image: String,          // URL to category image
  store: ObjectId,        // Reference to Store
  parentCategory: ObjectId, // Reference to parent Category
  level: Number,          // 0, 1, 2
  order: Number,          // For custom sorting
  productCount: Number,   // Cached count
  isActive: Boolean,      // Soft delete
  isFeatured: Boolean,    // Show on homepage
  metadata: {
    color: String,        // "from-green-100 to-emerald-100"
    keywords: [String]    // ["fruits", "vegetables", "organic"]
  }
}
```

## Best Practices

1. **Slug Generation**: Always use lowercase, hyphenated slugs
2. **Hierarchy**: Keep to 3 levels maximum (top, sub, sub-sub)
3. **Icons**: Use emojis for consistency and accessibility
4. **Colors**: Use Tailwind gradient classes for theming
5. **Product Count**: Update when products are added/removed
6. **Soft Delete**: Deactivate instead of deleting to preserve data integrity

## Performance Optimizations

1. **Indexes**: Compound indexes on frequently queried fields
2. **Caching**: Product counts are cached in category documents
3. **Lazy Loading**: Subcategories loaded on demand
4. **Pagination**: Products are paginated in category pages
5. **Virtual Fields**: Subcategories populated via virtuals

## Mobile Responsiveness

- Grid adapts from 2 columns (mobile) to 6 columns (desktop)
- Horizontal navigation is scrollable on mobile
- Sidebar hidden on mobile, accessible via menu
- Touch-friendly tap targets (minimum 44x44px)

## Accessibility

- Semantic HTML structure
- ARIA labels where needed
- Keyboard navigation support
- Screen reader friendly
- High contrast colors
- Focus indicators

## Future Enhancements

- [ ] Category search functionality
- [ ] Category analytics and insights
- [ ] Dynamic category recommendations
- [ ] Category-based promotions
- [ ] Multi-language support
- [ ] Category images/banners
- [ ] Advanced filtering options
- [ ] Category comparison tools
