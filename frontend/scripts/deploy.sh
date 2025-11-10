#!/bin/bash

# Deployment script for Addiscart
# Usage: ./scripts/deploy.sh [environment]

set -e

ENVIRONMENT=${1:-production}
BOLD='\033[1m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BOLD}🚀 Deploying Addiscart to ${ENVIRONMENT}${NC}\n"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${RED}❌ Vercel CLI not found. Installing...${NC}"
    npm install -g vercel
fi

# Pre-deployment checks
echo -e "${YELLOW}📋 Running pre-deployment checks...${NC}"

# Check for required environment variables
if [ ! -f .env.local ]; then
    echo -e "${RED}❌ .env.local file not found${NC}"
    exit 1
fi

# Run linting
echo -e "${YELLOW}🔍 Running linter...${NC}"
npm run lint || echo -e "${YELLOW}⚠️  Linting warnings found${NC}"

# Run type checking
echo -e "${YELLOW}🔍 Running type check...${NC}"
npm run build || {
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
}

echo -e "${GREEN}✅ Pre-deployment checks passed${NC}\n"

# Deploy based on environment
if [ "$ENVIRONMENT" = "production" ]; then
    echo -e "${YELLOW}🚀 Deploying to production...${NC}"
    vercel --prod
elif [ "$ENVIRONMENT" = "preview" ]; then
    echo -e "${YELLOW}🚀 Deploying preview...${NC}"
    vercel
else
    echo -e "${RED}❌ Invalid environment: $ENVIRONMENT${NC}"
    echo "Usage: ./scripts/deploy.sh [production|preview]"
    exit 1
fi

echo -e "\n${GREEN}✅ Deployment completed successfully!${NC}"
echo -e "${BOLD}🎉 Your app is live!${NC}"
