# Directorate Bulletin – Unified Operations Cycle (Round 1)

## Mission Focus (Week 1)
- **Platform validation** Identify and log all UI/UX or data gaps for Google AI Studio follow-up.
- **Backup verification** Confirm all code, AI Studio merges, and daily archives are secured.
- **Social-media intelligence** Continue mapping Facebook, Twitter, and Telegram ecosystems for eventual outreach.

## Immediate Agent Actions
### Agent 3 – Platform Assessment (Primary)
- **Scope** Run a 30-minute audit on `E:\HamletUnified\Copy-of-Hamlet-social`.
- **Checklist**
  - [ ] Women badge visibility
  - [ ] Filter buttons (governorate | party | gender)
  - [ ] Responsive behavior (across breakpoints)
  - [ ] Language toggles (Arabic | English | Kurdish)
  - [ ] Search bar performance
  - [ ] Social share buttons
  - [ ] Candidate contact methods
  - [ ] Dashboard statistics accuracy
- **Reporting** Log findings in `docs/daily-reports/YYYY-MM-DD-agent3.md`. For gaps or defects, add entries to `docs/agent-coordination/feature-requests.md` using the template below.

### Agent 5 – Quality Assurance Alignment
- **Test Matrix** Mirror Agent 3’s checklist in `docs/testing/qa-matrix.md` as regression tests.
- **Post-Audit Steps** After Agent 3 submits results:
  - Mark each item ✅ / ❌.
  - Capture one screenshot per failure.
  - Cross-reference issue IDs from `docs/agent-coordination/feature-requests.md`.

### Agent 2 – Backup Verification
- **Action** Execute `scripts/Backup.ps1` manually once.
- **Confirm**
  - Git commit and push completed.
  - `.zip` or `.7z` archive created in `E:\HamletUnified\backups\daily\`.
- **Log** Record timestamp and outcome in `docs/agent-coordination/backup-log.md`.
- **Schedule** Verify Task Scheduler entry for daily execution.

### Agent 1 – Social Media Intelligence
- **Dataset Expansion** Continue enriching `SocialMedia/Facebook_Targets.xlsx`.
- **Multi-Channel Prep** Add Twitter and Telegram sheets with columns: Name | Link | Members | Type | Contact | Notes.

### Agent 4 – Marketing Preparation
- **Content Drafting** Prepare bilingual (Arabic/English) pre-launch posts for Weeks 1–3 in `marketing/content-calendar.md`.
- **Asset Storage** Save visual assets under `marketing-assets/`; keep unpublished.

### Agent 6 – Documentation & Coordination
- **Status Tracking** Update `docs/agent-coordination/status.md` twice daily (09:00 and 18:00).
- **Consolidation** Append feature requests, QA outcomes, and Google AI Studio merge notes.
- **Repository Hygiene** Add deprecation notices to `hamlat-forntend-6-10` and `amlet-unified` once today’s backup is verified.

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

## Coordination Cadence
| Time  | Action                      | Responsible |
|-------|-----------------------------|-------------|
| 09:00 | Morning status sync         | Agent 6 → Director |
| 12:00 | Backup verification ping    | Agent 2 |
| 15:00 | Interim QA check            | Agent 5 |
| 18:00 | Daily recap commit + summary| Agent 6 |
| 20:00 | Director review + AI Studio submissions | Director |

## Current Status
- **Agents** All six active and authorized.
- **Audit** Agent 3 begins platform assessment immediately.
- **Parallel Workstreams** Agents 1, 2, 4, 5, 6 continue assigned tasks.
- **Escalation** Await Agent 3’s report before submitting new feature requests to Google AI Studio.
