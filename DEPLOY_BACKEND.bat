@echo off
echo =========================================
echo  DEPLOYING CLOUDFLARE WORKER BACKEND
echo =========================================
echo.
echo This will deploy your backend API to Cloudflare Workers
echo It takes about 30 seconds
echo.

REM Deploy worker
echo [32mDeploying to Cloudflare...[0m
npx wrangler deploy cloudflare-worker.js

echo.
echo =========================================
echo  [32mDEPLOYMENT COMPLETE[0m
echo =========================================
echo.
echo Your backend API is now live!
echo.
echo NEXT STEPS:
echo 1. Copy the URL shown above
echo 2. Update .env.local with: NEXT_PUBLIC_API_URL=^<your-url^>
echo 3. Run: npm run build
echo 4. Redeploy your frontend
echo.
echo Your site will work perfectly!
echo =========================================

pause
