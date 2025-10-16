# Round 1 Directive – Unified Operations Cycle (Week 1)

## Mission Focus (Week 1)
- **Platform validation** Identify and log all UI/UX or data gaps for Google AI Studio follow-up.
- **Backup verification** Confirm all code, AI Studio merges, and daily archives are secured.
- **Social-media intelligence** Continue mapping Facebook, Twitter, and Telegram ecosystems for eventual outreach.

## Immediate Agent Actions
### Agent 3 – Platform Assessment (Primary)
- **Repository:** `E:\HamletUnified\Copy-of-Hamlet-social`
- **Audit checklist:**
  - [ ] Women badge visibility
  - [ ] Filter buttons (governorate | party | gender)
  - [ ] Responsive behavior (desktop, tablet, mobile)
  - [ ] Language toggles (Arabic | English | Kurdish)
  - [ ] Search bar performance
  - [ ] Social share buttons
  - [ ] Candidate contact methods
  - [ ] Dashboard statistics accuracy
- **Reporting:** Record findings in `docs/daily-reports/YYYY-MM-DD-agent3.md`.
- **Escalation:** For missing/broken elements, add entries to `docs/agent-coordination/feature-requests.md` using the template below.

### Agent 5 – Quality Assurance Alignment
- Mirror Agent 3’s checklist as regression tests in `docs/testing/qa-matrix.md`.
- After Agent 3 submits results:
  - Mark each item ✅ / ❌.
  - Capture one screenshot per failure.
  - Cross-reference issue IDs from the feature-request log.

### Agent 2 – Backup Verification
- Execute `scripts/Backup.ps1` manually once.
- Confirm:
  - Git commit + push completed.
  - Archive created in `E:\HamletUnified\backups\daily\`.
- Record timestamp and outcome in `docs/agent-coordination/backup-log.md`.
- Verify Task Scheduler entry for daily execution.

### Agent 1 – Social Media Intelligence
- Continue expanding `SocialMedia/Facebook_Targets.xlsx`.
- Add Twitter and Telegram sheets with columns: `Name`, `Link`, `Members`, `Type`, `Contact`, `Notes`.

### Agent 4 – Marketing Preparation
- Draft bilingual (Arabic/English) pre-launch posts for Weeks 1–3 in `marketing/content-calendar.md`.
- Store draft visual assets under `marketing-assets/`. Do **not** publish.

### Agent 6 – Documentation & Coordination
- Update `docs/agent-coordination/status.md` twice daily (09:00 / 18:00 reports).
- Append new feature requests, test outcomes, and AI Studio merges.
- Once today’s backup is verified, add deprecation notices to `hamlat-forntend-6-10` and `amlet-unified` repositories.

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
| Time | Action | Responsible |
|------|--------|-------------|
| 09:00 | Morning status sync | Agent 6 → Director |
| 12:00 | Backup verification ping | Agent 2 |
| 15:00 | Interim QA check | Agent 5 |
| 18:00 | Daily recap commit + summary | Agent 6 |
| 20:00 | Director review + AI Studio submissions | Director |

## Current Status
- **Agents 1–6:** Active and authorized.
- **Agent 3:** Begin platform audit immediately.
- **Parallel Operations:** Agents 1, 2, 4, 5, 6 continue assigned tasks.
- **Next Milestone:** Await Agent 3 report before forwarding new feature requests to Google AI Studio.
