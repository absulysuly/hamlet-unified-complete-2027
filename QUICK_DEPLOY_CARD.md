# ⚡ QUICK DEPLOYMENT CARD - 5 MINUTES TO LIVE

## 🎯 3 STEPS TO DEPLOY

### 1️⃣ REDEPLOY RAILWAY (2 min)
```
1. Open: https://railway.app
2. Project: hamlet-unified-complete-2027-production
3. Click: Deploy → Redeploy
4. Wait: 2-3 minutes
```

**Test**: https://hamlet-unified-complete-2027-production.up.railway.app/api/civic/stats/dashboard
✅ Should return JSON (not error)

---

### 2️⃣ CHECK CLOUDFLARE ENV (1 min)
```
1. Open: https://dash.cloudflare.com
2. Pages → digital-democracy-iraq → Settings
3. Environment variables → Add/Check:
   NEXT_PUBLIC_API_URL=https://hamlet-unified-complete-2027-production.up.railway.app
4. If changed: Deployments → Retry deployment
```

---

### 3️⃣ TEST FRONTEND (2 min)
```
1. Open: https://digital-democracy-iraq.pages.dev
2. Press F12 → Check Console for errors
3. Browse candidates, switch languages
```

---

## ✅ SUCCESS = ALL GREEN

✅ Backend: https://hamlet-unified-complete-2027-production.up.railway.app/api/health → Returns OK
✅ Frontend: https://digital-democracy-iraq.pages.dev → Loads with data
✅ Console: No red errors (F12)

---

## 🆘 IF ISSUES

**Backend still broken?**
→ Check Railway logs for errors

**Frontend can't connect?**
→ Check Cloudflare env vars set correctly

**Still stuck?**
→ Tell me what errors you see

---

## 📊 WHAT'S DEPLOYED

**Backend Endpoints**: 27 total
- Auth: 1 endpoint
- Social: 10 endpoints
- Civic: 5 endpoints
- Portal: 7 endpoints
- System: 4 endpoints

**Frontend Features**:
- Multilingual (AR/EN/KU)
- Candidate browsing
- Social feed
- Election dashboard
- Theme switching

---

**ESTIMATED TIME: 5 MINUTES TO FULL DEPLOYMENT** ⚡
