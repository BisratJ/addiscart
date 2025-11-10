# 🚀 Production Deployment Guide

## Pre-Deployment Checklist

### ✅ Code Quality
- [ ] All TypeScript errors resolved
- [ ] No console.errors in production code
- [ ] All tests passing
- [ ] Code linted and formatted
- [ ] No unused imports or variables
- [ ] Environment variables validated

### ✅ Performance
- [ ] Images optimized
- [ ] API calls cached where appropriate
- [ ] Lazy loading implemented
- [ ] Bundle size optimized
- [ ] Database indexes created
- [ ] Rate limiting configured

### ✅ Security
- [ ] Environment variables secured
- [ ] API keys not exposed
- [ ] CORS configured correctly
- [ ] Input validation on all forms
- [ ] SQL injection prevention
- [ ] XSS protection enabled
- [ ] HTTPS enforced

### ✅ Features
- [ ] Authentication working
- [ ] Payment processing tested
- [ ] Email notifications configured
- [ ] Error tracking setup
- [ ] Analytics integrated
- [ ] SEO meta tags added

---

## Environment Setup

### Backend Environment Variables

Create `.env` in `/backend`:

```env
# Server
NODE_ENV=production
PORT=5001

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority

# JWT
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
JWT_EXPIRE=7d

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email (SendGrid/Mailgun)
EMAIL_SERVICE=sendgrid
EMAIL_API_KEY=your-email-api-key
EMAIL_FROM=noreply@yourdomain.com

# AWS S3 (for file uploads)
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_S3_BUCKET=your-bucket-name
AWS_REGION=us-east-1

# Redis (optional, for caching)
REDIS_URL=redis://localhost:6379

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend Environment Variables

Create `.env.production` in `/frontend`:

```env
# API
NEXT_PUBLIC_API_URL=https://api.yourdomain.com

# Auth
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-nextauth-secret-min-32-characters

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Stripe
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_live_...

# Feature Flags
NEXT_PUBLIC_ENABLE_GOOGLE_AUTH=true
NEXT_PUBLIC_ENABLE_STRIPE=true
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_PWA=false

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

---

## Deployment Options

### Option 1: Vercel (Frontend) + Railway (Backend)

#### Frontend on Vercel

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   cd frontend
   vercel --prod
   ```

3. **Configure Environment Variables**
   - Go to Vercel Dashboard
   - Project Settings → Environment Variables
   - Add all variables from `.env.production`

4. **Custom Domain**
   - Domains → Add Domain
   - Configure DNS records

#### Backend on Railway

1. **Install Railway CLI**
   ```bash
   npm i -g @railway/cli
   ```

2. **Initialize**
   ```bash
   cd backend
   railway login
   railway init
   ```

3. **Deploy**
   ```bash
   railway up
   ```

4. **Configure Environment Variables**
   - Railway Dashboard → Variables
   - Add all variables from `.env`

5. **Custom Domain**
   - Settings → Domains
   - Add custom domain

---

### Option 2: AWS (Full Stack)

#### Backend on AWS Elastic Beanstalk

1. **Install EB CLI**
   ```bash
   pip install awsebcli
   ```

2. **Initialize**
   ```bash
   cd backend
   eb init
   ```

3. **Create Environment**
   ```bash
   eb create production
   ```

4. **Deploy**
   ```bash
   eb deploy
   ```

#### Frontend on AWS Amplify

1. **Connect Repository**
   - AWS Amplify Console
   - Connect GitHub/GitLab repository

2. **Configure Build**
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - cd frontend
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: frontend/.next
       files:
         - '**/*'
     cache:
       paths:
         - frontend/node_modules/**/*
   ```

3. **Environment Variables**
   - App Settings → Environment Variables
   - Add all production variables

---

### Option 3: Digital Ocean (Full Stack)

#### Using App Platform

1. **Create App**
   - Digital Ocean Dashboard → Apps → Create App

2. **Configure Components**
   
   **Backend:**
   - Type: Web Service
   - Source: GitHub repository
   - Build Command: `cd backend && npm install`
   - Run Command: `cd backend && npm start`
   - HTTP Port: 5001

   **Frontend:**
   - Type: Static Site
   - Source: GitHub repository
   - Build Command: `cd frontend && npm install && npm run build`
   - Output Directory: `frontend/.next`

3. **Environment Variables**
   - Settings → Environment Variables
   - Add for each component

4. **Database**
   - Create Managed MongoDB
   - Copy connection string to `MONGODB_URI`

---

## Database Setup

### MongoDB Atlas (Recommended)

1. **Create Cluster**
   - Go to MongoDB Atlas
   - Create new cluster
   - Choose region closest to your users

2. **Configure Network Access**
   - Network Access → Add IP Address
   - Allow access from anywhere (0.0.0.0/0) for cloud deployments

3. **Create Database User**
   - Database Access → Add New User
   - Save credentials securely

4. **Get Connection String**
   - Clusters → Connect → Connect your application
   - Copy connection string
   - Replace `<password>` with your password

5. **Seed Database**
   ```bash
   cd backend
   node utils/seeder.js
   ```

---

## Performance Optimization

### Frontend

1. **Enable Compression**
   ```javascript
   // next.config.js
   module.exports = {
     compress: true,
     images: {
       domains: ['images.unsplash.com', 'logo.clearbit.com'],
       formats: ['image/avif', 'image/webp'],
     },
   };
   ```

2. **Enable SWC Minification**
   ```javascript
   // next.config.js
   module.exports = {
     swcMinify: true,
   };
   ```

3. **Add CDN**
   - Use Cloudflare or AWS CloudFront
   - Configure caching rules

### Backend

1. **Enable Compression**
   ```javascript
   const compression = require('compression');
   app.use(compression());
   ```

2. **Add Redis Caching**
   ```javascript
   const redis = require('redis');
   const client = redis.createClient(process.env.REDIS_URL);
   ```

3. **Database Indexing**
   ```bash
   # Already done in models, verify:
   db.products.getIndexes()
   db.categories.getIndexes()
   db.stores.getIndexes()
   ```

---

## Monitoring & Logging

### Error Tracking

**Sentry Setup:**

```bash
npm install @sentry/nextjs @sentry/node
```

```javascript
// sentry.client.config.js
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

### Analytics

**Google Analytics:**

```javascript
// app/layout.tsx
import Script from 'next/script';

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  );
}
```

---

## Security Hardening

### Backend

1. **Rate Limiting**
   ```javascript
   const rateLimit = require('express-rate-limit');
   
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100, // limit each IP to 100 requests per windowMs
   });
   
   app.use('/api/', limiter);
   ```

2. **Helmet for Security Headers**
   ```javascript
   const helmet = require('helmet');
   app.use(helmet());
   ```

3. **CORS Configuration**
   ```javascript
   const cors = require('cors');
   app.use(cors({
     origin: process.env.FRONTEND_URL,
     credentials: true,
   }));
   ```

### Frontend

1. **Content Security Policy**
   ```javascript
   // next.config.js
   const securityHeaders = [
     {
       key: 'X-DNS-Prefetch-Control',
       value: 'on'
     },
     {
       key: 'X-Frame-Options',
       value: 'SAMEORIGIN'
     },
     {
       key: 'X-Content-Type-Options',
       value: 'nosniff'
     },
   ];
   
   module.exports = {
     async headers() {
       return [
         {
           source: '/(.*)',
           headers: securityHeaders,
         },
       ];
     },
   };
   ```

---

## Post-Deployment

### Testing

1. **Smoke Tests**
   - [ ] Homepage loads
   - [ ] User can register/login
   - [ ] Products display correctly
   - [ ] Cart functionality works
   - [ ] Checkout process completes
   - [ ] Orders are created

2. **Performance Tests**
   - [ ] Lighthouse score > 90
   - [ ] Page load time < 3s
   - [ ] API response time < 500ms

3. **Security Tests**
   - [ ] SSL certificate valid
   - [ ] Security headers present
   - [ ] No exposed secrets
   - [ ] Rate limiting works

### Monitoring

1. **Setup Alerts**
   - Server downtime
   - High error rates
   - Slow response times
   - Database connection issues

2. **Regular Backups**
   - Database: Daily automated backups
   - File uploads: S3 versioning enabled
   - Code: Git repository

---

## Rollback Plan

### Quick Rollback

**Vercel:**
```bash
vercel rollback
```

**Railway:**
```bash
railway rollback
```

**Manual:**
1. Revert to previous Git commit
2. Redeploy
3. Restore database backup if needed

---

## Maintenance

### Regular Tasks

**Daily:**
- Monitor error logs
- Check server health
- Review analytics

**Weekly:**
- Update dependencies
- Review performance metrics
- Check security alerts

**Monthly:**
- Database optimization
- Backup verification
- Security audit

---

## Support & Troubleshooting

### Common Issues

**Issue: API not connecting**
- Check CORS configuration
- Verify API_URL environment variable
- Check network/firewall rules

**Issue: Database connection failed**
- Verify MongoDB URI
- Check IP whitelist
- Confirm database user credentials

**Issue: Build failing**
- Check Node version compatibility
- Clear node_modules and reinstall
- Verify all environment variables

### Getting Help

- Documentation: `/docs`
- Issues: GitHub Issues
- Email: support@yourdomain.com

---

## Success Criteria

✅ Application accessible at production URL
✅ All features working correctly
✅ Performance metrics meeting targets
✅ Security headers configured
✅ Monitoring and alerts active
✅ Backup strategy implemented
✅ Documentation updated

---

**Congratulations! Your application is now live! 🎉**
