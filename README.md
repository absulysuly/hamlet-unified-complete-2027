# IHEC Mega Scrubber

The **IHEC Mega Scrubber** collects polling-station tables from [https://ihec.iq/13735-2/](https://ihec.iq/13735-2/) and exports normalized results in JSON and CSV formats with sampling support for أربيل and السليمانية.

## Features
- Robots.txt enforcement with `REQUIRES_PERMISSION` safeguard.
- Resilient HTTP crawler with rate limiting, retries, and Selenium fallback for JavaScript pagination.
- OCR (pytesseract/pdf2image) support for embedded images and PDFs.
- Arabic normalization, Arabic-Indic digit conversion, deterministic SHA1 dedupe keys.
- Structured logging (`mega_executor.log`) plus per-page `extraction_log.jsonl`.
- Sampling command for targeted QA outputs.

## Installation

### Windows PowerShell
```powershell
python -m venv .venv
.venv\\Scripts\\Activate.ps1
pip install -r requirements.txt
```

### Linux / macOS
```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Running

### Dry Run (first page only)
```bash
python run_scrubber.py dry-run
```

### Full Extraction
```bash
python run_scrubber.py run --workers 4
```

### Selector Validation
```bash
python run_scrubber.py validate-selectors
```

### Sampling (custom governorates)
```bash
python run_scrubber.py sample --gov "أربيل" --n 10 --gov "السليمانية" --n 10
```

### OCR Utility
```bash
python run_scrubber.py ocr --images-dir images/
```

## Environment Variables
| Variable | Description | Default |
| --- | --- | --- |
| `IHEC_BASE_URL` | Override the starting URL | `https://ihec.iq/13735-2/` |
| `IHEC_USER_AGENT` | Custom user agent string | `HamletElectionAgent/1.0 (+https://DigitalDemocracy.Iraq)` |
| `IHEC_MAX_WORKERS` | Maximum HTTP workers | `4` |
| `IHEC_PROXY` | Optional HTTP/HTTPS proxy | _unset_ |
| `IHEC_RAW_DIR` | Directory for raw HTML pages | `raw_pages/` |
| `IHEC_OUTPUT_DIR` | Directory for exports | `output/` |
| `IHEC_EXTRACTION_LOG` | Extraction log path | `extraction_log.jsonl` |
| `IHEC_S3_BUCKET` | Upload outputs to S3 | _unset_ |
| `IHEC_IDEMPOTENCY_DB` | SQLite DB for incremental dedupe | _unset_ |

## Outputs
- `output/polling_stations.json`
- `output/polling_stations.csv`
- `output/sample_erbil_sulaymaniyah.json`
- `output/sample_erbil_sulaymaniyah.csv`
- `extraction_log.jsonl`
- Raw HTML snapshots in `raw_pages/`

## Error Codes / Status Files
- `REQUIRES_PERMISSION`: Created when robots.txt disallows crawling. Delete after securing permission.
- `needs_manual_review.json`: Lists pages requiring human review (e.g., Selenium failure).

## Tests
```bash
pytest
```

Sample test uses `tests/fixtures/sample_page_1.html` to validate parsing logic.

