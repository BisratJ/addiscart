# Troubleshooting Guide

This document provides solutions to common issues you might encounter when setting up and running the Instacart Clone project.

## TypeScript Errors

If you're seeing TypeScript errors in the frontend, run the following script:

```bash
./fix-typescript.sh
```

This script will:
1. Install all necessary TypeScript type definitions
2. Install required dependencies for the frontend
3. Create necessary configuration files
4. Run a TypeScript check to identify any remaining issues

## Backend Issues

If you're having issues with the backend, run:

```bash
./fix-backend.sh
```

This script will:
1. Install all backend dependencies
2. Create the uploads directory if it doesn't exist
3. Check if MongoDB is running
4. Seed the database with sample data

## Common Issues and Solutions

### MongoDB Not Running

Error: `MongoDB is not running. Please start MongoDB first.`

Solution:
```bash
brew services start mongodb-community
```

### Missing Dependencies

If you see errors about missing modules or dependencies, run:

```bash
npm run install:all
```

### Path Resolution Issues

If you see errors about modules not being found, check that:

1. The tsconfig.json file has proper path mappings
2. You're using the correct import paths (e.g., `@/app/components/...`)

### Environment Variables

Make sure both `.env` (backend) and `.env.local` (frontend) files exist with the proper configuration:

Backend (.env):
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/instacart-clone
JWT_SECRET=your_jwt_secret_key_here
STRIPE_SECRET_KEY=your_stripe_secret_key_here
NODE_ENV=development
```

Frontend (.env.local):
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=your_stripe_public_key_here
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000
```

## Complete Reset

If you want to completely reset the project:

1. Stop any running servers
2. Delete the node_modules folders:
   ```bash
   rm -rf node_modules
   rm -rf frontend/node_modules
   rm -rf backend/node_modules
   ```
3. Delete any generated files:
   ```bash
   rm -rf frontend/.next
   ```
4. Reset the database:
   ```bash
   mongo
   > use instacart-clone
   > db.dropDatabase()
   > exit
   ```
5. Run the deployment script:
   ```bash
   ./deploy.sh
   ```

## Still Having Issues?

If you're still experiencing problems after trying these solutions, check:

1. Node.js version (should be v18 or later)
2. MongoDB version and connection
3. Console logs for specific error messages
4. Browser developer tools for frontend errors
