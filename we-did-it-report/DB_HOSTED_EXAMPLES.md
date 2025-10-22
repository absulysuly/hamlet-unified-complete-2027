# Hosted Postgres Examples & Prisma notes (Supabase + Render)

Supabase (quick recommended path)
1) Create a new Supabase project (choose region closest to your users).
2) Get the connection string from Project Settings → Database → Connection string → URI.
3) Example connection string (use SSL params if required):
   postgresql://postgres:password@db.hostname.supabase.co:5432/postgres?sslmode=require

4) Set DATABASE_URL in your environment or platform:
- Local bash:
  export DATABASE_URL="postgresql://...sslmode=require"
- Render / Vercel environment variable: DATABASE_URL

5) Apply Prisma schema:
- Development:
  npx prisma db push --schema=backend/prisma/schema.prisma
- Production:
  npx prisma migrate deploy --schema=backend/prisma/schema.prisma

6) Seed:
- Locally (pointing at Supabase DB):
  npx ts-node we-did-it-report/scripts/seed_importer.ts we-did-it-report/reconciliation/RECONCILIATION_AUDIT.csv
- From a CI job with a service role (Supabase) key kept secret.

Notes:
- Use Supabase service_role for server-side seeders; do NOT embed it into the frontend.
- If using Row Level Security, ensure a service account or service_role runs seeding.

Render Postgres
1) Create a Render Postgres instance, choose plan & region.
2) Copy DATABASE_URL from the instance details.
3) Use the same Prisma commands as above.
4) Set the Render Web Service environment variable DATABASE_URL before deploy.

Prisma connection & pool tuning
- For serverless platforms, prefer a connection pooler (PgBouncer) or use Prisma Data Proxy.
- Example connection string parameter for pooling:
  postgresql://user:pass@host:port/dbname?sslmode=require&connection_limit=5

Prisma in CI
- Use `npx prisma migrate deploy` in CI for production migrations.
- For one-off schema syncs (dev/staging), `npx prisma db push` is simpler.

SSL & SSLMODE
- Many hosted Postgres require sslmode=require; include that in the connection string:
  postgresql://user:pass@host:5432/dbname?sslmode=require

Security
- Never expose SERVICE_ROLE or DB credentials in the frontend.
- Store secrets in provider secret stores and GitHub Actions secrets.
