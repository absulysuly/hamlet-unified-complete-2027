# Directorate Bulletin – Unified Operations Cycle (Round 1)

## Mission Focus — Week 1
- **Platform validation** Identify and log UI/UX or data gaps for Google AI Studio follow-up.
- **Backup verification** Confirm codebase, AI Studio merges, and daily archives remain secure.
- **Social-media intelligence** Expand Facebook, Twitter, and Telegram targeting databases for future outreach.

## Agent Directives

### Agent 1 — Social Media Intelligence
- **Task** Continue populating `SocialMedia/Facebook_Targets.xlsx`.
- **Extension** Add Twitter/Telegram worksheets mirroring columns: Name | Link | Members | Type | Contact | Notes.
- **Deliverable** Daily commit of updated spreadsheet.

### Agent 2 — Backup & Security
- **Task** Execute `scripts/Backup.ps1` manually, verify Git sync and archive creation under `E:\HamletUnified\backups\daily\`.
- **Documentation** Log timestamp and outcome in `docs/agent-coordination/backup-log.md`.
- **Automation** Confirm Task Scheduler entry for daily execution (19:00 default) and note verification in the log.

### Agent 3 — Platform Assessment (Primary)
- **Scope** 30-minute audit of `E:\HamletUnified\Copy-of-Hamlet-social` covering checklist below.
- **Checklist**
  - Women badge visibility
  - Filter buttons (governorate | party | gender)
  - Responsive behavior across breakpoints
  - Language toggles (Arabic | English | Kurdish)
  - Search bar performance
  - Social share buttons
  - Candidate contact methods
  - Dashboard statistics accuracy
- **Reporting** Capture findings in `docs/daily-reports/YYYY-MM-DD-agent3.md`.
- **Escalation** File gaps via `docs/agent-coordination/feature-requests.md` using the standard template.

### Agent 4 — Marketing Foundation
- **Task** Draft bilingual pre-launch content for Weeks 1–3 in `marketing/content-calendar.md`.
- **Assets** Store visual creatives in `marketing-assets/`, marked as "Coming Soon"; do not publish externally.

### Agent 5 — Quality Assurance
- **Preparation** Mirror Agent 3 checklist in `docs/testing/qa-matrix.md` as regression tests.
- **Execution** After Agent 3 report, mark each item ✅/❌, attach one screenshot per failure, and link related feature-request IDs.

### Agent 6 — Documentation & Coordination
- **Cadence** Update `docs/agent-coordination/status.md` twice daily (09:00, 18:00) with agent progress.
- **Change Log** Record Google AI Studio merges, backup confirmations, and QA outcomes.
- **Deprecation** After today’s backup verification, add notices to `hamlat-forntend-6-10` and `amlet-unified` READMEs redirecting to the main repo.

## Feature Request Template
```
**Feature Request – Iraqi Election Platform**

**Missing Feature:** [Name]
**Location:** [Expected placement]
**Purpose:** [User benefit]
**Priority:** High / Medium / Low

**Technical Notes:**
- Must support Arabic + English
- Mobile-responsive
- Compatible with existing candidate data

**Example Implementation:**
[Reference or brief concept]
```

## Coordination Timeline
- **09:00** Morning status sync — Agent 6 → Director.
- **12:00** Backup verification ping — Agent 2.
- **15:00** Interim QA check — Agent 5.
- **18:00** Daily recap commit + summary — Agent 6.
- **20:00** Director review and Google AI Studio submissions — Director.

## Current Status
- All six agents active and authorized.
- Agent 3 platform audit in progress.
- Parallel tasks underway for Agents 1, 2, 4, 5, 6.
- Await Agent 3 report before escalating new feature requests to Google AI Studio.
