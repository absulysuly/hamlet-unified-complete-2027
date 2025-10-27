# Vercel Deployment Guide

This guide will help you deploy the Hamlet application to Vercel. The project consists of:
- **Frontend**: React + Vite application (`test-new-frontend/`)
- **Backend**: Express.js API with Prisma ORM (`backend/`)

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Vercel CLI** (optional): Install globally with `npm i -g vercel`
3. **MongoDB Database**: You'll need a MongoDB connection string (MongoDB Atlas recommended)
4. **Environment Variables**: Prepare the required environment variables listed below

## Deployment Options

### Option 1: Deploy via Vercel Dashboard (Recommended)

#### Step 1: Connect Repository
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your Git repository
3. Vercel will detect the project automatically

#### Step 2: Configure Projects
Since this is a monorepo, you'll need to deploy **two separate projects**:

##### A. Deploy Frontend (`test-new-frontend/`)

1. **Project Settings**:
   - **Framework Preset**: Vite
   - **Root Directory**: `test-new-frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

2. **Environment Variables**:
   ```
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   VITE_API_URL=https://your-backend-url.vercel.app/api
   ```

3. Click **Deploy**

##### B. Deploy Backend (`backend/`)

1. **Project Settings**:
   - **Framework Preset**: Other
   - **Root Directory**: `backend`
   - **Build Command**: `npm run build && npx prisma generate`
   - **Output Directory**: `api`
   - **Install Command**: `npm install`

2. **Environment Variables**:
   ```
   NODE_ENV=production
   PORT=4000

   # CORS Configuration
   ALLOWED_ORIGINS=https://your-frontend-url.vercel.app,https://www.your-domain.com

   # Database
   DATABASE_URL=your_mongodb_connection_string

   # Prisma
   PRISMA_GENERATE_DATAPROXY=true

   # Optional
   LOG_LEVEL=info
   ```

3. Click **Deploy**

---

### Option 2: Deploy via Vercel CLI

#### Step 1: Install Vercel CLI
```bash
npm i -g vercel
```

#### Step 2: Login to Vercel
```bash
vercel login
```

#### Step 3: Deploy Frontend
```bash
cd test-new-frontend
vercel --prod
```

When prompted:
- Set up and deploy: **Y**
- Which scope: Select your team/account
- Link to existing project: **N** (first time) or **Y** (if exists)
- Project name: `hamlet-frontend` (or your choice)
- Root directory: `./` (since you're in test-new-frontend/)
- Build settings: Accept detected settings

#### Step 4: Deploy Backend
```bash
cd ../backend
vercel --prod
```

When prompted:
- Set up and deploy: **Y**
- Which scope: Select your team/account
- Link to existing project: **N** (first time) or **Y** (if exists)
- Project name: `hamlet-backend` (or your choice)
- Root directory: `./` (since you're in backend/)

---

## Environment Variables Setup

### Frontend Environment Variables

Add these in Vercel Dashboard → Your Project → Settings → Environment Variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_GEMINI_API_KEY` | Google Gemini API key | `AIzaSy...` |
| `VITE_API_URL` | Backend API URL | `https://hamlet-backend.vercel.app/api` |

### Backend Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `DATABASE_URL` | Yes | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/hamlet` |
| `ALLOWED_ORIGINS` | Yes | Comma-separated allowed CORS origins | `https://hamlet-frontend.vercel.app` |
| `PORT` | No | Server port (Vercel handles this) | `4000` |
| `NODE_ENV` | Yes | Environment | `production` |
| `LOG_LEVEL` | No | Logging level | `info` |

---

## Database Setup (MongoDB Atlas)

1. **Create MongoDB Atlas Account**: [mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register)

2. **Create a Cluster**:
   - Choose free tier (M0)
   - Select a region close to your users
   - Create cluster

3. **Create Database User**:
   - Security → Database Access
   - Add new database user
   - Choose password authentication
   - Save credentials securely

4. **Whitelist Vercel IPs**:
   - Security → Network Access
   - Add IP Address: `0.0.0.0/0` (allow from anywhere)
   - **Note**: For production, restrict to Vercel's IP ranges

5. **Get Connection String**:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `hamlet` (or your database name)

6. **Add to Vercel**:
   - Paste the connection string in the `DATABASE_URL` environment variable

---

## Post-Deployment Steps

### 1. Run Database Migrations

After deploying the backend, you need to run Prisma migrations:

**Option A: Via Vercel CLI**
```bash
cd backend
vercel env pull .env.production
npx prisma migrate deploy
```

**Option B: Via Build Command** (Already configured)
The build command includes `npx prisma generate`, which generates the Prisma Client.

### 2. Update Frontend API URL

Ensure the frontend environment variable `VITE_API_URL` points to your deployed backend:
```
VITE_API_URL=https://your-backend-project.vercel.app/api
```

### 3. Update CORS Origins

In the backend environment variables, add your frontend URL to `ALLOWED_ORIGINS`:
```
ALLOWED_ORIGINS=https://your-frontend-project.vercel.app,https://www.yourdomain.com
```

### 4. Test Deployment

1. Open your frontend URL
2. Check browser console for errors
3. Test API endpoints: `https://your-backend-url.vercel.app/api/health`
4. Verify authentication and data fetching

---

## Project Structure

```
hamlet-unified-complete-2027/
├── test-new-frontend/          # React + Vite frontend
│   ├── src/
│   ├── public/
│   ├── vercel.json            # Frontend Vercel config
│   └── package.json
│
├── backend/                   # Express.js backend
│   ├── src/                   # Original source
│   │   ├── index.ts          # Development entry point
│   │   ├── config.ts
│   │   └── routes/
│   ├── api/                   # Vercel serverless entry
│   │   └── index.ts          # Production entry point (serverless)
│   ├── prisma/
│   │   └── schema.prisma
│   ├── vercel.json           # Backend Vercel config
│   └── package.json
│
├── vercel.json               # Root monorepo config (optional)
├── .vercelignore
└── VERCEL_DEPLOYMENT.md      # This file
```

---

## Troubleshooting

### Issue: "Module not found" errors

**Solution**: Ensure all dependencies are in `package.json` and not just `devDependencies`:
```bash
cd backend
npm install --save @prisma/client express cors dotenv
```

### Issue: Database connection fails

**Solutions**:
1. Verify `DATABASE_URL` is set correctly in Vercel environment variables
2. Check MongoDB Atlas Network Access allows Vercel's IPs (`0.0.0.0/0`)
3. Ensure database user has correct permissions
4. Test connection string locally first

### Issue: CORS errors

**Solutions**:
1. Add your frontend URL to `ALLOWED_ORIGINS` environment variable
2. Check the backend logs in Vercel dashboard
3. Ensure URLs include `https://` protocol

### Issue: Prisma Client not generated

**Solution**: Add Prisma generation to build command:
```bash
npm run build && npx prisma generate
```

Or add a `vercel-build` script in `backend/package.json`:
```json
{
  "scripts": {
    "vercel-build": "prisma generate && npm run build"
  }
}
```

### Issue: API routes return 404

**Solutions**:
1. Ensure API paths include `/api` prefix: `/api/health`, `/api/social/posts`
2. Check `backend/vercel.json` routing configuration
3. Verify `backend/api/index.ts` exports the Express app

### Issue: Environment variables not loading

**Solutions**:
1. Set environment variables in Vercel Dashboard (not `.env` files)
2. Redeploy after adding environment variables
3. For frontend: Variables must start with `VITE_`

---

## Monitoring and Logs

### View Deployment Logs
1. Go to Vercel Dashboard
2. Select your project
3. Click on a deployment
4. View "Building" and "Runtime Logs" tabs

### Real-time Logs (CLI)
```bash
vercel logs [deployment-url] --follow
```

### Performance Monitoring
- Vercel automatically provides Web Vitals and analytics
- Access via: Project → Analytics

---

## Custom Domain (Optional)

### Add Custom Domain
1. Go to Project Settings → Domains
2. Add your domain (e.g., `hamlet.yourdomain.com`)
3. Follow DNS configuration instructions
4. Update `ALLOWED_ORIGINS` in backend to include your custom domain

---

## Continuous Deployment

Vercel automatically deploys:
- **Production**: Pushes to your main/master branch
- **Preview**: Pull requests and other branches

To disable auto-deployment:
1. Project Settings → Git
2. Configure ignored build paths or deployment branches

---

## Cost Optimization

### Free Tier Limits
- **Bandwidth**: 100GB/month
- **Serverless Function Execution**: 100GB-hours
- **Build Time**: 100 hours/month

### Tips to Stay Within Limits
1. Optimize images and assets
2. Use caching headers
3. Minimize API calls from frontend
4. Consider edge caching for static content

---

## Alternative: Single Project Deployment

If you prefer deploying as a single project (not recommended for this setup):

1. Use the root `vercel.json` (already configured)
2. Deploy from the repository root
3. Vercel will build both frontend and backend together

**Note**: This is more complex and may cause issues with monorepo dependencies.

---

## Support and Resources

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Vercel Support**: [vercel.com/support](https://vercel.com/support)
- **MongoDB Atlas**: [mongodb.com/docs/atlas](https://www.mongodb.com/docs/atlas/)
- **Prisma Deployment**: [pris.ly/d/vercel](https://pris.ly/d/vercel)

---

## Quick Checklist

- [ ] Vercel account created
- [ ] MongoDB Atlas cluster created
- [ ] Database user and connection string obtained
- [ ] Frontend deployed to Vercel
- [ ] Backend deployed to Vercel
- [ ] Environment variables configured for both projects
- [ ] Frontend `VITE_API_URL` points to backend URL
- [ ] Backend `ALLOWED_ORIGINS` includes frontend URL
- [ ] Database migrations run successfully
- [ ] Health endpoint working: `/api/health`
- [ ] Frontend can communicate with backend
- [ ] Custom domain configured (optional)

---

**Deployment Status**: Ready for production! 🚀

For issues or questions, refer to the troubleshooting section or consult Vercel's documentation.
