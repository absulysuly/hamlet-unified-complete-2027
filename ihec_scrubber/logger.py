"""Structured logging utilities for the IHEC Mega Scrubber."""
from __future__ import annotations

import json
import logging
import sys
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict


def _utcnow_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


@dataclass
class ScrubberLogger:
    """A lightweight structured logger that writes newline-delimited JSON."""

    log_file: Path

    def __post_init__(self) -> None:
        self.log_file.parent.mkdir(parents=True, exist_ok=True)
        self._log_file_handle = self.log_file.open("a", encoding="utf-8")
        logging.basicConfig(
            level=logging.INFO,
            format="%(asctime)s - %(levelname)s - %(message)s",
            handlers=[logging.StreamHandler(sys.stdout)],
        )
        self._logger = logging.getLogger("ihec_scrubber")

    def _write_json_line(self, payload: Dict[str, Any]) -> None:
        payload.setdefault("timestamp", _utcnow_iso())
        self._log_file_handle.write(json.dumps(payload, ensure_ascii=False) + "\n")
        self._log_file_handle.flush()

    def info(self, message: str, **context: Any) -> None:
        record = {"level": "INFO", "message": message, **context}
        self._write_json_line(record)
        self._logger.info("%s %s", message, context if context else "")

    def warning(self, message: str, **context: Any) -> None:
        record = {"level": "WARNING", "message": message, **context}
        self._write_json_line(record)
        self._logger.warning("%s %s", message, context if context else "")

    def error(self, message: str, **context: Any) -> None:
        record = {"level": "ERROR", "message": message, **context}
        self._write_json_line(record)
        self._logger.error("%s %s", message, context if context else "")

    def close(self) -> None:
        try:
            self._log_file_handle.close()
        except Exception:  # pragma: no cover - best effort
            pass


__all__ = ["ScrubberLogger"]
