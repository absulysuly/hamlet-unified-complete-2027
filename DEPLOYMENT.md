# 🚀 Deployment Guide - Digital Democracy Iraq

This guide covers deploying the Beautiful UI application to production.

## 📋 Prerequisites

- [ ] Node.js 20+ installed
- [ ] Git repository access
- [ ] Account on Vercel or Netlify
- [ ] Database setup (MongoDB/PostgreSQL)

## 🎯 Quick Deploy Options

### Option 1: Deploy to Vercel (Recommended for Next.js)

**One-Click Deploy:**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/absulysuly/hamlet-unified-complete-2027)

**Manual Deploy:**

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login to Vercel
vercel login

# 3. Deploy
vercel --prod
```

**Configuration:**
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `PUPPETEER_SKIP_DOWNLOAD=true npm install`
- Node Version: 20.x

### Option 2: Deploy to Netlify

**One-Click Deploy:**

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/absulysuly/hamlet-unified-complete-2027)

**Manual Deploy:**

```bash
# 1. Install Netlify CLI
npm i -g netlify-cli

# 2. Login to Netlify
netlify login

# 3. Deploy
netlify deploy --prod
```

**Configuration:**
- Build Command: `PUPPETEER_SKIP_DOWNLOAD=true npm install && npm run build`
- Publish Directory: `.next`
- Node Version: 20

## 🔐 Environment Variables Setup

### Required Variables:

Copy `.env.production.example` to your deployment platform:

```bash
# Database
DATABASE_URL=postgresql://...
MONGODB_URI=mongodb+srv://...

# Auth
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-secret-here

# API
NEXT_PUBLIC_API_URL=https://your-domain.com/api

# Puppeteer
PUPPETEER_SKIP_DOWNLOAD=true
```

### For Vercel:

```bash
vercel env add NEXTAUTH_SECRET
vercel env add DATABASE_URL
# ... add all required variables
```

### For Netlify:

1. Go to Site Settings → Environment Variables
2. Add each variable from `.env.production.example`

## 🏗️ Build Process

### Local Production Build Test:

```bash
# 1. Install dependencies
PUPPETEER_SKIP_DOWNLOAD=true npm install

# 2. Build for production
npm run build

# 3. Test production build locally
npm start

# Visit http://localhost:3000
```

### Production Build Info:

- **Framework:** Next.js 15.5.6
- **React:** 19.0.0
- **Tailwind CSS:** 4.1.14
- **TypeScript:** 5.8.2

## 📊 Current Build Stats

```
Route (app)                    Size        First Load JS
┌ ○ /                         167 kB      (main page)
├ ○ /beautiful                103 kB      (demo page)
└ ○ /_not-found               103 kB
```

## 🌍 Post-Deployment Checklist

### Immediate (After First Deploy):

- [ ] Test homepage loads: `https://your-domain.com`
- [ ] Test beautiful demo: `https://your-domain.com/beautiful`
- [ ] Verify all environment variables are set
- [ ] Check build logs for errors
- [ ] Test mobile responsiveness

### Within 24 Hours:

- [ ] Set up custom domain
- [ ] Configure SSL certificate (usually automatic)
- [ ] Test all 3 languages (EN/AR/KU)
- [ ] Verify glassmorphism effects render correctly
- [ ] Check performance metrics (Lighthouse)

### Before Public Launch:

- [ ] Connect real database
- [ ] Set up authentication
- [ ] Enable real-time features
- [ ] Set `NEXT_PUBLIC_MOCK_DATA_ENABLED=false`
- [ ] Run security audit
- [ ] Set up monitoring/analytics
- [ ] Configure error tracking (Sentry, etc.)

## 🔧 Troubleshooting

### Build Fails with Puppeteer Error:

**Solution:** Ensure `PUPPETEER_SKIP_DOWNLOAD=true` is set

```bash
# For Vercel
vercel env add PUPPETEER_SKIP_DOWNLOAD true

# For Netlify
# Add in UI: PUPPETEER_SKIP_DOWNLOAD = true
```

### Database Connection Issues:

**Check:**
1. DATABASE_URL format is correct
2. Database accepts connections from deployment IP
3. Firewall rules allow access

### Pages Not Loading:

**Debug:**
1. Check build logs in deployment platform
2. Verify environment variables are set
3. Check Next.js output directory is `.next`

## 📈 Performance Optimization

### Recommended Settings:

```bash
# .env.production
NODE_ENV=production
NEXT_PUBLIC_MOCK_DATA_ENABLED=false
```

### Vercel-Specific:

- Enable Edge Functions for API routes
- Use Image Optimization
- Enable ISR (Incremental Static Regeneration)

### Netlify-Specific:

- Enable Next.js Runtime
- Use Netlify Edge Functions
- Configure build plugins

## 🎉 Success Indicators

Your deployment is successful when:

✅ Build completes without errors
✅ All pages load correctly
✅ Beautiful UI renders with glassmorphism effects
✅ Mobile/tablet/desktop all responsive
✅ All 3 languages work (EN/AR/KU)
✅ No console errors in browser
✅ Lighthouse score > 90

## 🔗 Useful Links

- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com)

## 📞 Support

Issues? Check:
1. Build logs in your deployment platform
2. Browser console for client errors
3. Network tab for API issues

---

**Current Version:** 1.0.0 (Beautiful UI - Phase 1)
**Last Updated:** 2025-11-03
**Status:** ✅ Production Ready
