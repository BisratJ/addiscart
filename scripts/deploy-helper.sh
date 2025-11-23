#!/bin/bash

# 🚀 Addiscart Deployment Helper Script
# This script guides you through deploying your app to Vercel and Railway

set -e

echo "🚀 Addiscart Deployment Helper"
echo "================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_green() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_blue() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_yellow() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_red() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if required tools are installed
echo "Checking prerequisites..."
echo ""

if ! command -v vercel &> /dev/null; then
    print_red "Vercel CLI not found"
    echo "Install with: npm install -g vercel"
    exit 1
fi
print_green "Vercel CLI installed"

if ! command -v node &> /dev/null; then
    print_red "Node.js not found"
    exit 1
fi
print_green "Node.js installed"

echo ""
echo "================================"
echo "📋 Deployment Steps"
echo "================================"
echo ""

# Step 1: MongoDB Atlas
echo "Step 1: MongoDB Atlas Setup"
echo "----------------------------"
print_blue "Have you created a MongoDB Atlas cluster?"
read -p "Enter MongoDB connection string (or 'skip' to do later): " MONGODB_URI

if [ "$MONGODB_URI" != "skip" ]; then
    print_green "MongoDB URI saved"
    echo "MONGODB_URI=$MONGODB_URI" > .deployment-config
else
    print_yellow "Remember to set up MongoDB Atlas later"
fi

echo ""

# Step 2: Generate Secrets
echo "Step 2: Generate Secrets"
echo "------------------------"
print_blue "Generating secure secrets..."

JWT_SECRET=$(openssl rand -hex 32)
NEXTAUTH_SECRET=$(openssl rand -base64 32)

print_green "JWT_SECRET: $JWT_SECRET"
print_green "NEXTAUTH_SECRET: $NEXTAUTH_SECRET"

echo ""
echo "💾 Save these secrets securely!"
echo ""

# Step 3: Google OAuth
echo "Step 3: Google OAuth Configuration"
echo "-----------------------------------"
print_blue "Enter your Google OAuth credentials"
read -p "Google Client ID: " GOOGLE_CLIENT_ID
read -p "Google Client Secret: " GOOGLE_CLIENT_SECRET

echo ""

# Step 4: Stripe Configuration
echo "Step 4: Stripe Configuration"
echo "-----------------------------"
print_blue "Enter your Stripe API keys"
read -p "Stripe Publishable Key (pk_test_...): " STRIPE_PUBLIC_KEY
read -p "Stripe Secret Key (sk_test_...): " STRIPE_SECRET_KEY

echo ""

# Step 5: Railway Deployment
echo "Step 5: Backend Deployment (Railway)"
echo "-------------------------------------"
print_yellow "Deploy your backend to Railway first"
print_blue "Instructions:"
echo "1. Go to https://railway.app"
echo "2. Create new project from GitHub"
echo "3. Select the 'backend' folder"
echo "4. Add environment variables:"
echo "   - NODE_ENV=production"
echo "   - PORT=5001"
echo "   - MONGODB_URI=$MONGODB_URI"
echo "   - JWT_SECRET=$JWT_SECRET"
echo "   - STRIPE_SECRET_KEY=$STRIPE_SECRET_KEY"
echo "   - FRONTEND_URL=(will update after Vercel deployment)"
echo "5. Deploy and generate domain"
echo ""
read -p "Enter your Railway backend URL (https://...railway.app): " RAILWAY_URL

if [ -z "$RAILWAY_URL" ]; then
    print_yellow "Skipping Railway URL for now"
    RAILWAY_URL="https://your-backend.up.railway.app"
else
    print_green "Railway URL: $RAILWAY_URL"
fi

echo ""

# Step 6: Vercel Deployment
echo "Step 6: Frontend Deployment (Vercel)"
echo "-------------------------------------"
print_blue "Preparing Vercel deployment..."

cd frontend

# Create .env for Vercel
cat > .env.production.local << EOF
NEXT_PUBLIC_API_URL=${RAILWAY_URL}/api
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=${STRIPE_PUBLIC_KEY}
STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}
EOF

print_green "Environment variables prepared"
echo ""

print_yellow "Deploying to Vercel..."
print_blue "You'll need to:"
echo "1. Confirm project settings"
echo "2. Set environment variables in Vercel dashboard"
echo "3. Add production environment variables"
echo ""

read -p "Ready to deploy to Vercel? (y/n): " DEPLOY_NOW

if [ "$DEPLOY_NOW" = "y" ] || [ "$DEPLOY_NOW" = "Y" ]; then
    print_blue "Starting Vercel deployment..."
    vercel --prod
    
    print_green "Deployment initiated!"
    echo ""
    print_yellow "Next Steps:"
    echo "1. Get your Vercel URL from the deployment output"
    echo "2. Update Railway FRONTEND_URL with your Vercel URL"
    echo "3. Update Google OAuth redirect URIs with your Vercel URL"
    echo "4. Update NEXTAUTH_URL in Vercel environment variables"
else
    print_yellow "Skipping deployment. Run 'vercel --prod' when ready"
fi

cd ..

echo ""
echo "================================"
echo "📝 Deployment Summary"
echo "================================"
echo ""
echo "Generated Secrets:"
echo "- JWT_SECRET: $JWT_SECRET"
echo "- NEXTAUTH_SECRET: $NEXTAUTH_SECRET"
echo ""
echo "Configuration:"
echo "- MongoDB URI: ${MONGODB_URI:-'Not set'}"
echo "- Railway URL: $RAILWAY_URL"
echo "- Google Client ID: $GOOGLE_CLIENT_ID"
echo ""
echo "📋 TODO List:"
echo "1. ⬜ Deploy backend to Railway"
echo "2. ⬜ Update FRONTEND_URL in Railway"
echo "3. ⬜ Deploy frontend to Vercel"
echo "4. ⬜ Set environment variables in Vercel"
echo "5. ⬜ Update Google OAuth redirect URIs"
echo "6. ⬜ Test deployment"
echo ""
print_green "Setup complete! Follow the TODO list above."
echo ""
print_blue "For detailed instructions, see:"
echo "- QUICK_DEPLOY.md"
echo "- VERCEL_DEPLOYMENT_GUIDE.md"
echo ""
