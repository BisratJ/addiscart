#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Fixing TypeScript issues in the project...${NC}"

# Navigate to frontend directory
cd frontend

# Install required dependencies
echo -e "${YELLOW}Installing required dependencies...${NC}"
npm install --save-dev @types/node @types/react @types/react-dom typescript
npm install react react-dom next axios lucide-react @tanstack/react-query
npm install clsx tailwind-merge class-variance-authority @radix-ui/react-toast

# Create a next.config.js file if it doesn't exist
if [ ! -f next.config.js ]; then
  echo -e "${YELLOW}Creating next.config.js...${NC}"
  cat > next.config.js << 'EOL'
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'via.placeholder.com', 'images.unsplash.com'],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_STRIPE_PUBLIC_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY,
  },
};

module.exports = nextConfig;
EOL
fi

# Create a .env.local file if it doesn't exist
if [ ! -f .env.local ]; then
  echo -e "${YELLOW}Creating .env.local...${NC}"
  cat > .env.local << 'EOL'
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=your_stripe_public_key_here
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000
EOL
fi

# Run TypeScript check
echo -e "${YELLOW}Running TypeScript check...${NC}"
npx tsc --noEmit

echo -e "${GREEN}TypeScript fixes applied. Please check for any remaining errors.${NC}"
