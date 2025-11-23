# 🚀 Quick Deploy to Vercel - Step by Step

## ✅ Pre-Requisites Completed

- ✅ Build issues fixed (TypeScript, dependencies)
- ✅ Production configuration files created
- ✅ CORS properly configured for production

## 🎯 Deployment Steps (Follow in Order)

### Step 1: Set Up MongoDB Atlas (5 minutes)

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create FREE M0 cluster
3. Under "Network Access" → Add IP: `0.0.0.0/0` (allow all)
4. Under "Database Access" → Create user with username/password
5. Click "Connect" → "Connect your application" → Copy connection string
6. Replace `<password>` with your password
7. **Save this connection string!**

### Step 2: Deploy Backend to Railway (5 minutes)

1. **Go to https://railway.app/**
2. Sign in with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository → Choose `backend` folder
5. Set Environment Variables in Railway:
   - `NODE_ENV` = `production`
   - `PORT` = `5001`
   - `MONGODB_URI` = Your MongoDB Atlas connection string from Step 1
   - `JWT_SECRET` = Generate with: `openssl rand -hex 32`
   - `STRIPE_SECRET_KEY` = From https://dashboard.stripe.com/test/apikeys
   - `FRONTEND_URL` = `https://your-app.vercel.app` (update after Step 4)
6. Click "Deploy"
7. Once deployed, go to "Settings" → "Generate Domain"
8. **Copy your Railway URL** (e.g., `https://your-app.up.railway.app`)

### Step 3: Configure Google OAuth (3 minutes)

1. Go to https://console.cloud.google.com/apis/credentials
2. Select your project (or create new)
3. Click "Create Credentials" → "OAuth 2.0 Client ID"
4. Application type: "Web application"
5. Add Authorized redirect URIs:
   ```
   http://localhost:3001/api/auth/callback/google
   https://your-app.vercel.app/api/auth/callback/google
   ```
   (Add second one after Step 4)
6. **Save Client ID and Client Secret**

### Step 4: Deploy Frontend to Vercel (5 minutes)

**Option A: Via Vercel Dashboard (Recommended)**

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Set Root Directory to: `frontend`
4. Set Framework Preset: `Next.js`
5. Add Environment Variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-railway-url.up.railway.app/api
   NEXTAUTH_URL=https://your-vercel-app.vercel.app
   NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   ```
6. Click "Deploy"
7. Once deployed, copy your Vercel URL

**Option B: Via CLI**

```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to frontend
cd frontend

# Login
vercel login

# Deploy
vercel --prod

# Add environment variables via dashboard (see above)
# Then redeploy
vercel --prod
```

### Step 5: Update URLs (2 minutes)

1. **Update Railway Backend:**

   - Go to Railway dashboard
   - Add/update `FRONTEND_URL` = Your actual Vercel URL

2. **Update Google OAuth:**

   - Go to Google Cloud Console
   - Add your Vercel URL to authorized origins and redirect URIs

3. **Redeploy if needed:**
   - Railway: Changes auto-redeploy
   - Vercel: Push to git or run `vercel --prod`

## 🧪 Test Your Deployment

Visit your Vercel URL and test:

- [ ] Homepage loads ✅
- [ ] Can view stores and products ✅
- [ ] Google Sign-In works ✅
- [ ] Can add items to cart ✅
- [ ] Can checkout (if Stripe configured) ✅

## 🐛 Common Issues & Solutions

### Issue: "CORS error"

**Solution:** Update `FRONTEND_URL` in Railway to match your Vercel URL exactly

### Issue: "Google Sign-In fails"

**Solution:**

- Check Google Console redirect URIs match exactly
- Verify `NEXTAUTH_URL` in Vercel
- Must be HTTPS in production

### Issue: "API calls fail"

**Solution:**

- Verify `NEXT_PUBLIC_API_URL` in Vercel
- Check Railway deployment logs
- Ensure Railway app is running

### Issue: "Database connection failed"

**Solution:**

- Check MongoDB Atlas IP whitelist (0.0.0.0/0)
- Verify connection string format
- Check username/password in connection string

## 📋 Environment Variables Summary

### Railway Backend

```env
NODE_ENV=production
PORT=5001
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/addiscart
JWT_SECRET=<32+ char secret>
STRIPE_SECRET_KEY=sk_test_...
FRONTEND_URL=https://your-app.vercel.app
```

### Vercel Frontend

```env
NEXT_PUBLIC_API_URL=https://your-railway.up.railway.app/api
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=<32+ char secret>
GOOGLE_CLIENT_ID=...apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-...
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

## ✅ Deployment Complete!

Your app is now live at:

- **Frontend:** https://your-app.vercel.app
- **Backend:** https://your-railway.up.railway.app

## 🔄 Making Updates

**Frontend:**

- Push to GitHub → Vercel auto-deploys
- Or run: `vercel --prod`

**Backend:**

- Push to GitHub → Railway auto-deploys
- Or use Railway CLI

## 📊 Monitor Your App

- **Vercel:** https://vercel.com/dashboard
- **Railway:** https://railway.app/dashboard
- **MongoDB:** https://cloud.mongodb.com/

---

**Total Time: ~20 minutes**
**Status: ✅ Ready for Production**
