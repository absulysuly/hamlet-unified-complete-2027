# One-Month Countdown Roadmap

## Mission Window
- **Duration:** 2025-10-14 → 2025-11-14
- **Objective:** Deliver production-ready Iraqi Election Platform with synchronized marketing, documentation, and oversight.

## Weekly Breakdown

### Week 1 (2025-10-14 → 2025-10-20)
| Agent | Focus | Key Deliverables | Dependencies |
|-------|-------|------------------|--------------|
| Agent 1 | Facebook/Twitter/Telegram intelligence | `SocialMedia/Facebook_Targets.xlsx` updated with tri-channel tabs and top 20 FB groups | None |
| Agent 2 | Backup baseline & verification | Manual `Backup.ps1` run logged in `docs/agent-coordination/backup-log.md`; Task Scheduler entry confirmed | None |
| Agent 3 | Platform stabilization sprint 1 | Tailwind migration off CDN, `.filter()` safeguards, initial UI audit (`docs/daily-reports/YYYY-MM-DD-agent3.md`) | Access to repo |
| Agent 4 | Marketing foundation setup | `marketing/content-calendar.md` Weeks 1–3 drafts, placeholder assets under `marketing-assets/` | Agent 3 screenshots once stable |
| Agent 5 | QA matrix & smoke tests | `docs/testing/qa-matrix.md` baseline mirroring Agent 3 checklist; smoke test notes | Agent 3 audit checklist |
| Agent 6 | Oversight activation & documentation | `docs/daily-reports/README.md`, `docs/agent-coordination/status.md` updates, `structure-report.md` maintenance | Director cadence |
| Director | Oversight validation | Director Note #1 draft, confirm “Oversight Sync – 2025-10-14” commits | Agent confirmations |

### Week 2 (2025-10-21 → 2025-10-27)
| Agent | Focus | Key Deliverables | Dependencies |
|-------|-------|------------------|--------------|
| Agent 1 | Audience segmentation | Prioritized outreach tiers, add engagement metrics in spreadsheet | Agent 6 data templates |
| Agent 2 | Automated backup cadence | Daily backup verification log, cloud mirror test | Successful Week 1 script run |
| Agent 3 | Platform stabilization sprint 2 | Women badge validation, language toggle QA, feature request submissions | Week 1 Tailwind fix |
| Agent 4 | Pre-launch asset refinement | Draft social copy for teaser campaign, bilingual email templates (`marketing/content-calendar.md`) | Agent 3 stable UI |
| Agent 5 | Regression suite build-out | Populate pass/fail columns, attach screenshot paths, align with feature requests | Agent 3 updates |
| Agent 6 | Documentation deep dive | Update deployment guide, maintain daily reports, prep Director Note #2 inputs | Director feedback |
| Director | Risk review | Cross-check backups vs. commits, confirm no deprecated repo usage | Agent logs |

### Week 3 (2025-10-28 → 2025-11-03)
| Agent | Focus | Key Deliverables | Dependencies |
|-------|-------|------------------|--------------|
| Agent 1 | Diaspora & influencer mapping | Add influencer contact sheet, Telegram broadcast candidates | Marketing calendar |
| Agent 2 | Restore drill | Perform restoration test from latest ZIP, document steps in `docs/agent-coordination/backup-log.md` | Stable backups |
| Agent 3 | Feature completion sprint | Implement remaining high-priority feature requests, validate dashboard stats | Director approvals |
| Agent 4 | Multi-platform readiness | Create platform explainer deck, asset localization (Arabic/Kurdish/English) | Agent 3 feature readiness |
| Agent 5 | Full regression cycle | Execute full test suite, log results and defects; prep go/no-go checklist | Stable build |
| Agent 6 | Reporting & knowledge base | Compile Director Note #3 inputs, update `docs/agent-coordination/status.md` twice daily | Agent reports |
| Director | Go-live gate prep | Evaluate QA outcomes, ensure oversight compliance before launch vote | Agent 5 results |

### Week 4 (2025-11-04 → 2025-11-14)
| Agent | Focus | Key Deliverables | Dependencies |
|-------|-------|------------------|--------------|
| Agent 1 | Launch targeting | Finalized outreach list, scheduling plan for FB/Twitter/Telegram posts | Director go-live decision |
| Agent 2 | Final backup validation | Confirm launch-day backup procedures, ensure offsite copy ready | Launch date |
| Agent 3 | Launch polish & support | Final bug fixes, production build validation, assist deployment | QA sign-off |
| Agent 4 | Launch communications | Final content calendar, press release drafts, candidate outreach templates | Director approval |
| Agent 5 | Launch monitoring | Real-time monitoring checklist, post-launch QA plan | Live platform |
| Agent 6 | Final documentation & transfer | Director Note #4, postmortem template, knowledge transfer packet | All agent deliverables |
| Director | Launch authorization | Issue final go/no-go, oversee launch execution | All green metrics |

## Daily Cadence Reminders
- **09:00** Agent 6 posts status summary to `docs/agent-coordination/status.md`.
- **12:00** Agent 2 confirms backup completion or flags issues.
- **15:00** Agent 5 posts interim QA check.
- **18:00** Agent 6 pushes daily recap commit.
- **20:00** Director reviews logs, prepares next directives.

## Critical Dependencies
- Successful Tailwind migration and `.filter()` fixes (Week 1) unlock accurate UI snapshots for marketing and QA.
- Agent 2’s verified backups underpin Director approvals; failures trigger immediate remediation.
- QA matrix updates must reference issue IDs in `docs/agent-coordination/feature-requests.md` for traceability.
- Marketing deployment remains on pause until Director issues Go-Live authorization in Week 4.
