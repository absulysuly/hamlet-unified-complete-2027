# ⚡ QUICK START: Railway Backend Deployment
## 🎯 Get Backend Live in 10 Minutes

---

## 📦 WHAT'S READY

✅ Backend code deployed to GitHub
✅ Railway configuration files in place
✅ API endpoints implemented:
   - `GET /health` → `{"status":"ok"}`
   - `GET /api/candidates` → Candidate data
   - `GET /api/governorates` → Governorate list
✅ Prisma database schema configured
✅ Automated verification scripts ready

---

## 🚀 5-STEP DEPLOYMENT (10 minutes)

### STEP 1: Access Railway Dashboard (1 min)
1. Go to https://railway.app
2. Log in with your account
3. Find project: `hamlet-unified-complete-2027-production`
   - If project doesn't exist, click **"New Project"** → **"Deploy from GitHub repo"**
   - Select repository: `absulysuly/hamlet-unified-complete-2027`
   - Select branch: `claude/backend-railway-deployment-011CUj3CfuUsAR2FJ7adHoRJ`

---

### STEP 2: Add PostgreSQL Database (2 min)
1. In your Railway project, click **"New"**
2. Select **"Database"**
3. Choose **"Add PostgreSQL"**
4. Railway automatically creates `DATABASE_URL` environment variable
5. Wait ~30 seconds for database to provision

---

### STEP 3: Configure Environment Variables (3 min)
1. Click on your service (backend)
2. Go to **"Variables"** tab
3. Add these variables (click **"New Variable"** for each):

```
NODE_ENV=production
PORT=4001
JWT_SECRET=hamlet-iraqi-election-platform-secret-key-2025-secure
ALLOWED_ORIGINS=https://*.vercel.app,https://iraq-election.vercel.app
LOG_LEVEL=info
```

**Note:** `DATABASE_URL` should already be set from Step 2.

4. Click **"Save"** or **"Add"** after each variable

---

### STEP 4: Trigger Deployment (2 min)
1. Go to **"Deployments"** tab
2. Click **"Deploy"** or **"Redeploy"**
3. Wait for build to complete (~2-3 minutes)
4. Railway will automatically:
   - Install dependencies (`npm install`)
   - Generate Prisma client (`npx prisma generate`)
   - Run migrations (`npx prisma migrate deploy`)
   - Start backend (`node dist/index.js`)

---

### STEP 5: Verify Deployment (2 min)

**Method A: Use Automated Script**
```bash
cd /path/to/hamlet-unified-complete-2027
./auto_executor.sh
```

**Method B: Manual Testing**
Open these URLs in your browser or use curl:

```bash
# Health check
https://hamlet-unified-complete-2027-production.up.railway.app/health
# Expected: {"status":"ok"}

# Candidates endpoint
https://hamlet-unified-complete-2027-production.up.railway.app/api/candidates
# Expected: JSON array of candidates

# Governorates endpoint
https://hamlet-unified-complete-2027-production.up.railway.app/api/governorates
# Expected: JSON array of governorate names
```

---

## ✅ SUCCESS INDICATORS

You're done when you see:

✅ Railway deployment status: **"Success"** (green checkmark)
✅ `/health` endpoint returns HTTP 200 with `{"status":"ok"}`
✅ `/api/candidates` returns HTTP 200 with candidate data
✅ `/api/governorates` returns HTTP 200 with governorate list
✅ No errors in Railway logs

---

## 🔍 CHECK DEPLOYMENT LOGS

If anything goes wrong:

1. In Railway dashboard, go to your service
2. Click **"Logs"** tab
3. Look for errors in:
   - Build logs (npm install, TypeScript compilation)
   - Migration logs (Prisma)
   - Runtime logs (server startup)

Common issues:
- **"DATABASE_URL not found"** → Add PostgreSQL database (Step 2)
- **"Port already in use"** → Check PORT environment variable
- **"Module not found"** → Redeploy to reinstall dependencies

---

## 📞 AUTOMATED MONITORING

Run the monitoring script anytime:
```bash
./auto_executor.sh
```

Or check status file:
```bash
cat deployment_status.json
```

---

## 🎯 WHAT HAPPENS NEXT

After backend is live:

1. **Frontend Team:** Configure `NEXT_PUBLIC_API_URL` to Railway backend URL
2. **Frontend Team:** Deploy to Vercel
3. **UX Team:** Run accessibility audit after frontend is deployed

---

## 🆘 NEED HELP?

**Railway Documentation:** https://docs.railway.app
**Our Deployment Guide:** [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md)
**Detailed Action Plan:** [DEPLOYMENT_ACTION_PLAN.md](./DEPLOYMENT_ACTION_PLAN.md)

---

## 📊 CURRENT STATUS

Run this to check current status:
```bash
curl -s https://hamlet-unified-complete-2027-production.up.railway.app/health
```

- **HTTP 200** + `{"status":"ok"}` = ✅ Backend is live!
- **HTTP 403** = ⏳ Not configured yet (follow steps above)
- **HTTP 500** = ❌ Server error (check Railway logs)
- **Connection refused** = ⏳ Not deployed yet

---

**Time to Deploy:** 10 minutes
**Difficulty:** Easy (just UI configuration)
**Requirements:** Railway account with GitHub connected

**LET'S GO! 🚀**
