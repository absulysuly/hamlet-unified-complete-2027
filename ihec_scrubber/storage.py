"""Output helpers for persisting scraping results."""
from __future__ import annotations

import csv
import json
from pathlib import Path
from typing import Iterable, List, Sequence

from .logger import ScrubberLogger


def write_json(path: Path, rows: Sequence[dict]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as fh:
        json.dump(list(rows), fh, ensure_ascii=False, indent=2)


def write_csv(path: Path, rows: Sequence[dict]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    if not rows:
        path.write_text("", encoding="utf-8")
        return
    header = sorted(rows[0].keys())
    with path.open("w", encoding="utf-8", newline="") as fh:
        writer = csv.DictWriter(fh, fieldnames=header)
        writer.writeheader()
        for row in rows:
            writer.writerow(row)


def append_extraction_log(path: Path, payload: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("a", encoding="utf-8") as fh:
        fh.write(json.dumps(payload, ensure_ascii=False) + "\n")


def maybe_upload_to_s3(bucket: str, files: Iterable[Path], logger: ScrubberLogger) -> None:
    try:
        import boto3  # type: ignore
    except Exception:  # pragma: no cover - optional dependency
        logger.warning("S3 upload skipped; boto3 not available", bucket=bucket)
        return

    session = boto3.session.Session()
    s3 = session.client("s3")
    for file_path in files:
        key = file_path.name
        logger.info("Uploading file to S3", bucket=bucket, key=key)
        s3.upload_file(str(file_path), bucket, key)


__all__ = ["write_json", "write_csv", "append_extraction_log", "maybe_upload_to_s3"]
