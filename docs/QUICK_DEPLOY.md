# Quick Deployment Guide

**Last Updated**: November 23, 2025

This guide provides the fastest path to deploy your Addiscart application.

---

## 🚀 Quick Start (5 Minutes)

### Prerequisites

- GitHub account
- Vercel account (free)
- Railway account (free)
- MongoDB Atlas account (free)

---

## Step 1: Database Setup (MongoDB Atlas)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free M0 cluster named `addiscart-cluster`
3. **Database Access**: Create user `addiscart-user` with password
4. **Network Access**: Add `0.0.0.0/0` (allow from anywhere)
5. **Get connection string**:
   ```
   mongodb+srv://addiscart-user:YOUR_PASSWORD@addiscart-cluster.xxxxx.mongodb.net/addiscart?retryWrites=true&w=majority
   ```

---

## Step 2: Backend Deployment (Railway)

1. Go to [Railway](https://railway.app)
2. **New Project** → **Deploy from GitHub** → Select `addiscart` repo
3. **Add Environment Variables**:
   ```
   NODE_ENV=production
   PORT=5001
   MONGODB_URI=mongodb+srv://addiscart-user:PASSWORD@addiscart-cluster.xxxxx.mongodb.net/addiscart?retryWrites=true&w=majority
   JWT_SECRET=<run: openssl rand -hex 32>
   STRIPE_SECRET_KEY=your_stripe_secret_key
   FRONTEND_URL=https://your-app.vercel.app
   ```
4. **Generate Domain** in Settings → Copy your Railway URL
5. Example: `https://addiscart-production.up.railway.app`

---

## Step 3: Frontend Deployment (Vercel)

1. Go to [Vercel](https://vercel.com/new)
2. **Import Git Repository** → Select `addiscart`
3. **Configure**:
   - Framework: Next.js (auto-detected)
   - Root Directory: `frontend`
4. **Environment Variables**:
   ```
   NEXT_PUBLIC_API_URL=https://your-railway-url.up.railway.app/api
   NEXTAUTH_URL=https://your-app.vercel.app
   NEXTAUTH_SECRET=<same as JWT_SECRET or generate new>
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   NEXT_PUBLIC_STRIPE_PUBLIC_KEY=your_stripe_public_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   ```
5. **Deploy** → Copy your Vercel URL

---

## Step 4: Update Configuration

### Update Railway FRONTEND_URL

1. Go back to Railway
2. Variables → Update `FRONTEND_URL` with your Vercel URL
3. Redeploy

### Update Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Select your OAuth 2.0 Client
3. **Authorized JavaScript origins**:
   ```
   https://your-app.vercel.app
   ```
4. **Authorized redirect URIs**:
   ```
   https://your-app.vercel.app/api/auth/callback/google
   http://localhost:3001/api/auth/callback/google
   ```
5. Save

---

## ✅ Verification Checklist

- [ ] MongoDB Atlas cluster running
- [ ] Railway backend deployed and responding
- [ ] Vercel frontend deployed and loading
- [ ] Google OAuth configured
- [ ] Can browse stores
- [ ] Can add items to cart
- [ ] Can login with Google
- [ ] Stripe payment test works

---

## 🧪 Test Your Deployment

### Backend Health Check

```bash
curl https://your-railway-url.up.railway.app
# Should return: {"message":"Welcome to Instacart Clone API"}
```

### Frontend Check

Visit: `https://your-app.vercel.app`

- Should load homepage
- Browse stores
- Add to cart
- Test login

---

## 🔧 Troubleshooting

### Backend Not Responding

- Check Railway logs for errors
- Verify MongoDB connection string
- Check environment variables

### Frontend Build Fails

- Verify all environment variables set
- Check Vercel build logs
- Ensure `NEXT_PUBLIC_API_URL` is correct

### Google OAuth Not Working

- Verify redirect URIs in Google Console
- Check `NEXTAUTH_URL` matches your domain
- Ensure `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set

---

## 📚 Additional Resources

- [Full Deployment Guide](./DEPLOYMENT_GUIDE.md)
- [Troubleshooting Guide](./TROUBLESHOOTING.md)
- [Security Guide](./SECURITY.md)

---

## 🎯 Production Checklist

Once deployed, ensure:

- [ ] SSL/TLS enabled (automatic on Vercel/Railway)
- [ ] Environment variables secured
- [ ] Database backups enabled
- [ ] Monitoring setup (optional but recommended)
- [ ] Error tracking configured (optional)

---

## 🚀 You're Live!

Your application is now deployed and accessible:

- **Frontend**: https://your-app.vercel.app
- **Backend**: https://your-railway-url.up.railway.app

---

**Next Steps**: See [OPTIMIZATION_REPORT.md](../OPTIMIZATION_REPORT.md) for performance tuning and advanced configuration.
