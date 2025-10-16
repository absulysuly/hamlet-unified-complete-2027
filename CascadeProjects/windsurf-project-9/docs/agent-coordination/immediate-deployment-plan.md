# Immediate Deployment Action Plan – 2025-10-14

## Objective
Deploy the Hamlet Social platform to production today by completing critical fixes, smoke testing, and executing the Vercel release while keeping Director oversight synchronized.

## Pre-Flight Checklist
- **Repo** `E:\HamletUnified\Copy-of-Hamlet-social`
- **Branch** `main`
- **Commit Tagging** Include `"Oversight Sync – 2025-10-14"` in all commit messages executed during this window.
- **Reporting** Update `docs/agent-coordination/status.md` after each major milestone.

## Agent Tasks (2–3 Hour Sprint)

### Agent 3 — Platform Stabilization
1. Install Tailwind locally (run inside `Copy-of-Hamlet-social/`):
   ```bash
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```
2. Update `tailwind.config.js` content paths and configure PostCSS.
3. Replace CDN imports in layout files with local Tailwind build.
4. Audit all `.filter()` usages:
   ```javascript
   const safeList = (list || []).filter(...)
   ```
   Commit each module touched.
5. Verify women badge rendering across `CandidatePill`, `PostCard`, `DashboardPage`, and `CandidateProfileView`.
6. Log actions and timestamps in `docs/daily-reports/2025-10-14-agent3.md`.

### Agent 6 — Oversight & Logs
1. Confirm `docs/daily-reports/` directory and `README.md` exist.
2. Update `docs/agent-coordination/status.md` with heading `Oversight Activation Confirmed – 2025-10-14`.
3. After Agent 3 commits, capture commit hashes and note progress.
4. Monitor GitHub for six "Oversight Sync – 2025-10-14" commits; prep Director Note #1 draft.

### Agent 5 — QA Smoke Validation
1. Pull Agent 3 updates.
2. Run development server:
   ```bash
   npm run dev
   ```
3. Validate core flows:
   - Posts list + details
   - Candidate filters (governorate/party/gender)
   - Language toggle (Arabic/English/Kurdish)
   - Dashboard statistics
4. Document results in `docs/testing/qa-matrix.md` with ✅/❌ and screenshot paths.

### Agent 2 — Backup Verification
1. After Agent 3 merges fixes, execute:
   ```powershell
   cd E:\HamletUnified\Copy-of-Hamlet-social
   .\scripts\Backup.ps1
   ```
2. Ensure ZIP generated in `E:\HamletUnified\backups\daily\` and record filename, size, commit hash, and result in `docs/agent-coordination/backup-log.md`.

### Agent 4 — Launch Assets Prep (Parallel)
1. Update `marketing/content-calendar.md` with Week 1–3 bilingual posts.
2. Add placeholder files under `marketing-assets/` (cover, profile, teaser) referencing final brand assets.
3. Await QA sign-off before creating publish schedule.

### Agent 1 — Social Intelligence (Parallel)
1. Refresh `SocialMedia/Facebook_Targets.xlsx` and add Twitter/Telegram tabs with today’s date in headers.
2. Flag top 10 high-engagement channels for launch announcement coordination.

## Deployment Steps (Post-QA)
1. Build production bundle:
   ```bash
   npm run build
   ```
2. Deploy to Vercel:
   ```bash
   vercel --prod --yes
   ```
3. Validate live site for:
   - Women badge visibility
   - Candidate filters
   - Language toggles
   - Dashboard statistics
4. Agent 6 logs deployment time and URL in `docs/agent-coordination/status.md`.

## Contingency & Escalation
- **Build errors** → Agent 3 investigates; Agent 6 documents issue ID under `Director-Hold` section.
- **Deployment failure** → Roll back via Vercel dashboard, notify Director, and rerun after fix.
- **Backup failure** → Agent 2 reruns script and escalates to Director if second attempt fails.

## Completion Criteria
- Tailwind runs locally without CDN.
- `.filter()` calls are safe across modules.
- Women badge visible and accurate.
- Smoke tests pass (recorded in QA matrix).
- Production build succeeds and Vercel deployment is live.
- Director Note #1 drafted with validated commit list and backup confirmation.
