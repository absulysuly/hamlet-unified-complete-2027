# Immediate Deployment Action Plan

## Execution Window
- **Date:** 2025-10-14
- **Duration:** 2–3 hours
- **Objective:** Complete minimal tasks to ship production-ready build to Vercel, under Director oversight.

## Command Reference
```
npm install --save-dev tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm run dev
npm run build
vercel --prod --yes
```

## Task Breakdown (Chronological)

### T0 – Start (Agent 3)
- **Tailwind Migration**
  - Install Tailwind/PostCSS dependencies.
  - Configure `tailwind.config.js` and `postcss.config.js` to use local build.
  - Remove CDN link from layout/components after verifying styles.
- **Safe `.filter()` Audit**
  - Search codebase for `.filter(` occurrences.
  - Wrap array sources with `Array.isArray(data) ? data : []` or default value to prevent runtime errors.
- **Women Badge Verification**
  - Confirm source field (`sex`, `gender`, etc.) and ensure badge conditions match API data.
  - Test in `CandidatePill`, `PostCard`, `Dashboard`, `CandidateProfileView`.
- **Logging**
  - Document steps with timestamps inside `docs/daily-reports/2025-10-14-agent3.md`.

### T0 + 60m – Smoke & Commit (Agent 3 + Agent 5)
- **Local Smoke Test**
  - Run `npm run dev`. Verify candidate filters, dashboards, women badges, share buttons.
- **Cross-Browser Snapshot**
  - Open Chrome and Edge for quick layout check.
- **Commit**
  - Message: `"Oversight Sync – 2025-10-14 – Agent 3 tailwind migration"`.
  - Push to `main`.
- **QA Matrix Update** (Agent 5)
  - Log smoke test outcomes in `docs/testing/qa-matrix.md`.

### T0 + 90m – Backup & Oversight (Agent 2 & Agent 6)
- **Backup Run** (Agent 2)
  - `cd E:\HamletUnified\Copy-of-Hamlet-social`
  - `.\scriptsackup.ps1`
  - Record ZIP name, size, commit hash in `docs/agent-coordination/backup-log.md`.
  - Add commit `"Oversight Sync – 2025-10-14 – Agent 2 backup"`.
- **Oversight Updates** (Agent 6)
  - Ensure `docs/daily-reports/README.md` exists.
  - Update `docs/agent-coordination/status.md` (09:00 & 18:00 slots) with progress notes.
  - Check for six "Oversight Sync – 2025-10-14" commits.

### T0 + 120m – Deployment (Agent 3)
- **Production Build**
  - `npm run build`.
  - Address errors immediately; revert to Director if blocking.
- **Vercel Deploy**
  - `vercel --prod --yes`.
  - Capture deployment URL and record in `docs/agent-coordination/status.md`.

### T0 + 150m – Final Checks (Agent 4 & Agent 5)
- **Marketing Snapshot Prep** (Agent 4)
  - Once deployment is live, capture screenshots for Week 1 teaser assets.
  - Update `marketing/content-calendar.md` and placeholders.
- **Post-Deploy QA** (Agent 5)
  - Run quick verification on live site; update QA matrix with pass/fail and add feature request IDs if needed.

### T0 + 180m – Director Review (Director + Agent 6)
- **Director Note #1**
  - Agent 6 compiles `docs/agent-coordination/status.md` summary and confirms commit list.
  - Director issues "Director Note #1 – Synchronization Validation".
- **Follow-Ups**
  - Identify any remaining blockers for Week 1 backlog.
  - Schedule next commits with "Oversight Sync" tag for traceability.

## Contingency Steps
- If Tailwind migration breaks UI: revert to previous commit, record issue in `feature-requests.md`, request Google AI Studio patch.
- If build fails: document error in `docs/daily-reports/2025-10-14-agent3.md`, tag as `Director-Hold` in `status.md`.
- If Vercel deploy blocked: run `vercel logs` and escalate with error summary.

## Completion Checklist
- [ ] Tailwind migration committed.
- [ ] Safe `.filter()` audit complete.
- [ ] Women badge confirmed across views.
- [ ] Smoke tests passed.
- [ ] Backup log updated and ZIP verified.
- [ ] `Oversight Sync – 2025-10-14` commits for Agents 1–6 visible.
- [ ] `npm run build` succeeded.
- [ ] `vercel --prod --yes` completed and URL logged.
- [ ] Director Note #1 drafted.
