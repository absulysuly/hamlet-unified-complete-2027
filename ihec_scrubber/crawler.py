"""Crawler implementation for the IHEC Mega Scrubber."""
from __future__ import annotations

import json
import sqlite3
import time
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, Iterable, List, Optional, Tuple
from urllib.parse import urljoin, urlparse
from urllib import robotparser

try:  # pragma: no cover - requests preferred
    import requests
except Exception:  # pragma: no cover - fallback for offline testing
    import types
    from urllib import request as urllib_request

    class _Response:
        def __init__(self, status_code: int, text: str) -> None:
            self.status_code = status_code
            self.text = text

    class RequestException(Exception):
        pass

    class _Session:
        def __init__(self) -> None:
            self.headers: Dict[str, str] = {}
            self.proxies: Dict[str, str] = {}

        def get(self, url: str, timeout: int = 60):
            req = urllib_request.Request(url, headers=self.headers)
            try:
                with urllib_request.urlopen(req, timeout=timeout) as resp:  # type: ignore[attr-defined]
                    text = resp.read().decode("utf-8", errors="replace")
                    return _Response(resp.getcode(), text)
            except Exception as exc:  # pragma: no cover - network failure path
                raise RequestException(str(exc))

        def close(self) -> None:
            return None

    requests = types.SimpleNamespace(Session=_Session, RequestException=RequestException)  # type: ignore

from .config import ScrubberConfig
from .logger import ScrubberLogger
from .parser import Parser, ParserResult
from .selenium_fallback import SeleniumFallback
from .storage import append_extraction_log


@dataclass
class PageFetchResult:
    url: str
    status_code: int
    content: str
    raw_path: Path


class RobotsDisallowedError(RuntimeError):
    pass


class IdempotencyStore:
    def __init__(self, db_path: Path) -> None:
        self.db_path = db_path
        self.db_path.parent.mkdir(parents=True, exist_ok=True)
        self._conn = sqlite3.connect(self.db_path)
        self._conn.execute("CREATE TABLE IF NOT EXISTS seen (id TEXT PRIMARY KEY)")
        self._conn.commit()

    def has(self, key: str) -> bool:
        cur = self._conn.execute("SELECT 1 FROM seen WHERE id = ?", (key,))
        return cur.fetchone() is not None

    def add(self, key: str) -> None:
        self._conn.execute("INSERT OR IGNORE INTO seen(id) VALUES (?)", (key,))
        self._conn.commit()

    def close(self) -> None:
        self._conn.close()


class Crawler:
    def __init__(self, config: ScrubberConfig, logger: ScrubberLogger, parser: Parser) -> None:
        self.config = config
        self.logger = logger
        self.parser = parser
        self.session = requests.Session()
        self.session.headers.update({
            "User-Agent": self.config.user_agent,
            "Accept-Language": "ar,en;q=0.8",
        })
        if self.config.proxy:
            self.session.proxies = {
                "http": self.config.proxy,
                "https": self.config.proxy,
            }
        self.idempotency: Optional[IdempotencyStore] = None
        if self.config.idempotency_db:
            self.idempotency = IdempotencyStore(self.config.idempotency_db)
        self.selenium = SeleniumFallback(logger)
        self._robots_checked = False

    def close(self) -> None:
        if self.idempotency:
            self.idempotency.close()
        self.session.close()

    # Public API ------------------------------------------------------------
    def crawl(self, *, max_pages: Optional[int] = None, dry_run: bool = False) -> Tuple[List[dict], Dict[str, str]]:
        self._ensure_robots_allowed()
        rows: List[dict] = []
        meta: Dict[str, str] = {}
        zero_count = 0
        page_index = 1
        next_url: Optional[str] = self.config.base_url
        needs_manual: List[dict] = []

        while next_url and (max_pages is None or page_index <= max_pages):
            fetch_result = self._fetch_page(next_url, page_index)
            if fetch_result is None:
                break
            parser_result = self.parser.parse(fetch_result.content, fetch_result.url)
            if parser_result.page_title and "source_title" not in meta:
                meta["source_title"] = parser_result.page_title
            if parser_result.source_date_iso and "source_date_iso" not in meta:
                meta["source_date_iso"] = parser_result.source_date_iso

            extracted_rows = self._process_rows(parser_result.rows)
            rows.extend(extracted_rows)
            zero_count = 0 if extracted_rows else zero_count + 1

            append_extraction_log(
                self.config.extraction_log,
                {
                    "url": fetch_result.url,
                    "status_code": fetch_result.status_code,
                    "rows": len(extracted_rows),
                    "raw_path": str(fetch_result.raw_path),
                },
            )

            if dry_run:
                break

            if zero_count >= 3:
                self.logger.warning("Three consecutive empty pages detected; invoking Selenium fallback")
                fallback_paths = self._selenium_recovery()
                if fallback_paths:
                    self.logger.info("Selenium fallback captured %s pages", len(fallback_paths))
                else:
                    needs_manual.append({
                        "start_url": fetch_result.url,
                        "reason": "Empty pages detected",
                        "raw_path": str(fetch_result.raw_path),
                    })
                    break

            next_url = self._resolve_next_url(parser_result.next_page_url, fetch_result.url)
            if next_url == fetch_result.url:
                self.logger.warning("Next page requires JavaScript interaction; attempting Selenium fallback")
                fallback_paths = self._selenium_recovery()
                if fallback_paths:
                    self.logger.info("Selenium fallback captured %s pages", len(fallback_paths))
                else:
                    needs_manual.append({
                        "start_url": fetch_result.url,
                        "reason": "Pagination blocked",
                        "raw_path": str(fetch_result.raw_path),
                    })
                    break

            page_index += 1

        if needs_manual:
            path = self.config.output_dir / "needs_manual_review.json"
            path.write_text(json.dumps(needs_manual, ensure_ascii=False, indent=2), encoding="utf-8")

        return rows, meta

    # Internal helpers ------------------------------------------------------
    def _ensure_robots_allowed(self) -> None:
        if self._robots_checked or self.config.offline_html:
            return
        robots_url = urljoin(self.config.base_url, "/robots.txt")
        rp = robotparser.RobotFileParser()
        rp.set_url(robots_url)
        try:
            rp.read()
        except Exception as exc:
            self.logger.warning("Failed to read robots.txt; proceeding with caution", error=str(exc))
            self._robots_checked = True
            return
        path = urlparse(self.config.base_url).path or "/"
        if not rp.can_fetch(self.config.user_agent, path):
            status_path = self.config.output_dir / "REQUIRES_PERMISSION"
            status_path.write_text(
                json.dumps(
                    {
                        "status": "REQUIRES_PERMISSION",
                        "robots_url": robots_url,
                        "path": path,
                    },
                    ensure_ascii=False,
                    indent=2,
                ),
                encoding="utf-8",
            )
            raise RobotsDisallowedError(f"Robots.txt disallows crawling {path}")
        self._robots_checked = True

    def _fetch_page(self, url: str, page_index: int) -> Optional[PageFetchResult]:
        if self.config.offline_html:
            html = self.config.offline_html.read_text(encoding="utf-8")
            raw_path = self.config.raw_dir / f"offline_page_{page_index}.html"
            raw_path.write_text(html, encoding="utf-8")
            return PageFetchResult(url=str(self.config.offline_html), status_code=200, content=html, raw_path=raw_path)

        attempt = 0
        backoff = self.config.rate_limit_sleep
        while attempt < 5:
            attempt += 1
            response = None
            try:
                response = self.session.get(url, timeout=60)
            except requests.RequestException as exc:
                self.logger.error("Request failed", url=url, error=str(exc), attempt=attempt)
                time.sleep(backoff)
                backoff *= self.config.backoff_factor
                continue

            status = response.status_code
            if status == 429:
                self.logger.warning("Rate limited", url=url, attempt=attempt)
                time.sleep(backoff)
                backoff *= self.config.backoff_factor
                continue
            if status >= 500:
                self.logger.warning("Server error", url=url, status=status, attempt=attempt)
                time.sleep(backoff)
                backoff *= self.config.backoff_factor
                continue
            html = response.text
            self.logger.info("Fetched page", url=url, status=status, page=page_index)
            raw_path = self.config.raw_dir / f"page_{page_index}.html"
            raw_path.write_text(html, encoding="utf-8")
            return PageFetchResult(url=url, status_code=status, content=html, raw_path=raw_path)
        self.logger.error("Failed to fetch page after retries", url=url)
        return None

    def _process_rows(self, rows: Iterable[dict]) -> List[dict]:
        processed: List[dict] = []
        for row in rows:
            if self.idempotency and row.get("dedupe_key"):
                if self.idempotency.has(row["dedupe_key"]):
                    continue
                self.idempotency.add(row["dedupe_key"])
            processed.append(row)
        return processed

    def _resolve_next_url(self, next_url: Optional[str], current_url: str) -> Optional[str]:
        if not next_url:
            return None
        if next_url.startswith("http"):
            return next_url
        return urljoin(current_url, next_url)

    def _selenium_recovery(self) -> List[Path]:
        if not self.config.selenium_enabled:
            self.logger.warning("Selenium disabled in configuration")
            return []
        return list(self.selenium.collect_pages(self.config.base_url, self.config.raw_dir))


__all__ = ["Crawler", "RobotsDisallowedError"]
