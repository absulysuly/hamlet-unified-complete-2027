# Railway Deployment Guide

This guide will help you deploy the Iraqi Election Platform backend to Railway in under 30 minutes.

## Prerequisites
- Railway account (sign up at https://railway.app)
- GitHub repository access

## Quick Deployment Steps

### 1. Create Railway Project (2 minutes)

1. Go to https://railway.app
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose the repository: `absulysuly/hamlet-unified-complete-2027`
5. Select the branch: `claude/urgent-railway-deployment-011CUk9WGktUPxwPy7DYoYgW` (or your main branch)

### 2. Configure Root Directory (1 minute)

Since the backend is in a subdirectory:
1. In your Railway project settings, find **"Root Directory"**
2. Set it to: `backend`
3. Click **"Save"**

### 3. Add PostgreSQL Database (2 minutes)

1. In your Railway project, click **"+ New"**
2. Select **"Database"** → **"PostgreSQL"**
3. Railway will automatically create a PostgreSQL instance
4. The `DATABASE_URL` will be automatically added to your environment variables

### 4. Set Environment Variables (3 minutes)

Go to your service → **Variables** tab and add:

```
NODE_ENV=production
PORT=${{ PORT }}
DATABASE_URL=${{ DATABASE_URL }}
CORS_ORIGIN=https://your-frontend-domain.vercel.app
```

**Note:** `DATABASE_URL` is automatically set by Railway when you add PostgreSQL.

### 5. Deploy (1 minute)

1. Railway will automatically start deploying
2. Wait for the build to complete (usually 2-3 minutes)
3. Once deployed, Railway will provide you with a public URL

### 6. Run Database Migrations (2 minutes)

After first deployment:
1. Go to your service → **Settings** → **Deploy**
2. Add a **"Deploy Command"**:
   ```
   npx prisma migrate deploy
   ```
   OR manually run in Railway's terminal:
   ```
   npx prisma generate
   npx prisma db push
   ```

### 7. Test Your Deployment (1 minute)

Your backend will be available at: `https://your-service.up.railway.app`

Test the health endpoint:
```bash
curl https://your-service.up.railway.app/api/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "Iraqi Election Platform API is running",
  "timestamp": "2025-11-03T..."
}
```

## Available API Endpoints

Once deployed, your API will have:

- **Health Check**: `GET /api/health`
- **Main API**: `GET /api`
- **Social Features**:
  - `GET /api/social/users`
  - `GET /api/social/posts`
  - `POST /api/social/posts`
  - `GET /api/social/events`
  - `POST /api/social/events`
  - `GET /api/social/debates`
  - `GET /api/social/articles`
  - `POST /api/social/follow`
  - `POST /api/social/like`
- **Authentication**: `/api/auth/*`
- **Candidate Portal**: `/api/candidates/*`

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ Auto-set by Railway |
| `PORT` | Server port | ✅ Auto-set by Railway |
| `NODE_ENV` | Environment (production) | ✅ Set manually |
| `CORS_ORIGIN` | Frontend URL for CORS | ✅ Set manually |
| `GEMINI_API_KEY` | Google Gemini API key | ❌ Optional |

## Troubleshooting

### Build Fails
- Check that Root Directory is set to `backend`
- Verify package.json exists in backend directory
- Check Railway build logs for specific errors

### Database Connection Issues
- Ensure PostgreSQL service is running
- Verify DATABASE_URL is set correctly
- Run `npx prisma generate` in Railway terminal

### CORS Errors
- Update CORS_ORIGIN to match your frontend URL
- Ensure https:// is included in the URL

## Post-Deployment

1. Update your frontend environment variables with the new backend URL
2. Test all API endpoints
3. Monitor Railway logs for any issues
4. Set up custom domain (optional)

## Cost Estimate

- **Hobby Plan**: $5/month (500 hours, suitable for development)
- **Pro Plan**: $20/month (unlimited hours, recommended for production)

## Support

For issues:
1. Check Railway logs: Project → Service → Logs
2. Review Railway documentation: https://docs.railway.app
3. Check backend/server.js for configuration
