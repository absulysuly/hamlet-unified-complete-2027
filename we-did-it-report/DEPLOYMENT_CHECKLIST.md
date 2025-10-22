# Deployment Checklist — Render (backend) + Vercel (frontends)

High-level plan
- Provision production Postgres (Supabase or Render managed Postgres).
- Deploy backend service (Render recommended) with DATABASE_URL and secrets.
- Deploy frontends to Vercel and set NEXT_PUBLIC_API_URL to the backend URL.
- Run DB migrations/seeding in a controlled manner (CI or deploy hook).
- Smoke test production staging environment, then promote.

Pre-deploy tasks
- Confirm branch pushed: git push origin we-did-it-report
- Create a staging DB (Supabase/Render) and copy the connection string.
- Add secrets to the target platform secret store:
  - DATABASE_URL
  - SERVICE_JWT_SECRET / NEXTAUTH_SECRET / JWT_SECRET
  - SENTRY_DSN (if used)
  - EMAIL provider secrets (if used)
  - SUPABASE_SERVICE_ROLE (server-side only, if using Supabase)
- Verify Prisma version and run: npx prisma generate

Render — Backend
- Create a new Web Service on Render and connect the GitHub repo branch.
- Environment variables:
  - DATABASE_URL: postgres connection string (use sslmode=require if needed)
  - NODE_ENV=production
  - Any other runtime envs the backend expects
- Build command (example):
  npm ci && npx prisma generate
- Start command (example):
  npm run start:prod  # or node dist/index.js
- Health check:
  - Configure Render health check endpoint (/health)
- Post-deploy migration/seeding:
  - Use a deploy hook or one-time instance to run:
    npx prisma migrate deploy --schema=backend/prisma/schema.prisma
    npx ts-node we-did-it-report/scripts/seed_importer.ts we-did-it-report/reconciliation/RECONCILIATION_AUDIT.csv
  - Alternatively, run these in CI with production-safe credentials.

Vercel — Frontends
- For each frontend project:
  - Connect the repo to Vercel
  - Set build environment variables:
    - NEXT_PUBLIC_API_URL=https://<render-backend-url>
    - Any other NEXT_PUBLIC_ vars
  - Configure non-public secrets in Vercel environment variable settings
  - Trigger a deployment and watch build logs

CI / GitHub Actions notes
- Add production deploy workflows that:
  - Run tests and linting
  - Run prisma migrate deploy (or rely on a Render deploy hook)
  - Avoid seeding production automatically unless explicitly opted-in; prefer controlled seeding
- Use environment secrets in GitHub Actions (Settings → Secrets).

Post-deploy verification
- API smoke tests
  curl -Ssf "https://<render-backend>/health"
  curl -Ssf "https://<render-backend>/candidates?limit=5"
- Frontend sanity:
  - Visit the frontends in a browser and load key pages: candidate list, candidate detail, search.
  - Validate network calls in DevTools to ensure they hit the correct backend URL.
- Monitoring:
  - Confirm logging & error tracking is operational (Sentry, Logflare, etc.)
  - Configure uptime monitoring.

Rollback plan
- Keep DB backups (auto-snapshots)
- Use Render/Vercel rollback/deploy history to revert if needed
- Never change DB schema that is incompatible without a migration plan and downtime window

Security reminders
- Rotate any credentials used for seeding
- Use least privilege for DB service keys (e.g., Supabase service_role only for server-side jobs)
- Ensure RLS or access controls are enabled if necessary
