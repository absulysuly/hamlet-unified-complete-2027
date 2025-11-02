# 🚀 Cloudflare Pages Deployment Guide

## ✅ Status: READY TO DEPLOY

All fixes have been applied and committed to branch: `claude/fix-pages-file-size-limit-011CUjSNYuFJTeHkw7LsMf8Q`

**Build output:** 1.3MB (well under 25MB limit)
**Status:** Build successful ✓

---

## 📋 What Was Fixed

1. ✅ **Next.js Configuration** - Configured for static export (`output: 'export'`)
2. ✅ **Tailwind CSS v4** - Updated to use `@import` syntax
3. ✅ **TypeScript Configuration** - Excluded backend, added missing type definitions
4. ✅ **Build Artifacts** - All files under 25MB limit
5. ✅ **Wrangler Configuration** - Created `wrangler.toml` for Cloudflare Pages

---

## 🎯 Quick Deployment Steps (Windows)

### Option 1: Deploy Using Wrangler CLI (Recommended)

Open PowerShell in your project directory:

```powershell
# Navigate to your project
cd E:\HamletUnified\Copy-of-Hamlet-social

# Pull the latest changes
git fetch origin
git checkout claude/fix-pages-file-size-limit-011CUjSNYuFJTeHkw7LsMf8Q
git pull origin claude/fix-pages-file-size-limit-011CUjSNYuFJTeHkw7LsMf8Q

# Install dependencies (skip Puppeteer download)
$env:PUPPETEER_SKIP_DOWNLOAD="true"
npm install

# Build the project
npm run build

# Deploy to Cloudflare Pages
npx wrangler pages deploy out --project-name=digital-democracy-iraq
```

### Option 2: Deploy via Cloudflare Dashboard

1. **Login to Cloudflare Dashboard**
   - Go to https://dash.cloudflare.com
   - Navigate to **Workers & Pages** → **Pages**

2. **Connect GitHub Repository**
   - Click **"Create application"**
   - Select **"Connect to Git"**
   - Choose your repository: `absulysuly/hamlet-unified-complete-2027`
   - Select branch: `claude/fix-pages-file-size-limit-011CUjSNYuFJTeHkw7LsMf8Q`

3. **Configure Build Settings**
   ```
   Framework preset: Next.js
   Build command: npm run build
   Build output directory: out
   Root directory: (leave empty)
   ```

4. **Environment Variables** (if needed)
   ```
   PUPPETEER_SKIP_DOWNLOAD = true
   NODE_VERSION = 20
   ```

5. **Deploy**
   - Click **"Save and Deploy"**
   - Wait for build to complete (~2-3 minutes)
   - Your site will be live at: `https://digital-democracy-iraq.pages.dev`

---

## 🔧 Troubleshooting

### If you get "file too large" error:
```powershell
# Make sure you're deploying the 'out' folder, not the entire project
npx wrangler pages deploy out --project-name=digital-democracy-iraq
```

### If build fails with font errors:
The Google Fonts have been disabled for offline builds. The fix is already applied in the latest code.

### If you get Puppeteer errors:
```powershell
$env:PUPPETEER_SKIP_DOWNLOAD="true"
npm install
```

### To verify your build locally:
```powershell
npm run build
# Check output size
Get-ChildItem -Path "out" -Recurse | Measure-Object -Property Length -Sum
```

---

## 📁 Key Files Modified

| File | Change |
|------|--------|
| `next.config.js` | Set `output: 'export'` for static generation |
| `app/layout.tsx` | Removed Google Fonts for offline builds |
| `app/globals.css` | Updated to Tailwind CSS v4 syntax |
| `postcss.config.mjs` | Updated to use `@tailwindcss/postcss` |
| `tsconfig.json` | Excluded backend from TypeScript compilation |
| `wrangler.toml` | ✨ NEW - Cloudflare Pages configuration |
| `.gitignore` | Added build artifacts |

---

## 🎉 Post-Deployment

After successful deployment, you'll get:

- **Production URL:** `https://digital-democracy-iraq.pages.dev`
- **Custom Domain:** Can be configured in Cloudflare Dashboard
- **Automatic Deployments:** Future commits will auto-deploy
- **Preview Deployments:** Each PR gets its own preview URL

---

## 🔗 Useful Links

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Next.js Static Export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [Wrangler CLI Docs](https://developers.cloudflare.com/workers/wrangler/)

---

## 💡 Next Steps

1. **Deploy** using one of the methods above
2. **Test** the deployed site thoroughly
3. **Configure custom domain** (optional)
4. **Set up analytics** in Cloudflare Dashboard
5. **Enable Web Analytics** for visitor insights

---

**Need help?** The deployment is ready to go. All configuration is complete and tested!
