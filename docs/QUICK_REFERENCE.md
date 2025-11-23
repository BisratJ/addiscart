# ⚡ Quick Reference Card

## 🚀 Deploy Commands

```bash
# Frontend (Vercel)
cd frontend && vercel --prod

# Backend (Railway)
cd backend && railway up

# Build locally
npm run build && npm start
```

## 📁 Key Files

| File | Purpose |
|------|---------|
| `frontend/app/lib/api.ts` | API with caching |
| `frontend/app/lib/utils.ts` | 30+ utilities |
| `frontend/app/lib/constants.ts` | All constants |
| `frontend/app/lib/env.ts` | Env validation |
| `backend/routes/categories.js` | Category API |

## 🔧 Useful Utilities

```typescript
// Format currency
formatCurrency(19.99) // "$19.99"

// Format date
formatDate(date, 'relative') // "2 hours ago"

// Validate
isValidEmail(email)
isValidPhone(phone)

// Debounce
debounce(fn, 300)

// Cache
clearCache('categories')
```

## 🌐 API Endpoints

```
GET    /api/categories
GET    /api/categories/:id
GET    /api/categories/slug/:slug/:storeId
GET    /api/categories/hierarchy/:storeId
POST   /api/categories
PUT    /api/categories/:id
DELETE /api/categories/:id
```

## 📊 Performance Targets

- Load Time: < 2s
- Lighthouse: 90+
- API Response: < 500ms
- Cache Hit: 60%+

## 🔒 Security Checklist

- [ ] Env vars secured
- [ ] HTTPS enabled
- [ ] Headers configured
- [ ] CORS set
- [ ] Inputs validated

## 📈 Monitoring

- **Errors**: Sentry
- **Analytics**: Google Analytics
- **Uptime**: Uptime Robot
- **Performance**: Vercel Analytics

## 🆘 Troubleshooting

**API not connecting?**
→ Check NEXT_PUBLIC_API_URL

**Build failing?**
→ Clear cache: `rm -rf .next node_modules`

**Slow performance?**
→ Check cache: `clearCache()`

## 📚 Documentation

- **DEPLOYMENT_GUIDE.md** - Deploy instructions
- **PRODUCTION_READY.md** - Overview
- **OPTIMIZATION_SUMMARY.md** - Tech details
- **CATEGORY_SYSTEM.md** - Category docs

## ✅ Pre-Deploy

1. Set environment variables
2. Run `npm run build`
3. Test locally
4. Deploy
5. Verify live site

---

**Ready to launch! 🚀**
