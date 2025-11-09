"""Arabic text normalization utilities for deduplication and storage."""
from __future__ import annotations

import hashlib
import re
import unicodedata
from typing import Dict, Iterable, Optional

ARABIC_INDIC_DIGITS = {
    "٠": "0",
    "١": "1",
    "٢": "2",
    "٣": "3",
    "٤": "4",
    "٥": "5",
    "٦": "6",
    "٧": "7",
    "٨": "8",
    "٩": "9",
}

EXTENDED_ARABIC_DIGITS = {
    "۰": "0",
    "۱": "1",
    "۲": "2",
    "۳": "3",
    "۴": "4",
    "۵": "5",
    "۶": "6",
    "۷": "7",
    "۸": "8",
    "۹": "9",
}

_WHITESPACE_RE = re.compile(r"\s+")
_CONTROL_CHARS = dict.fromkeys(c for c in range(32))


def normalize_digits(value: str) -> str:
    """Convert Arabic-Indic digits to ASCII digits."""
    if not value:
        return value
    translation_map = {ord(k): v for k, v in {**ARABIC_INDIC_DIGITS, **EXTENDED_ARABIC_DIGITS}.items()}
    return value.translate(translation_map)


def strip_diacritics(value: str) -> str:
    """Remove optional Arabic diacritics to improve matching."""
    decomposed = unicodedata.normalize("NFD", value)
    filtered = "".join(ch for ch in decomposed if unicodedata.category(ch) != "Mn")
    return unicodedata.normalize("NFC", filtered)


def collapse_whitespace(value: str) -> str:
    if not value:
        return value
    value = value.strip()
    value = _WHITESPACE_RE.sub(" ", value)
    return value


def normalize_text(value: Optional[str], *, remove_diacritics: bool = False) -> str:
    if value is None:
        return ""
    normalized = normalize_digits(value)
    normalized = normalized.translate(_CONTROL_CHARS)
    normalized = collapse_whitespace(normalized)
    if remove_diacritics:
        normalized = strip_diacritics(normalized)
    return normalized


def sha1_hash(parts: Iterable[str]) -> str:
    digest = hashlib.sha1()
    for part in parts:
        digest.update(part.encode("utf-8"))
        digest.update(b"|")
    return digest.hexdigest()


def make_dedupe_key(row: Dict[str, str]) -> str:
    """Create a deterministic SHA1 key for a polling station row."""
    gov = normalize_text(row.get("اسم المحافظة", ""), remove_diacritics=True)
    station = row.get("رقم مركز الاقتراع") or row.get("اسم مركز الاقتراع الفعلي") or ""
    station = normalize_text(station, remove_diacritics=True)
    return sha1_hash([gov, station])


__all__ = [
    "normalize_digits",
    "normalize_text",
    "strip_diacritics",
    "collapse_whitespace",
    "make_dedupe_key",
    "ARABIC_INDIC_DIGITS",
    "EXTENDED_ARABIC_DIGITS",
]
