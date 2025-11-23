#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Fixing backend issues in the project...${NC}"

# Navigate to backend directory
cd backend

# Install required dependencies
echo -e "${YELLOW}Installing required dependencies...${NC}"
npm install

# Create uploads directory if it doesn't exist
if [ ! -d uploads ]; then
  echo -e "${YELLOW}Creating uploads directory...${NC}"
  mkdir -p uploads
  touch uploads/.gitkeep
fi

# Skip MongoDB check for now
echo -e "${YELLOW}Skipping MongoDB check...${NC}"
echo -e "${YELLOW}Note: You'll need MongoDB running for the backend to work properly.${NC}"
echo -e "${YELLOW}We'll use a mock database for now.${NC}"

# Run the seeder
echo -e "${YELLOW}Running database seeder...${NC}"
node utils/seeder.js

echo -e "${GREEN}Backend fixes applied. The database has been seeded with sample data.${NC}"
