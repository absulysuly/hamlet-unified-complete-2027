# Deployment Go/No-Go Checklist (Director)

## Preconditions (All Must Be **Yes** Before Deploy)
- **Repository** `E:\HamletUnified\Copy-of-Hamlet-social` synced with `https://github.com/absulysuly/Copy-of-Hamlet-social` (run `git status`, `git remote -v`).
- **Commit Tagging** Six "Oversight Sync – 2025-10-14" commits visible in Git history (Agents 1-6).
- **Backup** New archive in `E:\HamletUnified\backups\daily\` verified and logged in `docs/agent-coordination/backup-log.md`.

## Agent Checkpoints
| Agent | Go Criteria | File / Evidence | Status (Go/No-Go) |
|-------|-------------|-----------------|-------------------|
| **Agent 1** | Facebook/Twitter/Telegram targets updated with 2025-10-14 timestamp | `SocialMedia/Facebook_Targets.xlsx` | |
| **Agent 2** | Manual `scripts/Backup.ps1` run logged with ZIP filename, size, commit hash | `docs/agent-coordination/backup-log.md` | |
| **Agent 3** | Tailwind local build configured, all `.filter()` usages safe, women badge verified; smoke test passed | `docs/daily-reports/2025-10-14-agent3.md` | |
| **Agent 4** | Week 1–3 bilingual posts drafted; placeholders stored under `marketing-assets/` | `marketing/content-calendar.md` | |
| **Agent 5** | QA smoke matrix prepared; ready to mark Pass/Fail after deployment | `docs/testing/qa-matrix.md` | |
| **Agent 6** | Oversight activation logged; 09:00/18:00 entries up to date; feature requests captured | `docs/agent-coordination/status.md`, `docs/agent-coordination/feature-requests.md` | |

## Smoke Test Gate (Pre-Deploy)
- **Local run** `npm run dev` → confirm posts, candidate views, dashboard stats, social tabs.
- **Quick browser check** Chrome / Edge / Firefox layout sanity.
- **Result log** Update `docs/testing/qa-matrix.md` with Pass/Fail and notes.

## Deployment Gate
1. `npm run build`
2. `vercel --prod --yes`
3. Record deployment timestamp, Vercel URL, and commit hash in `docs/agent-coordination/status.md`.

## Post-Deploy Immediate Actions
- **Agent 5** Perform smoke regression on production URL; update `docs/testing/qa-matrix.md` with results.
- **Agent 2** Run post-deploy backup; append entry to `backup-log.md`.
- **Agent 4** Capture fresh screenshots for marketing assets (no public posting yet).

## Decision Log
| Time (UTC) | Director | Go/No-Go | Notes |
|------------|----------|----------|-------|
|            |          |          |       |

> **Reminder:** If any checkpoint is "No-Go," halt deployment, tag entry as `Director-Hold` in `docs/agent-coordination/status.md`, and assign remediation before retry.
