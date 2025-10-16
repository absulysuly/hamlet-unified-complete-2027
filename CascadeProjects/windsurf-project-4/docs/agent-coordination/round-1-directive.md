# Directorate Bulletin – Unified Operations Cycle (Round 1)

## Mission Focus (Week 1)
- **Platform validation** Identify and log UI/UX or data gaps for Google AI Studio follow-up.
- **Backup verification** Confirm all code merges and daily archives are secured.
- **Social-media intelligence** Map Facebook, Twitter, and Telegram ecosystems for outreach readiness.

## Immediate Agent Actions
### Agent 3 – Platform Assessment (Primary)
- **Location** `E:\HamletUnified\Copy-of-Hamlet-social`
- **Audit window** 30 minutes
- **Checklist**
  - [ ] Women badge visibility
  - [ ] Filter buttons (governorate | party | gender)
  - [ ] Responsive behavior across breakpoints
  - [ ] Language toggles (Arabic | English | Kurdish)
  - [ ] Search bar performance
  - [ ] Social share buttons
  - [ ] Candidate contact methods
  - [ ] Statistics dashboard accuracy
- **Reporting** Record findings in `docs/daily-reports/YYYY-MM-DD-agent3.md`.
- **Escalation** For gaps, open entries in `docs/agent-coordination/feature-requests.md` using the template below.

### Agent 5 – Quality Assurance Alignment
- **Regression log** Mirror Agent 3 checklist in `docs/testing/qa-matrix.md`.
- **Post-audit tasks**
  - Mark each item ✅ / ❌.
  - Attach one screenshot per failure.
  - Reference issue IDs from the feature request log.

### Agent 2 – Backup Verification
- **Script** Run `scripts/Backup.ps1` manually once.
- **Validation** Confirm Git commit/push and `.zip` or `.7z` archive under `E:\HamletUnified\backups\daily\`.
- **Logging** Note timestamp and outcome in `docs/agent-coordination/backup-log.md`.
- **Automation** Verify Task Scheduler entry for daily execution.

### Agent 1 – Social Media Intelligence
- **Dataset expansion** Continue `SocialMedia/Facebook_Targets.xlsx`.
- **Additional channels** Add Twitter and Telegram sheets with columns: Name, Link, Members, Type, Contact, Notes.

### Agent 4 – Marketing Preparation
- **Content drafting** Produce bilingual Week 1-3 posts in `marketing/content-calendar.md`.
- **Asset storage** Place visuals under `marketing-assets/` (hold publication).

### Agent 6 – Documentation & Coordination
- **Status updates** Maintain `docs/agent-coordination/status.md` at 09:00 and 18:00 daily.
- **Change log** Append feature requests, QA results, and Google AI Studio merges.
- **Deprecation** After today’s backup verification, update `hamlat-forntend-6-10` and `amlet-unified` README files to point to the main repository.

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
| Time  | Action                          | Responsible |
|-------|---------------------------------|-------------|
| 09:00 | Morning status sync             | Agent 6 → Director |
| 12:00 | Backup verification ping        | Agent 2    |
| 15:00 | Interim QA check                | Agent 5    |
| 18:00 | Daily recap commit + summary    | Agent 6    |
| 20:00 | Director review + AI submissions| Director   |

## Current Status
- **Agents active** All six agents are engaged and authorized.
- **Primary focus** Agent 3 begins platform audit immediately.
- **Parallel execution** Agents 1, 2, 4, 5, and 6 continue assigned streams.
- **Escalation rule** Await Agent 3’s report before forwarding new feature requests to Google AI Studio.
