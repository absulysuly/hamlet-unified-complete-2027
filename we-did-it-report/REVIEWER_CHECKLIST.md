# Reviewer Checklist — we-did-it-report

Follow these steps to validate the branch and verify reconciliation + seed + smoke tests.

Prerequisites
- Node.js >= 18, npm or pnpm
- npx, ts-node (or compile TypeScript)
- psql (or a Postgres client)
- A test Postgres instance (local Docker, Supabase, or Render Postgres)

1) Fetch and inspect the branch
- git fetch origin
- git checkout we-did-it-report
- git log --oneline --decorate --graph --stat
- Confirm files exist:
  - ls we-did-it-report/scripts
  - ls we-did-it-report/reconciliation
  - cat backend/prisma/schema.prisma

2) Safety checks (do this before running anything)
- Check for committed secrets:
  - git grep -nE "(PASSWORD|SECRET|API_KEY|PRIVATE_KEY|ACCESS_TOKEN|SECRET_KEY|DB_PASSWORD)" || true
- Check for .env or credential files:
  - git ls-files --exclude-standard --others

3) Set DATABASE_URL to a test DB (do NOT use production credentials)
- Bash:
  export DATABASE_URL="postgresql://user:pass@host:5432/dbname"
- PowerShell:
  $env:DATABASE_URL="postgresql://user:pass@host:5432/dbname"

4) Apply Prisma schema
- For a simple push (development/test):
  npx prisma db push --schema=backend/prisma/schema.prisma
- For production-like migrations (CI/prod):
  npx prisma migrate deploy --schema=backend/prisma/schema.prisma

5) Run seed importer (this will insert the canonical 36)
- npx ts-node we-did-it-report/scripts/seed_importer.ts we-did-it-report/reconciliation/RECONCILIATION_AUDIT.csv
- Expected CLI outcome: summary showing 36 canonical candidates imported (or message in RECONCILIATION_SUMMARY.json).

6) Verify DB rows
- psql "$DATABASE_URL" -c "SELECT COUNT(*) FROM election_candidates;"
- Expect: 36

7) Start backend locally
- Read backend README for start command; common examples:
  - npm ci
  - npm run dev
- Confirm process is listening and env vars are set (NODE_ENV, DATABASE_URL).

8) Smoke tests (use curl or HTTP client)
- Health:
  curl -Ssf http://localhost:PORT/health || echo "Health check failed"
- Candidate list:
  curl -Ssf "http://localhost:PORT/candidates?limit=5" | jq .
- Candidate detail (replace {id} with an ID from DB):
  curl -Ssf "http://localhost:PORT/candidates/{id}" | jq .

Expected smoke test results
- /health returns 200 and a JSON { "status": "ok" } or similar (see backend implementation).
- /candidates returns an array; first entries should match names in RECONCILIATION_AUDIT.csv.
- Database counts should match 36 rows.

9) CI & Workflow review
- Inspect .github/workflows/reconciliation.yml for:
  - Secrets use (no hard-coded secrets)
  - Meaningful steps and environment setup
  - Whether it runs on push/PR or is manual (adjust if needed)

10) Merge checks
- Ensure the target branch (main) is up to date and passes tests.
- Confirm reviewers sign-off and acceptance criteria are checked.

If anything fails
- Paste logs and commands you ran into a PR comment.
- If secrets were accidentally committed, stop, rotate keys, and remove them from history (BFG or git filter-repo).

Thank you for reviewing — leaving specific runtime logs in the PR comments helps the author troubleshoot quickly.
