"""Configuration utilities for the IHEC Mega Scrubber."""
from __future__ import annotations

import json
import os
from dataclasses import dataclass
from pathlib import Path
from typing import Optional

try:
    from dotenv import load_dotenv  # type: ignore
except Exception:  # pragma: no cover - optional dependency
    load_dotenv = None


DEFAULT_USER_AGENT = "HamletElectionAgent/1.0 (+https://DigitalDemocracy.Iraq)"


@dataclass
class ScrubberConfig:
    """Runtime configuration loaded from environment variables and CLI flags."""

    base_url: str = "https://ihec.iq/13735-2/"
    raw_dir: Path = Path("raw_pages")
    output_dir: Path = Path("output")
    log_file: Path = Path("mega_executor.log")
    extraction_log: Path = Path("extraction_log.jsonl")
    max_workers: int = 4
    user_agent: str = DEFAULT_USER_AGENT
    rate_limit_sleep: float = 1.5
    backoff_factor: float = 1.75
    selenium_enabled: bool = True
    proxy: Optional[str] = None
    s3_bucket: Optional[str] = None
    idempotency_db: Optional[Path] = None
    offline_html: Optional[Path] = None
    dry_run: bool = False

    def ensure_directories(self) -> None:
        """Create required directories if they do not exist."""
        self.raw_dir.mkdir(parents=True, exist_ok=True)
        self.output_dir.mkdir(parents=True, exist_ok=True)
        self.log_file.parent.mkdir(parents=True, exist_ok=True)
        self.extraction_log.parent.mkdir(parents=True, exist_ok=True)
        if self.idempotency_db:
            self.idempotency_db.parent.mkdir(parents=True, exist_ok=True)


def _load_env_file() -> None:
    """Load an optional .env file located in the project root."""
    if load_dotenv is None:
        return
    # Attempt to load from current working directory or parent.
    cwd = Path.cwd()
    candidates = [cwd / ".env", cwd.parent / ".env"]
    for candidate in candidates:
        if candidate.exists():
            load_dotenv(candidate)  # type: ignore[misc]
            break


def load_config(**overrides: object) -> ScrubberConfig:
    """Build a :class:`ScrubberConfig` from environment variables and overrides."""

    _load_env_file()

    cfg = ScrubberConfig()
    cfg.base_url = str(overrides.get("base_url") or os.getenv("IHEC_BASE_URL", cfg.base_url))
    cfg.raw_dir = Path(overrides.get("raw_dir") or os.getenv("IHEC_RAW_DIR", cfg.raw_dir))
    cfg.output_dir = Path(overrides.get("output_dir") or os.getenv("IHEC_OUTPUT_DIR", cfg.output_dir))
    cfg.log_file = Path(overrides.get("log_file") or os.getenv("IHEC_LOG_FILE", cfg.log_file))
    cfg.extraction_log = Path(
        overrides.get("extraction_log") or os.getenv("IHEC_EXTRACTION_LOG", cfg.extraction_log)
    )
    cfg.max_workers = int(overrides.get("max_workers") or os.getenv("IHEC_MAX_WORKERS", cfg.max_workers))
    cfg.user_agent = str(overrides.get("user_agent") or os.getenv("IHEC_USER_AGENT", cfg.user_agent))
    cfg.rate_limit_sleep = float(
        overrides.get("rate_limit_sleep") or os.getenv("IHEC_RATE_LIMIT_SLEEP", cfg.rate_limit_sleep)
    )
    cfg.backoff_factor = float(
        overrides.get("backoff_factor") or os.getenv("IHEC_BACKOFF_FACTOR", cfg.backoff_factor)
    )
    proxy = overrides.get("proxy") or os.getenv("IHEC_PROXY")
    cfg.proxy = str(proxy) if proxy else None
    s3_bucket = overrides.get("s3_bucket") or os.getenv("IHEC_S3_BUCKET")
    cfg.s3_bucket = str(s3_bucket) if s3_bucket else None
    idempotency_db = overrides.get("idempotency_db") or os.getenv("IHEC_IDEMPOTENCY_DB")
    cfg.idempotency_db = Path(idempotency_db) if idempotency_db else None
    offline_html = overrides.get("offline_html") or os.getenv("IHEC_OFFLINE_HTML")
    cfg.offline_html = Path(offline_html) if offline_html else None
    dry_run = overrides.get("dry_run") or os.getenv("IHEC_DRY_RUN")
    cfg.dry_run = bool(json.loads(str(dry_run).lower())) if isinstance(dry_run, str) else bool(dry_run)

    cfg.ensure_directories()
    return cfg


__all__ = ["ScrubberConfig", "load_config", "DEFAULT_USER_AGENT"]
