# 🚀 Complete Vercel Deployment Guide

## ✅ Build Issues Fixed

The following issues have been resolved:

- ✅ TypeScript downlevelIteration error fixed
- ✅ Experimental optimizeCss feature removed (was causing critters module error)
- ✅ Build now completes successfully

## 📋 Pre-Deployment Steps

### 1. Set Up MongoDB Atlas (Production Database)

1. **Create MongoDB Atlas Account**

   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up or log in

2. **Create a New Cluster**

   - Click "Build a Database"
   - Choose FREE tier (M0)
   - Select a region close to your users
   - Name your cluster (e.g., "addiscart-prod")

3. **Configure Network Access**

   - Go to "Network Access" in the sidebar
   - Click "Add IP Address"
   - Select "Allow Access from Anywhere" (0.0.0.0/0)
   - This is required for cloud deployments

4. **Create Database User**

   - Go to "Database Access"
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Create a username and strong password
   - Grant "Read and write to any database" role
   - **SAVE THESE CREDENTIALS SECURELY!**

5. **Get Connection String**
   - Go to "Database" → "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with your database name (e.g., "addiscart")
   - Example: `mongodb+srv://username:password@cluster.mongodb.net/addiscart?retryWrites=true&w=majority`

### 2. Deploy Backend to Railway

1. **Install Railway CLI**

   ```bash
   npm install -g @railway/cli
   ```

2. **Login to Railway**

   ```bash
   railway login
   ```

3. **Navigate to Backend Directory**

   ```bash
   cd backend
   ```

4. **Initialize Railway Project**

   ```bash
   railway init
   ```

5. **Set Environment Variables**

   ```bash
   railway variables set NODE_ENV=production
   railway variables set PORT=5001
   railway variables set MONGODB_URI="your-mongodb-atlas-connection-string"
   railway variables set JWT_SECRET="your-super-secret-jwt-key-min-32-chars"
   railway variables set STRIPE_SECRET_KEY="your-stripe-secret-key"
   ```

6. **Deploy Backend**

   ```bash
   railway up
   ```

7. **Get Backend URL**
   ```bash
   railway domain
   ```
   - This will give you your backend URL (e.g., `https://your-app.up.railway.app`)
   - **SAVE THIS URL!** You'll need it for frontend configuration

### 3. Update Google OAuth Credentials

1. **Go to Google Cloud Console**

   - Visit: https://console.cloud.google.com/apis/credentials

2. **Update OAuth 2.0 Client**
   - Click on your existing OAuth client
   - Add production URLs to "Authorized JavaScript origins":
     ```
     https://your-vercel-domain.vercel.app
     https://your-custom-domain.com (if applicable)
     ```
   - Add to "Authorized redirect URIs":
     ```
     https://your-vercel-domain.vercel.app/api/auth/callback/google
     https://your-custom-domain.com/api/auth/callback/google (if applicable)
     ```
   - Click "Save"

### 4. Deploy Frontend to Vercel

1. **Install Vercel CLI (if not installed)**

   ```bash
   npm install -g vercel
   ```

2. **Navigate to Frontend Directory**

   ```bash
   cd frontend
   ```

3. **Login to Vercel**

   ```bash
   vercel login
   ```

4. **Deploy to Vercel**

   ```bash
   vercel --prod
   ```

5. **Set Environment Variables in Vercel**

   Go to your Vercel dashboard → Project Settings → Environment Variables

   Add the following variables for **Production**:

   ```env
   # API Configuration
   NEXT_PUBLIC_API_URL=https://your-railway-backend-url.up.railway.app/api

   # NextAuth Configuration
   NEXTAUTH_URL=https://your-vercel-app.vercel.app
   NEXTAUTH_SECRET=<generate-new-secret-with-openssl-rand-base64-32>

   # Google OAuth
   GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-google-client-secret

   # Stripe
   NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_live_... (or pk_test_... for testing)
   STRIPE_SECRET_KEY=sk_live_... (or sk_test_... for testing)
   ```

6. **Redeploy After Setting Variables**
   ```bash
   vercel --prod
   ```

## 🔐 Environment Variables Checklist

### Frontend (Vercel)

- [ ] `NEXT_PUBLIC_API_URL` - Backend Railway URL + /api
- [ ] `NEXTAUTH_URL` - Your Vercel deployment URL
- [ ] `NEXTAUTH_SECRET` - Generated secret (32+ characters)
- [ ] `GOOGLE_CLIENT_ID` - From Google Cloud Console
- [ ] `GOOGLE_CLIENT_SECRET` - From Google Cloud Console
- [ ] `NEXT_PUBLIC_STRIPE_PUBLIC_KEY` - From Stripe Dashboard
- [ ] `STRIPE_SECRET_KEY` - From Stripe Dashboard

### Backend (Railway)

- [ ] `NODE_ENV=production`
- [ ] `PORT=5001`
- [ ] `MONGODB_URI` - MongoDB Atlas connection string
- [ ] `JWT_SECRET` - Strong secret key (32+ characters)
- [ ] `STRIPE_SECRET_KEY` - From Stripe Dashboard

## 🧪 Testing the Deployment

After deployment, test the following:

1. **Homepage Loads**

   - Visit your Vercel URL
   - Check that all images and content load properly

2. **Google Sign-In**

   - Go to `/auth/login`
   - Click "Continue with Google"
   - Complete the OAuth flow
   - Verify you're redirected back and logged in

3. **Database Connection**

   - After signing in, check that user data is saved
   - Browse products (they should load from database)

4. **API Connectivity**

   - Open browser DevTools → Network tab
   - Navigate through the app
   - Verify API calls to Railway backend are successful (200 status)

5. **Stripe Integration** (if configured)
   - Add items to cart
   - Proceed to checkout
   - Test payment flow

## 🐛 Troubleshooting

### Build Failing on Vercel

- Check build logs in Vercel dashboard
- Ensure all environment variables are set
- Verify `output: 'standalone'` is in next.config.js

### API Calls Failing (CORS)

- Verify `NEXT_PUBLIC_API_URL` is correct in Vercel
- Check Railway logs for backend errors
- Ensure CORS is configured in backend to allow Vercel domain

### Google Sign-In Not Working

- Verify redirect URIs in Google Console match exactly
- Check `NEXTAUTH_URL` matches your Vercel domain
- Ensure `NEXTAUTH_SECRET` is set in Vercel
- Check browser console for errors

### Database Connection Failed

- Verify MongoDB Atlas IP whitelist includes 0.0.0.0/0
- Check database user credentials are correct
- Test connection string format
- Check Railway logs for connection errors

### Images Not Loading

- Verify image domains are in `next.config.js` under `images.remotePatterns`
- Check if using absolute URLs for external images

## 🎯 Quick Commands Reference

### Generate Secrets

```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Generate JWT_SECRET
openssl rand -hex 32
```

### Vercel Commands

```bash
# Deploy to production
vercel --prod

# Check deployment status
vercel ls

# View logs
vercel logs

# Set environment variable
vercel env add VARIABLE_NAME
```

### Railway Commands

```bash
# View logs
railway logs

# Check status
railway status

# Set variable
railway variables set KEY=value

# Open in browser
railway open
```

## 📱 Custom Domain Setup (Optional)

### On Vercel

1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed
4. Update `NEXTAUTH_URL` to your custom domain
5. Update Google OAuth redirect URIs

### On Railway

1. Go to your project settings
2. Click "Generate Domain" or add custom domain
3. Configure DNS if using custom domain

## ✅ Post-Deployment Checklist

- [ ] Frontend deploys successfully on Vercel
- [ ] Backend deploys successfully on Railway
- [ ] MongoDB Atlas cluster is created and accessible
- [ ] All environment variables are set correctly
- [ ] Google OAuth credentials updated with production URLs
- [ ] Google Sign-In works in production
- [ ] API calls connect to Railway backend
- [ ] Database operations work (create user, fetch products)
- [ ] No CORS errors in browser console
- [ ] SSL certificates are active (HTTPS)
- [ ] Test user can register and login
- [ ] Products display correctly
- [ ] Cart functionality works
- [ ] Images load properly

## 🎉 Success!

Your app is now fully deployed and functional!

- **Frontend**: https://your-app.vercel.app
- **Backend**: https://your-app.up.railway.app
- **Database**: MongoDB Atlas

## 📊 Monitoring

### Vercel

- Analytics: Project → Analytics
- Logs: Project → Deployments → View Function Logs

### Railway

- Metrics: Project → Metrics
- Logs: `railway logs`

### MongoDB Atlas

- Monitoring: Cluster → Metrics
- Database Access: Database Access tab

## 🔄 Making Updates

### Update Frontend

```bash
cd frontend
# Make your changes
git add .
git commit -m "Update frontend"
git push
# Vercel will auto-deploy if connected to git, or:
vercel --prod
```

### Update Backend

```bash
cd backend
# Make your changes
railway up
```

## 📞 Need Help?

If you encounter issues:

1. Check the troubleshooting section above
2. Review deployment logs (Vercel/Railway dashboards)
3. Check browser console for frontend errors
4. Review Railway logs for backend errors
5. Verify all environment variables are set correctly

---

**Deployment completed! Your Addiscart app is live! 🎉**
