# 🚀 Quick Google OAuth Setup (5 Minutes)

## Step 1: Get Google Credentials (3 min)

1. Go to: https://console.cloud.google.com/apis/credentials
2. Create Project → Name it "Addiscart"
3. Create Credentials → OAuth client ID → Web application
4. Add redirect URI: `http://localhost:3000/api/auth/callback/google`
5. Copy **Client ID** and **Client Secret**

## Step 2: Set Environment Variables (1 min)

Create `.env.local` file:

```bash
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=run-this-command-below-to-generate
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

Generate secret:
```bash
openssl rand -base64 32
```

## Step 3: Restart Server (1 min)

```bash
npm run dev
```

## ✅ Done! Test it:

1. Go to: http://localhost:3000/auth/login
2. Click "Continue with Google"
3. Sign in with your Google account
4. You're authenticated! 🎉

---

**Having issues?** Read the full guide: `GOOGLE_AUTH_SETUP.md`
