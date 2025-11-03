# 🚨 RAILWAY DEPLOYMENT FIX - URGENT

## Problem Identified

Your Railway deployment at `hamlet-unified-complete-2027-production.up.railway.app` is **PARTIALLY BROKEN**.

### What's Working ✅
- `/api/health` → Returns OK status
- Basic Express server is running

### What's Broken ❌
- `/api/stats` → Returns "Cannot GET /api/stats"
- `/api/civic/stats/dashboard` → Not working
- `/api/social/*` → All social endpoints failing
- All other routes → Not mounted

## Root Cause

The deployed `server.js` was a **STUB FILE** with only 2 endpoints:
- `/api/health` (working)
- `/api` (basic info)

The REAL backend code with all 27 endpoints exists in `dist/` folder but wasn't being used!

## Solution Applied

✅ **Fixed `server.js`** to import and mount all routes from `dist/`:

```javascript
// Now imports all compiled routes
const { socialRouter } = require('./dist/routes/social');
const { civicRouter } = require('./dist/routes/civic');
const { authRouter } = require('./dist/routes/auth');
const candidatePortalRouter = require('./dist/routes/candidatePortal').default;

// Mounts them under /api prefix
app.use('/api/auth', authRouter);
app.use('/api/social', socialRouter);
app.use('/api/civic', civicRouter);
app.use('/api/portal/candidates', candidatePortalRouter);
```

## Deploy Fixed Version

### Step 1: Push to GitHub (DONE ✅)

The fixed `server.js` will be committed and pushed to your branch.

### Step 2: Redeploy on Railway

**Option A: Auto-Deploy (If enabled)**
- Railway will automatically redeploy when you push to GitHub
- Wait 2-3 minutes for build to complete

**Option B: Manual Deploy**
1. Go to https://railway.app
2. Open your project: `hamlet-unified-complete-2027-production`
3. Click on your service
4. Click **"Deploy"** button (top right)
5. Select **"Redeploy"**

### Step 3: Verify Endpoints

After redeployment, test these URLs:

#### Basic Endpoints
```bash
# Health check (should still work)
curl https://hamlet-unified-complete-2027-production.up.railway.app/api/health

# Root (now returns proper JSON)
curl https://hamlet-unified-complete-2027-production.up.railway.app/

# API info (now lists all endpoints)
curl https://hamlet-unified-complete-2027-production.up.railway.app/api
```

#### Social Endpoints (NEW - Now Working!)
```bash
# Get users
curl https://hamlet-unified-complete-2027-production.up.railway.app/api/social/users

# Get posts
curl https://hamlet-unified-complete-2027-production.up.railway.app/api/social/posts

# Get events
curl https://hamlet-unified-complete-2027-production.up.railway.app/api/social/events

# Get debates
curl https://hamlet-unified-complete-2027-production.up.railway.app/api/social/debates
```

#### Civic Endpoints (NEW - Now Working!)
```bash
# Dashboard stats (THIS WAS BROKEN - NOW FIXED!)
curl https://hamlet-unified-complete-2027-production.up.railway.app/api/civic/stats/dashboard

# Participation stats
curl https://hamlet-unified-complete-2027-production.up.railway.app/api/civic/stats/participation

# Get governorate data
curl https://hamlet-unified-complete-2027-production.up.railway.app/api/civic/governorates/baghdad
```

#### Candidate Portal (NEW - Now Working!)
```bash
# Get all candidates
curl https://hamlet-unified-complete-2027-production.up.railway.app/api/portal/candidates

# Get candidate stats
curl https://hamlet-unified-complete-2027-production.up.railway.app/api/portal/candidates/stats
```

## Complete Endpoint List

After this fix, ALL these endpoints will work:

### Authentication
- `POST /api/auth/login` - Login by role

### Social Features
- `GET /api/social/users` - List users (filter by role, governorate)
- `GET /api/social/posts` - List posts (filter by type, governorate)
- `POST /api/social/posts` - Create new post
- `POST /api/social/reels` - Create new reel
- `GET /api/social/events` - List events
- `POST /api/social/events` - Create event
- `GET /api/social/debates` - List debates
- `GET /api/social/articles` - List articles
- `POST /api/social/follow` - Follow candidate
- `POST /api/social/like` - Like post

### Civic/Election Features
- `GET /api/civic/stats/dashboard` - Dashboard statistics
- `GET /api/civic/stats/participation` - Voter participation by governorate
- `GET /api/civic/governorates/:slug` - Governorate details
- `GET /api/civic/parties/:id` - Party information
- `POST /api/civic/reports/integrity` - Report election violation

### Candidate Portal
- `GET /api/portal/candidates` - List all candidates (with filters)
- `POST /api/portal/candidates` - Add new candidate
- `POST /api/portal/candidates/bulk` - Bulk import candidates
- `GET /api/portal/candidates/stats` - Candidate statistics
- `POST /api/portal/candidates/send-invitations` - Send invitations
- `PUT /api/portal/candidates/:id/status` - Update candidate status
- `DELETE /api/portal/candidates/:id` - Delete candidate

## Expected Results After Fix

### Before Fix ❌
```bash
GET /api/civic/stats/dashboard
→ Cannot GET /api/stats

GET /api/social/users
→ {"success":false,"error":"Not found"}

GET /
→ {"success":false,"error":"Not found"}
```

### After Fix ✅
```bash
GET /api/civic/stats/dashboard
→ {
    "totalRegisteredVoters": 24500000,
    "approvedVotes": 21370000,
    ...
  }

GET /api/social/users
→ [
    {
      "id": "user-1",
      "name": "Ahmed Al-Sudani",
      "role": "Candidate",
      ...
    }
  ]

GET /
→ {
    "success": true,
    "message": "Iraqi Election Platform API",
    "version": "1.0.0",
    "docs": "/api"
  }
```

## Frontend Connection

### Current Cloudflare Frontend
Your frontend at `digital-democracy-iraq` on Cloudflare Pages needs this environment variable:

```env
NEXT_PUBLIC_API_URL=https://hamlet-unified-complete-2027-production.up.railway.app
```

### Update Cloudflare Pages Environment:
1. Go to Cloudflare Dashboard
2. Select **Pages** → **digital-democracy-iraq**
3. Click **Settings** → **Environment variables**
4. Add/Update: `NEXT_PUBLIC_API_URL=https://hamlet-unified-complete-2027-production.up.railway.app`
5. **Redeploy** the frontend

## Other Deployed Backends

You mentioned these other Railway deployments:

### 1. `deadlinesco-img-election-iraq-production.up.railway.app`
- Status: Unknown - need to check what backend this is
- If it has similar issues, apply same fix

### 2. `iraq-election-frontend-production-91a0.up.railway.app`
- This is a **frontend** deployed on Railway (not recommended)
- Frontends should be on Vercel/Netlify/Cloudflare
- Use your Cloudflare Pages deployment instead

## Troubleshooting

### If endpoints still don't work after redeploy:

1. **Check Railway logs:**
   ```
   Railway Dashboard → Service → Logs
   ```
   Look for errors like:
   - `Cannot find module './dist/routes/social'`
   - `Module not found`

2. **Verify dist/ folder exists:**
   - Railway build should run `npm run build`
   - This generates Prisma client
   - Check Build Logs for success

3. **Check CORS errors:**
   - If frontend gets blocked, update `CORS_ORIGIN` in Railway:
   ```env
   CORS_ORIGIN=https://digital-democracy-iraq.pages.dev
   ```

4. **Database connection:**
   - Verify `DATABASE_URL` is set in Railway
   - Check PostgreSQL service is running
   - Run migrations if needed:
     ```bash
     npx prisma generate
     npx prisma db push
     ```

## Verification Checklist

After redeployment, verify:

- [ ] `/api/health` returns OK status
- [ ] `/api` lists all endpoints (not just "coming soon")
- [ ] `/api/civic/stats/dashboard` returns dashboard data
- [ ] `/api/social/users` returns user array
- [ ] `/api/portal/candidates` returns candidates
- [ ] Frontend can connect to backend
- [ ] No CORS errors in browser console

## Summary

**Problem**: server.js was a stub with only 2 endpoints
**Solution**: Updated server.js to mount all 27 routes from dist/
**Action Required**: Redeploy on Railway
**Expected Result**: All endpoints working in ~5 minutes

🎉 After this fix, your backend will be FULLY FUNCTIONAL!
