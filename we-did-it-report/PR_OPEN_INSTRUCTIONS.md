# PR Open Instructions (exact commands)

Use the following once the branch is pushed to origin we-did-it-report.

A) Create PR with GitHub CLI (recommended)
- Bash:
  # login if not already: gh auth login
  gh pr create --base main --head we-did-it-report --title "we-did-it: Unified Hamlet reconciliation + deployment bundle" --body-file we-did-it-report/PR_BODY.md --label "reconciliation" --assignee @me

- PowerShell:
  # login if not already: gh auth login
  gh pr create --base main --head we-did-it-report --title "we-did-it: Unified Hamlet reconciliation + deployment bundle" --body-file we-did-it-report/PR_BODY.md --label "reconciliation" --assignee @me

B) Create PR via web UI
- Open:
  https://github.com/<owner>/<repo>/pull/new/we-did-it-report
- Replace <owner>/<repo> with your repo path (e.g., absulysuly/hamlet-unified-complete-2027).
- Choose the template: we-did-it-report/PR_TEMPLATE.md (if GitHub UI presents it), or paste contents of we-did-it-report/PR_BODY.md.

C) If you want the PR description to include COMPLETION_REPORT.md
- If COMPLETION_REPORT.md is present in the branch, the GitHub web UI will allow attaching it; with `gh` you can:
  gh pr create --base main --head we-did-it-report --title "we-did-it: Unified Hamlet reconciliation + deployment bundle" --body-file we-did-it-report/COMPLETION_REPORT.md --label "reconciliation"

D) Attach reviewers & labels
- Via gh:
  gh pr edit --add-reviewer username1 --add-reviewer username2 --add-label "reconciliation" --add-label "ready"
- Or use GitHub UI to assign teams and reviewers.

E) After opening PR
- Add a short comment tagging reviewers and include the reviewer checklist link:
  gh pr comment <pr-number> --body "Review steps: we-did-it-report/REVIEWER_CHECKLIST.md"

If you want me to open the PR for you
- Push the branch, then reply "create PR" and confirm the repository is absulysuly/hamlet-unified-complete-2027 and the branch we-did-it-report is on origin. I will open the PR and use we-did-it-report/COMPLETION_REPORT.md as the PR body if it exists; otherwise I'll use we-did-it-report/PR_BODY.md.
