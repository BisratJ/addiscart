# Google Authentication Setup Guide

## 🚀 Quick Start

Your Google Sign-In is now implemented! Follow these steps to make it fully functional:

## 📋 Prerequisites

- Google Cloud Console account
- Your application running on `http://localhost:3000`

## 🔧 Step-by-Step Setup

### 1. Create Google OAuth Credentials

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/

2. **Create or Select a Project**
   - Click on the project dropdown at the top
   - Click "New Project" or select an existing one
   - Name it "Addiscart" or your preferred name

3. **Enable Google+ API**
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API"
   - Click "Enable"

4. **Configure OAuth Consent Screen**
   - Go to "APIs & Services" > "OAuth consent screen"
   - Select "External" user type
   - Fill in the required fields:
     - App name: `Addiscart`
     - User support email: Your email
     - Developer contact: Your email
   - Click "Save and Continue"
   - Skip "Scopes" for now (click "Save and Continue")
   - Add test users (your email) if in testing mode
   - Click "Save and Continue"

5. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Application type: "Web application"
   - Name: `Addiscart Web Client`
   - Authorized JavaScript origins:
     ```
     http://localhost:3000
     https://yourdomain.com (for production)
     ```
   - Authorized redirect URIs:
     ```
     http://localhost:3000/api/auth/callback/google
     https://yourdomain.com/api/auth/callback/google (for production)
     ```
   - Click "Create"
   - **Copy the Client ID and Client Secret** (you'll need these!)

### 2. Configure Environment Variables

1. **Create/Update `.env.local` file** in the frontend directory:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id-from-step-1
GOOGLE_CLIENT_SECRET=your-google-client-secret-from-step-1
```

2. **Generate NEXTAUTH_SECRET**:
   ```bash
   openssl rand -base64 32
   ```
   Copy the output and paste it as your `NEXTAUTH_SECRET`

### 3. Restart Your Development Server

```bash
npm run dev
```

## ✅ Testing Google Sign-In

1. Navigate to `http://localhost:3000/auth/login`
2. Click "Continue with Google"
3. Select your Google account
4. Grant permissions
5. You should be redirected back to the home page, signed in!

## 🎯 How It Works

### Authentication Flow

1. **User clicks "Continue with Google"**
   - Triggers `signIn('google')` from NextAuth
   
2. **Redirect to Google**
   - User sees Google's OAuth consent screen
   
3. **User grants permission**
   - Google redirects back to: `/api/auth/callback/google`
   
4. **NextAuth processes the callback**
   - Creates a session with user info
   - Stores JWT token
   
5. **User is redirected to home page**
   - Authenticated and ready to shop!

### Files Modified/Created

- ✅ `/app/api/auth/[...nextauth]/route.ts` - NextAuth configuration
- ✅ `/app/components/providers/SessionProvider.tsx` - Session provider wrapper
- ✅ `/app/auth/login/page.tsx` - Updated with functional Google Sign-In
- ✅ `.env.example` - Environment variable template
- ✅ `GOOGLE_AUTH_SETUP.md` - This setup guide

## 🔒 Security Notes

- **Never commit `.env.local`** to version control
- Keep your `GOOGLE_CLIENT_SECRET` private
- Use different credentials for development and production
- Rotate secrets regularly in production

## 🐛 Troubleshooting

### Error: "redirect_uri_mismatch"
- **Solution**: Make sure the redirect URI in Google Console exactly matches:
  ```
  http://localhost:3000/api/auth/callback/google
  ```

### Error: "invalid_client"
- **Solution**: Check that your `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correct

### Google Sign-In button does nothing
- **Solution**: 
  1. Check browser console for errors
  2. Verify environment variables are loaded (restart dev server)
  3. Ensure NextAuth API route is accessible: `http://localhost:3000/api/auth/providers`

### Session not persisting
- **Solution**: Check that `NEXTAUTH_SECRET` is set and server is restarted

## 📱 Production Deployment

When deploying to production:

1. **Update environment variables** on your hosting platform (Vercel, Netlify, etc.)
2. **Add production URLs** to Google Console:
   - Authorized JavaScript origins: `https://yourdomain.com`
   - Authorized redirect URIs: `https://yourdomain.com/api/auth/callback/google`
3. **Update `NEXTAUTH_URL`** to your production domain
4. **Generate a new `NEXTAUTH_SECRET`** for production

## 🎨 Customization

### Change the callback URL
Edit `/app/api/auth/[...nextauth]/route.ts`:
```typescript
callbackUrl: '/dashboard' // Change from '/'
```

### Add more OAuth providers
Add to the `providers` array in `/app/api/auth/[...nextauth]/route.ts`:
```typescript
FacebookProvider({
  clientId: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
}),
```

## 📚 Additional Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Google OAuth 2.0 Guide](https://developers.google.com/identity/protocols/oauth2)
- [NextAuth.js Google Provider](https://next-auth.js.org/providers/google)

## ✨ Features Implemented

- ✅ Google OAuth Sign-In
- ✅ Session management with JWT
- ✅ Automatic redirect after authentication
- ✅ Loading states and error handling
- ✅ Secure token storage
- ✅ Integration with existing auth system

---

**Need help?** Check the troubleshooting section or refer to the NextAuth.js documentation.
