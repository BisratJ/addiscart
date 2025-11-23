#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting deployment of Instacart Clone...${NC}"

# Skip MongoDB check for now
echo -e "${YELLOW}Skipping MongoDB check...${NC}"
echo -e "${YELLOW}Note: You'll need MongoDB running for the backend to work properly.${NC}"
echo -e "${YELLOW}We'll use a mock database for now.${NC}"

# Fix TypeScript issues
echo -e "${YELLOW}Fixing TypeScript issues...${NC}"
./fix-typescript.sh

# Fix backend issues
echo -e "${YELLOW}Fixing backend issues...${NC}"
./fix-backend.sh

# Install dependencies
echo -e "${YELLOW}Installing dependencies...${NC}"
npm run install:all

# Start the application in development mode
echo -e "${GREEN}Starting the application in development mode...${NC}"
echo -e "Backend will be available at: ${GREEN}http://localhost:5000${NC}"
echo -e "Frontend will be available at: ${GREEN}http://localhost:3000${NC}"
echo -e "${YELLOW}Press Ctrl+C to stop the application.${NC}"
npm run dev
