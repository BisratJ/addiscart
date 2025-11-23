# Troubleshooting Guide

Common issues and their solutions for the Addiscart application.

---

## 🔧 Backend Issues

### Issue: Backend Not Starting

**Symptoms**: Server won't start, crashes immediately

**Solutions**:

```bash
# Check MongoDB connection
# Ensure MongoDB is running locally or connection string is valid

# Verify environment variables
cd backend
cat .env

# Check for syntax errors
npm run dev

# Verify dependencies
npm install
```

**Common Causes**:

- Missing `.env` file
- Invalid `MONGODB_URI`
- Missing dependencies
- Port already in use

---

### Issue: "Failed to connect to MongoDB"

**Symptoms**: Server starts but can't connect to database

**Solutions**:

1. **Local MongoDB**:

   ```bash
   # Check if MongoDB is running
   ps aux | grep mongod

   # Start MongoDB
   brew services start mongodb-community
   # or
   sudo systemctl start mongod
   ```

2. **MongoDB Atlas**:

   - Verify connection string format
   - Check network access (whitelist 0.0.0.0/0)
   - Verify database user credentials
   - Ensure cluster is running

3. **Connection String Format**:
   ```
   mongodb+srv://username:password@cluster.xxxxx.mongodb.net/dbname?retryWrites=true&w=majority
   ```

---

### Issue: API Routes Return 404

**Symptoms**: Frontend can't reach backend APIs

**Solutions**:

1. **Check CORS Configuration**:

   ```javascript
   // backend/server.js
   const corsOptions = {
     origin: process.env.FRONTEND_URL || "http://localhost:3001",
     credentials: true,
   };
   ```

2. **Verify Backend URL**:

   ```bash
   # Should return API welcome message
   curl http://localhost:5001
   ```

3. **Check Frontend API URL**:
   ```bash
   # frontend/.env.local
   NEXT_PUBLIC_API_URL=http://localhost:5001/api
   ```

---

### Issue: JWT Authentication Fails

**Symptoms**: "Token is not valid" errors

**Solutions**:

1. **Verify JWT_SECRET** is set in backend `.env`
2. **Check token format** in Authorization header:
   ```
   Authorization: Bearer <token>
   ```
3. **Token expiration**: Tokens expire after 7 days, re-login
4. **Clear localStorage** and login again

---

## 🎨 Frontend Issues

### Issue: Frontend Build Fails

**Symptoms**: `npm run build` fails with errors

**Solutions**:

1. **TypeScript Errors**:

   ```bash
   # Check for type errors
   npm run type-check

   # Fix downlevelIteration issue
   # Already fixed in tsconfig.json
   ```

2. **Missing Dependencies**:

   ```bash
   cd frontend
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Environment Variables**:
   ```bash
   # Ensure NEXT_PUBLIC_* variables are set
   cat .env.local
   ```

---

### Issue: "Network Error" When Fetching Data

**Symptoms**: Frontend can't fetch from backend

**Solutions**:

1. **Check Backend is Running**:

   ```bash
   curl http://localhost:5001
   ```

2. **Verify API URL Configuration**:

   ```javascript
   // frontend/.env.local
   NEXT_PUBLIC_API_URL=http://localhost:5001/api
   ```

3. **CORS Issues**:

   - Backend must allow frontend origin
   - Check browser console for CORS errors
   - Verify credentials: true in both frontend and backend

4. **Network Tab Debug**:
   - Open browser DevTools
   - Check Network tab for failed requests
   - Verify request URL and headers

---

### Issue: Google Sign-In Not Working

**Symptoms**: Google OAuth redirects fail

**Solutions**:

1. **Check Google Console Configuration**:

   - Authorized JavaScript origins: `http://localhost:3001`, `https://your-domain.com`
   - Authorized redirect URIs: `http://localhost:3001/api/auth/callback/google`

2. **Verify Environment Variables**:

   ```bash
   GOOGLE_CLIENT_ID=your_client_id
   GOOGLE_CLIENT_SECRET=your_client_secret
   NEXTAUTH_URL=http://localhost:3001
   NEXTAUTH_SECRET=your_secret
   ```

3. **Clear Browser Cookies** and try again

4. **Check NextAuth Configuration**:
   ```javascript
   // frontend/app/api/auth/[...nextauth]/route.ts
   // Verify GoogleProvider configuration
   ```

---

### Issue: Stripe Payment Fails

**Symptoms**: Checkout doesn't complete

**Solutions**:

1. **Test Card Numbers**:

   ```
   Success: 4242 4242 4242 4242
   Decline: 4000 0000 0000 0002
   ```

2. **Verify Stripe Keys**:

   ```bash
   # Frontend
   NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_...

   # Backend
   STRIPE_SECRET_KEY=sk_test_...
   ```

3. **Check Stripe Dashboard** for error logs

4. **Webhook Issues** (Production):
   - Verify webhook endpoint in Stripe dashboard
   - Check `STRIPE_WEBHOOK_SECRET` in backend

---

## 🚀 Deployment Issues

### Issue: Vercel Deployment Fails

**Symptoms**: Build fails on Vercel

**Solutions**:

1. **Check Build Logs** in Vercel dashboard

2. **Verify Root Directory**:

   - Set to `frontend` in Vercel project settings

3. **Environment Variables**:

   - All `NEXT_PUBLIC_*` variables must be set
   - Click "Redeploy" after adding variables

4. **Build Command**:
   ```bash
   cd frontend && npm run build
   ```

---

### Issue: Railway Deployment Fails

**Symptoms**: Backend won't deploy

**Solutions**:

1. **Check Deployment Logs** in Railway

2. **Port Configuration**:

   ```bash
   # Railway automatically provides PORT
   PORT=5001  # Remove this or Railway will override
   ```

3. **Start Command**:

   ```bash
   npm start
   # or
   node server.js
   ```

4. **MongoDB Connection**:
   - Verify `MONGODB_URI` is set correctly
   - Use MongoDB Atlas (not localhost) for production

---

### Issue: "Application failed to respond" on Railway

**Symptoms**: Railway shows app as deployed but returns error

**Solutions**:

1. **Check Port Configuration**:

   ```javascript
   // backend/server.js
   const PORT = process.env.PORT || 5001;
   app.listen(PORT);
   ```

2. **Verify Health Check**:

   - Railway expects app to respond on assigned port
   - Check deployment logs for port binding

3. **MongoDB Connection**:
   - App may be waiting for MongoDB connection
   - Check if MongoDB URI is valid

---

## 📱 Browser-Specific Issues

### Issue: "Local Network Access" Popup

**Symptoms**: Browser asks for local network permission

**Solution**:
✅ Already fixed! The app now uses environment-aware URLs and won't request localhost in production.

If you still see this:

1. Ensure `NEXT_PUBLIC_API_URL` is set in Vercel
2. Clear browser cache
3. Hard refresh (Cmd/Ctrl + Shift + R)

---

### Issue: Styles Not Loading

**Symptoms**: App appears unstyled

**Solutions**:

1. **Clear Next.js Cache**:

   ```bash
   cd frontend
   rm -rf .next
   npm run dev
   ```

2. **Check Tailwind Configuration**:

   ```javascript
   // tailwind.config.js should include all paths
   content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"];
   ```

3. **Hard Refresh Browser** (Cmd/Ctrl + Shift + R)

---

## 🗄️ Database Issues

### Issue: Seeding Fails

**Symptoms**: `npm run seed` fails

**Solutions**:

1. **Ensure MongoDB is Connected**:

   ```bash
   # Check MongoDB status
   mongo --eval "db.stats()"
   ```

2. **Clear Existing Data**:

   ```bash
   cd backend
   # Seeder automatically clears old data
   npm run seed
   ```

3. **Check Seeder Script**:
   ```bash
   node utils/seeder.js
   ```

---

### Issue: Data Not Persisting

**Symptoms**: Changes disappear after restart

**Solutions**:

1. **Check Database Connection** is successful
2. **Verify Model Definitions** are correct
3. **Check for Errors** in save operations
4. **Enable Mongoose Debug**:
   ```javascript
   mongoose.set("debug", true);
   ```

---

## 🔐 Authentication Issues

### Issue: Can't Login After Signup

**Symptoms**: Registration succeeds but login fails

**Solutions**:

1. **Password Hashing**:

   - Verify bcrypt is working
   - Check User model pre-save hook

2. **Email Case Sensitivity**:

   - Emails are case-insensitive
   - Stored as lowercase

3. **Check User Active Status**:
   ```javascript
   // User must have isActive: true
   ```

---

### Issue: Session Not Persisting

**Symptoms**: User logged out on page refresh

**Solutions**:

1. **Check localStorage**:

   - Token should be stored in localStorage
   - Key: 'token'

2. **NextAuth Session**:

   ```javascript
   // Verify session configuration
   session: {
     strategy: 'jwt',
     maxAge: 30 * 24 * 60 * 60, // 30 days
   }
   ```

3. **Cookie Settings**:
   - Check browser allows cookies
   - Verify cookie domain settings

---

## 🛠️ Development Environment

### Issue: Hot Reload Not Working

**Symptoms**: Changes don't appear without manual refresh

**Solutions**:

1. **Next.js Dev Server**:

   ```bash
   # Restart dev server
   npm run dev
   ```

2. **File System Watchers**:

   ```bash
   # Increase file watchers (Linux/Mac)
   echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
   sudo sysctl -p
   ```

3. **Check Port Conflicts**:
   ```bash
   # Kill process on port 3001
   lsof -ti:3001 | xargs kill -9
   ```

---

## 📊 Performance Issues

### Issue: Slow API Response

**Solutions**:

1. **Add Database Indexes**:

   ```javascript
   // In model definitions
   storeSchema.index({ name: 1 });
   productSchema.index({ store: 1, category: 1 });
   ```

2. **Enable Query Caching**:

   - Already implemented in `frontend/app/lib/api.ts`
   - 5-minute cache duration

3. **Optimize Queries**:
   - Use `.select()` to limit fields
   - Use `.lean()` for read-only data
   - Add pagination

---

### Issue: Large Bundle Size

**Solutions**:

1. **Analyze Bundle**:

   ```bash
   npm run build
   # Check .next/analyze output
   ```

2. **Dynamic Imports**:

   ```javascript
   const Component = dynamic(() => import("./Component"));
   ```

3. **Tree Shaking**:
   - Remove unused imports
   - Check for duplicate dependencies

---

## 🚨 Error Messages

### "EADDRINUSE: Port already in use"

**Solution**:

```bash
# Find and kill process
lsof -ti:5001 | xargs kill -9  # Backend
lsof -ti:3001 | xargs kill -9  # Frontend
```

---

### "Module not found"

**Solution**:

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

---

### "Cannot find module '...' or its corresponding type declarations"

**Solution**:

```bash
# Install missing type definitions
npm install --save-dev @types/package-name
```

---

## 📞 Still Need Help?

### Resources:

- [Documentation Index](./README.md)
- [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- [Security Guide](./SECURITY.md)
- [GitHub Issues](https://github.com/BisratJ/addiscart/issues)

### Debug Checklist:

- [ ] Check error logs (browser console, terminal)
- [ ] Verify environment variables
- [ ] Check network connectivity
- [ ] Review recent code changes
- [ ] Clear caches and restart services
- [ ] Check for typos in configuration
- [ ] Verify all dependencies installed
- [ ] Check file permissions

---

**Pro Tip**: Enable verbose logging during development:

```bash
# Backend
DEBUG=* npm run dev

# Frontend
NODE_ENV=development npm run dev
```
