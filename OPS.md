# Operations Guide

## Supervision Checklist
1. Confirm network access is permitted by reviewing `output/REQUIRES_PERMISSION` after the first run. If present, halt operations and obtain authorization.
2. Monitor `mega_executor.log` (JSONL) for HTTP status codes and retries.
3. Review `extraction_log.jsonl` to ensure each page yields rows. Zero-row entries in succession indicate a need for Selenium or manual review.
4. Check `needs_manual_review.json` if created. Assign follow-up to analysts.

## Re-running Failed Pages
- When Selenium captures additional pages, inspect `raw_pages/selenium_page_*.html` and re-run the parser with `python run_scrubber.py dry-run --offline-html raw_pages/selenium_page_X.html`.
- For incremental reruns, set `IHEC_IDEMPOTENCY_DB=./ids.db` to avoid reprocessing previously collected stations.

## Logs & Artifacts
- **Structured log:** `mega_executor.log`
- **Per-page metrics:** `extraction_log.jsonl`
- **Raw HTML:** `raw_pages/`
- **Exports:** `output/`

## Troubleshooting
- **429 / Rate Limit:** Increase `IHEC_RATE_LIMIT_SLEEP` or configure `IHEC_PROXY`.
- **Selenium Failure:** Ensure Chrome/Chromedriver installed, rerun with `python run_scrubber.py run --workers 2` to reduce load.
- **OCR Missing:** Install Tesseract binary and ensure it is on PATH.
