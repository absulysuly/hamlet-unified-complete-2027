"""QA helpers for the IHEC Mega Scrubber."""
from __future__ import annotations

from collections import defaultdict
from typing import Dict, Iterable, List, Sequence

from .normalizer import normalize_text


def validate_rows(rows: Sequence[dict]) -> Dict[str, int]:
    """Return summary counts for quality assurance."""
    issues = defaultdict(int)
    for row in rows:
        if not row.get("اسم المحافظة"):
            issues["missing_governorate"] += 1
        if not row.get("رقم مركز الاقتراع") and not row.get("اسم مركز الاقتراع الفعلي"):
            issues["missing_station_identifier"] += 1
    return dict(issues)


def filter_by_governorate(rows: Iterable[dict], governorate: str) -> List[dict]:
    target = normalize_text(governorate, remove_diacritics=True)
    results = []
    for row in rows:
        gov = normalize_text(row.get("اسم المحافظة", ""), remove_diacritics=True)
        if gov == target:
            results.append(row)
    return results


def sample_rows(rows: Iterable[dict], governorate: str, n: int) -> List[dict]:
    selected = filter_by_governorate(rows, governorate)
    return selected[:n]


__all__ = ["validate_rows", "filter_by_governorate", "sample_rows"]
