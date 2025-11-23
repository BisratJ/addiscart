# Category System Setup Guide

## Quick Start

The category system is now fully functional and ready to use. Follow these steps to get started:

## 1. Backend Setup

The backend is already configured. The category routes are registered in `server.js`:

```javascript
app.use('/api/categories', categoryRoutes);
```

## 2. Seed the Database

Run the seeder to populate categories for all stores:

```bash
cd backend
node utils/seeder.js
```

This will create 15 professional categories for each store with:
- Icons (emojis)
- Descriptions
- Color themes
- Keywords for search
- Proper ordering

## 3. Test the API

Test the category endpoints:

```bash
# Get all categories
curl http://localhost:5001/api/categories

# Get categories for a specific store
curl http://localhost:5001/api/categories?store=STORE_ID

# Get featured categories
curl http://localhost:5001/api/categories?featured=true

# Get category hierarchy
curl http://localhost:5001/api/categories/hierarchy/STORE_ID
```

## 4. Frontend Integration

The frontend components are ready to use:

### On Store Pages

The store detail page (`/stores/[storeId]`) now includes:
- **CategoryNav**: Horizontal scrollable category navigation
- **CategorySidebar**: Hierarchical sidebar with expandable subcategories

### Category Pages

Visit: `/stores/[storeId]/categories/[categorySlug]`

Features:
- Breadcrumb navigation
- Category header with icon
- Subcategory links
- Product grid
- Integrated cart

### Homepage

The homepage displays static categories (can be replaced with dynamic CategoryGrid component).

## 5. Environment Variables

Make sure your `.env` file has:

```env
# Backend
MONGODB_URI=mongodb://localhost:27017/instacart-clone
PORT=5001

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:5001
```

## 6. Start the Application

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 7. Verify Everything Works

1. **Visit Homepage**: http://localhost:3000
   - Should see category grid

2. **Visit Store Page**: http://localhost:3000/stores/1
   - Should see category navigation at top
   - Should see category sidebar on left

3. **Click a Category**: Navigate to a category page
   - Should see breadcrumbs
   - Should see products in that category
   - Should be able to add to cart

4. **Test API**: http://localhost:5001/api/categories
   - Should return JSON array of categories

## Component Usage Examples

### CategoryGrid
```tsx
import CategoryGrid from '@/app/components/CategoryGrid';

// Featured categories only
<CategoryGrid featured={true} limit={12} columns={6} />

// All categories for a store
<CategoryGrid storeId="123" columns={4} />
```

### CategoryNav
```tsx
import CategoryNav from '@/app/components/CategoryNav';

// Horizontal navigation
<CategoryNav storeId="123" featured={true} />
```

### CategorySidebar
```tsx
import CategorySidebar from '@/app/components/CategorySidebar';

// Sidebar with current category highlighted
<CategorySidebar 
  storeId="123" 
  currentCategorySlug="fresh-produce"
  className="sticky top-32"
/>
```

## Troubleshooting

### Categories not showing?
- Check if backend is running on port 5001
- Verify MongoDB is running
- Run the seeder script
- Check browser console for errors

### API errors?
- Verify NEXT_PUBLIC_API_URL in frontend .env
- Check CORS settings in backend
- Ensure MongoDB connection is successful

### Styling issues?
- Make sure Tailwind CSS is configured
- Check if all dependencies are installed
- Clear Next.js cache: `rm -rf .next`

## Key Features

✅ **15 Professional Categories** - Following major e-commerce standards
✅ **Hierarchical Structure** - Support for subcategories
✅ **Icon-Based Design** - Emoji icons for visual appeal
✅ **Responsive Layout** - Mobile-first design
✅ **Smart Filtering** - Filter by store, featured, level
✅ **SEO-Friendly** - Slug-based URLs
✅ **Performance Optimized** - Indexed queries, cached counts
✅ **User-Friendly** - Breadcrumbs, hover effects, smooth transitions

## Next Steps

1. **Add Products**: Assign products to categories
2. **Create Subcategories**: Add second-level categories if needed
3. **Customize Colors**: Update metadata.color for each category
4. **Add Images**: Upload category banner images
5. **Enable Search**: Implement category search functionality
6. **Analytics**: Track category performance

## Support

For issues or questions, refer to:
- `CATEGORY_SYSTEM.md` - Full documentation
- Backend routes: `backend/routes/categories.js`
- Frontend components: `frontend/app/components/Category*.tsx`
