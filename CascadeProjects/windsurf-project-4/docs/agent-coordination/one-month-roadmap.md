# One-Month Countdown Roadmap

## Overview
Focus: Stabilize `E:\HamletUnified\Copy-of-Hamlet-social`, maintain oversight discipline, and prepare marketing/QA for go-live within one month.

## Weekly Plan by Agent
| Week | Agent | Primary Objectives | Key Deliverables |
|------|-------|--------------------|------------------|
| **Week 1 – Stabilize Core** | **Agent 1** | Finalize Facebook lists and add Twitter/Telegram targeting fields | Updated `SocialMedia/Facebook_Targets.xlsx` dated 2025-10-14 |
| | **Agent 2** | Validate `scripts/Backup.ps1`, confirm ZIP creation, document results | Daily entries in `docs/agent-coordination/backup-log.md`, archives in `E:\HamletUnified\backups\daily\` |
| | **Agent 3** | Migrate Tailwind to local build, remove unsafe `.filter()` usage, verify women badge | Commits updating Tailwind configs, findings in `docs/daily-reports/YYYY-MM-DD-agent3.md` |
| | **Agent 4** | Draft Week 1–3 bilingual posts, set asset placeholders | `marketing/content-calendar.md`, files in `marketing-assets/` |
| | **Agent 5** | Build baseline QA matrix aligned with Agent 3 checklist | `docs/testing/qa-matrix.md` with Pass/Fail, evidence columns |
| | **Agent 6** | Stand up `docs/daily-reports/`, record oversight activation, track confirmations | `docs/daily-reports/README.md`, `docs/agent-coordination/status.md` 09:00/18:00 updates |
| **Week 2 – Finish Core Fixes & QA** | **Agent 1** | Expand to diaspora influencers, prep outreach tags | Engagement metrics/notes in spreadsheet |
| | **Agent 2** | Automate backup verification output, rehearse restore drill | Restore test notes appended to `backup-log.md` |
| | **Agent 3** | Complete UI polish (language toggle, social share, contact forms) | Updated report in `docs/daily-reports/`, feature requests if gaps remain |
| | **Agent 4** | Produce mock launch assets (video/storyboards) pending QA approval | Drafts stored in `marketing-assets/` |
| | **Agent 5** | Execute regression on stabilized build, log defects & screenshots | Updated `qa-matrix.md` rows with evidence paths |
| | **Agent 6** | Prepare Director Note automation, align docs structure | Scripted check for "Oversight Sync" commits documented |
| **Week 3 – Pre-Launch Readiness** | **Agent 1** | Curate Telegram/Twitter outreach targets, segment audiences | New `SocialMedia` sheets with reach estimates |
| | **Agent 2** | Schedule Task Scheduler job, validate cloud sync | Status entries confirming schedule + cloud copy |
| | **Agent 3** | Coordinate final feature list with Google AI Studio, sign off UI | No open feature requests; audit log marked complete |
| | **Agent 4** | Build full launch calendar (copy + CTA), finalize bilingual review | `marketing/content-calendar.md` Week 4 updates |
| | **Agent 5** | Run cross-device/browser tests, compile test pack | Comprehensive pass log with screenshots in repo |
| | **Agent 6** | Assemble deployment & rollback playbook, update docs | Deployment checklist in `docs/technical-specs/` (if created) |
| **Week 4 – Launch Prep & Go-Live** | **Agent 1** | Draft engagement scripts for outreach (pending go-live approval) | Script snippets stored in `marketing/` |
| | **Agent 2** | Perform final backup audit, produce monthly backup report | Summary section in `backup-log.md` referencing hashes |
| | **Agent 3** | Coordinate final merge to production branch, oversee deploy | Deployment confirmation logged in daily report |
| | **Agent 4** | Finalize launch messaging kit, queue but do not send | Ready-to-launch assets validated by QA |
| | **Agent 5** | Run smoke tests post-deploy, compile final QA sign-off | Final row in `qa-matrix.md` marked ✅ |
| | **Agent 6** | Publish Director Oversight Report #2, archive month’s notes | Wrap-up entry in `docs/agent-coordination/status.md` |

## Critical Path
1. Tailwind migration + `.filter()` safeguards → prevents UI crashes and unblocks QA.
2. QA matrix completion → informs Director oversight and marketing visuals.
3. Marketing assets synced with stabilized UI → ensures bilingual launch readiness.

## Daily Discipline
- **Morning (09:00)** `docs/agent-coordination/status.md` update by Agent 6.
- **Midday (12:00)** Backup verification ping; Agent 2 logs outcome.
- **Afternoon (15:00)** Interim QA check recorded by Agent 5.
- **Evening (18:00)** Status recap committed by Agent 6.
- **Director (20:00)** Review commits and issue oversight notes.
