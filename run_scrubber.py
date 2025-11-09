"""Command line interface for the IHEC Mega Scrubber."""
from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Iterable, List, Optional

from ihec_scrubber.auditor import sample_rows, validate_rows
from ihec_scrubber.config import ScrubberConfig, load_config
from ihec_scrubber.crawler import Crawler, RobotsDisallowedError
from ihec_scrubber.logger import ScrubberLogger
from ihec_scrubber.normalizer import make_dedupe_key
from ihec_scrubber.ocr_worker import OcrWorker
from ihec_scrubber.parser import Parser, TARGET_COLUMNS
from ihec_scrubber.storage import maybe_upload_to_s3, write_csv, write_json

OUTPUT_JSON = Path("output/polling_stations.json")
OUTPUT_CSV = Path("output/polling_stations.csv")
SAMPLE_JSON = Path("output/sample_erbil_sulaymaniyah.json")
SAMPLE_CSV = Path("output/sample_erbil_sulaymaniyah.csv")


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="IHEC Mega Scrubber")
    subparsers = parser.add_subparsers(dest="command", required=True)

    run_parser = subparsers.add_parser("run", help="Perform a full extraction run")
    _add_common_arguments(run_parser)
    run_parser.add_argument("--workers", type=int, default=4, help="Number of concurrent workers")
    run_parser.add_argument("--max-pages", type=int, default=None, help="Limit number of pages")

    dry_parser = subparsers.add_parser("dry-run", help="Fetch only the first page and validate")
    _add_common_arguments(dry_parser)
    dry_parser.add_argument("--max-pages", type=int, default=1)

    val_parser = subparsers.add_parser("validate-selectors", help="Validate table selectors without saving outputs")
    _add_common_arguments(val_parser)
    val_parser.add_argument("--max-pages", type=int, default=1)

    sample_parser = subparsers.add_parser("sample", help="Create sampling outputs for governorates")
    sample_parser.add_argument("--gov", action="append", required=True, help="Governorate name")
    sample_parser.add_argument("--n", action="append", type=int, required=True, help="Sample size per governorate")
    sample_parser.add_argument("--source", type=Path, default=OUTPUT_JSON, help="Source JSON file")

    ocr_parser = subparsers.add_parser("ocr", help="Run OCR over an images directory")
    ocr_parser.add_argument("--images-dir", type=Path, required=True, help="Directory of images/PDFs")
    ocr_parser.add_argument("--lang", default="ara+eng")

    return parser


def _add_common_arguments(sub: argparse.ArgumentParser) -> None:
    sub.add_argument("--base-url", dest="base_url", default=None)
    sub.add_argument("--offline-html", type=Path, default=None, help="Use a local HTML file instead of live requests")
    sub.add_argument("--idempotency-db", type=Path, default=None)


def load_runtime_config(args: argparse.Namespace) -> ScrubberConfig:
    overrides = {k: v for k, v in vars(args).items() if k in {"base_url", "offline_html", "idempotency_db"} and v is not None}
    cfg = load_config(**overrides)
    if args.command == "dry-run":
        cfg.dry_run = True
    if args.offline_html:
        cfg.offline_html = args.offline_html
    if args.idempotency_db:
        cfg.idempotency_db = args.idempotency_db
    cfg.max_workers = getattr(args, "workers", cfg.max_workers)
    return cfg


def execute_crawl(cfg: ScrubberConfig, *, max_pages: Optional[int], dry_run: bool) -> List[dict]:
    logger = ScrubberLogger(cfg.log_file)
    parser = Parser(cfg.base_url)
    crawler = Crawler(cfg, logger, parser)
    try:
        rows, meta = crawler.crawl(max_pages=max_pages, dry_run=dry_run)
    except RobotsDisallowedError as exc:
        logger.error("Robots.txt disallows crawling", error=str(exc))
        raise
    finally:
        crawler.close()
        logger.close()

    # Enrich metadata
    final_rows: List[dict] = []
    seen = set()
    for row in rows:
        row.setdefault("source_title", meta.get("source_title", ""))
        row.setdefault("source_date_iso", meta.get("source_date_iso", ""))
        key = row.get("dedupe_key") or make_dedupe_key(row)
        if key in seen:
            continue
        seen.add(key)
        final_rows.append(row)
    return final_rows


def command_run(args: argparse.Namespace) -> None:
    cfg = load_runtime_config(args)
    rows = execute_crawl(cfg, max_pages=getattr(args, "max_pages", None), dry_run=False)
    write_outputs(cfg, rows)


def command_dry_run(args: argparse.Namespace) -> None:
    cfg = load_runtime_config(args)
    rows = execute_crawl(cfg, max_pages=args.max_pages, dry_run=True)
    if not rows:
        raise SystemExit("Dry run did not parse any rows; selectors may need adjustment")
    validate_rows(rows)


def command_validate_selectors(args: argparse.Namespace) -> None:
    cfg = load_runtime_config(args)
    rows = execute_crawl(cfg, max_pages=args.max_pages, dry_run=True)
    if not rows:
        raise SystemExit("Selector validation failed: no rows parsed")
    headers_present = set(rows[0].keys())
    missing = [col for col in TARGET_COLUMNS if col not in headers_present]
    if missing:
        raise SystemExit(f"Missing expected columns: {missing}")


def command_sample(args: argparse.Namespace) -> None:
    data = json.loads(args.source.read_text(encoding="utf-8"))
    if len(args.gov) != len(args.n):
        raise SystemExit("Provide equal numbers of --gov and --n arguments")
    rows: List[dict] = []
    for gov, n in zip(args.gov, args.n):
        rows.extend(sample_rows(data, gov, n))
    write_json(SAMPLE_JSON, rows)
    write_csv(SAMPLE_CSV, rows)


def command_ocr(args: argparse.Namespace) -> None:
    worker = OcrWorker(language=args.lang)
    results = []
    for path in args.images_dir.glob("**/*"):
        if not path.is_file():
            continue
        result = worker.process_path(path)
        results.append({
            "path": str(path),
            "text": result.text,
            "confidence": result.confidence,
            "ocr_extracted": result.ocr_extracted,
        })
    output = args.images_dir / "ocr_results.json"
    output.write_text(json.dumps(results, ensure_ascii=False, indent=2), encoding="utf-8")


def write_outputs(cfg: ScrubberConfig, rows: List[dict]) -> None:
    write_json(OUTPUT_JSON, rows)
    write_csv(OUTPUT_CSV, rows)
    erbil = sample_rows(rows, "أربيل", 10)
    sulay = sample_rows(rows, "السليمانية", 10)
    write_json(SAMPLE_JSON, erbil + sulay)
    write_csv(SAMPLE_CSV, erbil + sulay)
    if cfg.s3_bucket:
        logger = ScrubberLogger(cfg.log_file)
        try:
            maybe_upload_to_s3(cfg.s3_bucket, [OUTPUT_JSON, OUTPUT_CSV, SAMPLE_JSON, SAMPLE_CSV], logger)
        finally:
            logger.close()


def main(argv: Optional[List[str]] = None) -> None:
    parser = build_parser()
    args = parser.parse_args(argv)
    if args.command == "run":
        command_run(args)
    elif args.command == "dry-run":
        command_dry_run(args)
    elif args.command == "validate-selectors":
        command_validate_selectors(args)
    elif args.command == "sample":
        command_sample(args)
    elif args.command == "ocr":
        command_ocr(args)
    else:
        parser.error(f"Unknown command {args.command}")


if __name__ == "__main__":
    main()
