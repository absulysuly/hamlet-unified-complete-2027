# Railway Backend Deployment Guide

## 🚀 Quick Setup

### 1. Add PostgreSQL Database in Railway Dashboard

1. Go to your Railway project: https://hamlet-unified-complete-2027-production.up.railway.app
2. Click **"New"** → **"Database"** → **"Add PostgreSQL"**
3. Railway will automatically create a `DATABASE_URL` environment variable

### 2. Configure Environment Variables

In Railway dashboard, add these environment variables:

```bash
NODE_ENV=production
PORT=4001
JWT_SECRET=hamlet-iraqi-election-platform-secret-key-2025-secure
ALLOWED_ORIGINS=https://*.vercel.app,https://iraq-election.vercel.app
LOG_LEVEL=info
```

**Note:** The `DATABASE_URL` is automatically set by Railway when you add PostgreSQL.

### 3. Deploy

Railway will automatically deploy when you push to the branch. The configuration files are already set up:

- `railway.json` - Build and deploy configuration
- `railway.toml` - Environment and startup configuration

### 4. Verify Deployment

Once deployed, test these endpoints:

```bash
# Health check
curl https://hamlet-unified-complete-2027-production.up.railway.app/health

# Should return: {"status":"ok"}

# Candidates endpoint
curl https://hamlet-unified-complete-2027-production.up.railway.app/api/candidates

# Governorates endpoint
curl https://hamlet-unified-complete-2027-production.up.railway.app/api/governorates
```

## 📋 What Was Configured

### Backend Changes
- ✅ Added `/api/candidates` endpoint - Returns list of candidates
- ✅ Added `/api/governorates` endpoint - Returns list of governorates
- ✅ Updated `backend/package.json` with proper build and start scripts
- ✅ Configured TypeScript compilation

### Railway Configuration
- ✅ Updated `railway.json` to deploy backend (not frontend)
- ✅ Added Prisma migration step to deployment
- ✅ Set up proper build command for backend

### Environment Setup
- ✅ Created `.env.example` with required variables
- ✅ Documented all required environment variables

## 🗄️ Database Migrations

The deployment automatically runs Prisma migrations:
```bash
npx prisma migrate deploy
```

If you need to run migrations manually:
```bash
cd backend
npx prisma generate
npx prisma migrate deploy
```

## 🔧 Troubleshooting

### Build Fails
- Check Railway logs for specific errors
- Ensure all dependencies are in `backend/package.json`
- Verify `DATABASE_URL` is set

### Endpoints Return 404
- Verify the backend is running (check `/health` endpoint)
- Check Railway logs for startup errors
- Ensure `PORT` environment variable is set

### Database Connection Issues
- Verify PostgreSQL database is added in Railway
- Check `DATABASE_URL` format: `postgresql://user:password@host:5432/database`
- Ensure migrations ran successfully

## 📝 Available Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check - Returns `{"status":"ok"}` |
| `/api/candidates` | GET | List all candidates |
| `/api/governorates` | GET | List all governorates |
| `/civic/stats/dashboard` | GET | Dashboard statistics |
| `/civic/stats/participation` | GET | Governorate participation stats |
| `/civic/governorates/:slug` | GET | Specific governorate details |

## 🎯 Next Steps After Deployment

1. ✅ Verify `/health` endpoint returns 200 OK
2. ✅ Test `/api/candidates` returns candidate data
3. ✅ Test `/api/governorates` returns governorate list
4. ✅ Update frontend to use the new backend URL
5. ✅ Configure CORS if needed for your frontend domain
