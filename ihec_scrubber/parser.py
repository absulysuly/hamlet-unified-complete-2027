"""HTML parsing utilities for extracting polling station data."""
from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Any, Dict, Iterable, List, Optional, Union

try:  # pragma: no cover - bs4 is optional for runtime but preferred
    from bs4 import BeautifulSoup  # type: ignore
except Exception:  # pragma: no cover
    BeautifulSoup = None  # type: ignore

from html.parser import HTMLParser


class _MiniNode:
    def __init__(self, tag: Optional[str], attrs: Optional[dict] = None, parent: Optional["_MiniNode"] = None) -> None:
        self.tag = tag
        self.attrs = attrs or {}
        self.parent = parent
        self.children: List[_MiniNode] = []
        self._text_parts: List[str] = []

    def add_child(self, child: "_MiniNode") -> None:
        self.children.append(child)

    def add_text(self, text: str) -> None:
        if text:
            self._text_parts.append(text)

    def get_text(self, separator: str = " ", strip: bool = False) -> str:
        parts = list(self._text_parts)
        for child in self.children:
            parts.append(child.get_text(separator=separator, strip=strip))
        text = separator.join(part for part in parts if part)
        return text.strip() if strip else text

    def find_all(self, tag: Optional[Union[str, Iterable[str]]] = None) -> List["_MiniNode"]:
        results: List[_MiniNode] = []
        tag_set: Optional[set] = None
        if isinstance(tag, (list, tuple, set)):
            tag_set = set(tag)
        elif tag is not None:
            tag_set = {tag}
        for child in self.children:
            if tag_set is None or child.tag in tag_set:
                results.append(child)
            results.extend(child.find_all(tag))
        return results

    def find(self, tag: str, attrs: Optional[dict] = None) -> Optional["_MiniNode"]:
        for node in self.find_all(tag):
            if attrs:
                if all(node.attrs.get(k) == v for k, v in attrs.items()):
                    return node
            else:
                return node
        return None

    def get(self, key: str, default: Optional[str] = None):
        value = self.attrs.get(key)
        if isinstance(value, list):
            return value
        return value if value is not None else default

    def has_attr(self, key: str) -> bool:
        return key in self.attrs

    def __getitem__(self, key: str) -> str:
        return self.attrs[key]


class _MiniSoup(HTMLParser):
    def __init__(self, html: str) -> None:
        super().__init__()
        self.root = _MiniNode(tag=None)
        self.stack: List[_MiniNode] = [self.root]
        self.feed(html)

    def handle_starttag(self, tag: str, attrs) -> None:  # type: ignore[override]
        attr_dict: Dict[str, str] = {key: value for key, value in attrs}
        node = _MiniNode(tag, attr_dict, parent=self.stack[-1])
        self.stack[-1].add_child(node)
        self.stack.append(node)

    def handle_endtag(self, tag: str) -> None:  # type: ignore[override]
        while len(self.stack) > 1:
            node = self.stack.pop()
            if node.tag == tag:
                break

    def handle_data(self, data: str) -> None:  # type: ignore[override]
        self.stack[-1].add_text(data)

    def find_all(self, tag: Union[str, Iterable[str]]) -> List[_MiniNode]:
        return self.root.find_all(tag)

    def find(self, tag: str, attrs: Optional[dict] = None) -> Optional[_MiniNode]:
        return self.root.find(tag, attrs)

    @property
    def title(self) -> Optional[_MiniNode]:
        return self.find("title")


def _build_soup(html: str):
    if BeautifulSoup is not None:
        return BeautifulSoup(html, "html.parser")  # type: ignore
    return _MiniSoup(html)

from .normalizer import make_dedupe_key, normalize_text

TARGET_COLUMNS = [
    "رمز المحافظة",
    "اسم المحافظة",
    "رمز مركز التسجيل",
    "اسم مركز التسجيل",
    "رقم مركز الاقتراع",
    "اسم مركز الاقتراع الفعلي",
    "عنوان مركز الاقتراع الفعلي",
]


@dataclass
class ParserResult:
    rows: List[Dict[str, str]]
    next_page_url: Optional[str]
    page_title: Optional[str]
    source_date_iso: Optional[str]


class Parser:
    """Parse HTML pages and extract polling station tables."""

    def __init__(self, base_url: str) -> None:
        self.base_url = base_url

    def parse(self, html: str, url: str) -> ParserResult:
        soup = _build_soup(html)
        table = self._locate_table(soup)
        rows = self._parse_rows(table, url) if table else []
        next_page = self._find_next_page(soup, url)
        title = self._extract_title(soup)
        source_date = self._extract_date(soup)
        return ParserResult(rows=rows, next_page_url=next_page, page_title=title, source_date_iso=source_date)

    def _locate_table(self, soup: Any) -> Optional[Any]:
        # Try to find the table that contains the desired headers.
        for table in soup.find_all("table"):
            headers = [normalize_text(th.get_text(strip=True)) for th in table.find_all("th")]
            if headers:
                normalized_targets = {normalize_text(col) for col in TARGET_COLUMNS}
                if normalized_targets.intersection(headers):
                    return table
        return soup.find("table")

    def _parse_rows(self, table: Any, url: str) -> List[Dict[str, str]]:
        rows: List[Dict[str, str]] = []
        headers = [normalize_text(th.get_text(strip=True)) for th in table.find_all("th")]
        header_map: Dict[int, str] = {}
        for idx, header in enumerate(headers):
            for target in TARGET_COLUMNS:
                if normalize_text(target) == header:
                    header_map[idx] = target
                    break
            else:
                header_map[idx] = header or f"column_{idx}"
        for tr in table.find_all("tr"):
            cells = self._find_cells(tr)
            if not cells or len(cells) < len(header_map):
                continue
            if not any(self._is_data_cell(cell) for cell in cells):
                continue
            row: Dict[str, str] = {}
            for idx, cell in enumerate(cells[: len(header_map)]):
                key = header_map.get(idx, f"column_{idx}")
                value = normalize_text(cell.get_text(" ", strip=True))
                row[key] = value
            if row:
                row["source_url"] = url
                row["collected_at_iso"] = datetime.now(timezone.utc).isoformat()
                row["dedupe_key"] = make_dedupe_key(row)
                rows.append(row)
        return rows

    def _find_next_page(self, soup: Any, current_url: str) -> Optional[str]:
        link_texts = {"التالي", "التالي »", "التالي›", "Next", "›", ">"}
        for link in soup.find_all("a"):
            text = normalize_text(link.get_text(strip=True))
            classes = link.get("class", [])
            if isinstance(classes, str):
                classes = classes.split()
            if text in link_texts or "next" in classes:
                href = link.get("href")
                if href and href != "#":
                    return href
        # Look for data attributes used by DataTables.
        button = soup.find("button", {"aria-label": "Next"})
        if button and button.has_attr("data-dt-idx"):
            return current_url
        return None

    def _extract_date(self, soup: Any) -> Optional[str]:
        time_el = soup.find("time")
        if time_el and time_el.has_attr("datetime"):
            return normalize_text(time_el["datetime"]).split("T")[0]
        meta = soup.find("meta", {"property": "article:published_time"})
        if meta and meta.has_attr("content"):
            return normalize_text(meta["content"]).split("T")[0]
        return None

    def _find_cells(self, row: Any) -> List[Any]:
        return row.find_all(["td", "th"])

    def _extract_title(self, soup: Any) -> Optional[str]:
        if BeautifulSoup is not None and hasattr(soup, "title"):
            title = soup.title
            if title and getattr(title, "string", None):
                return title.string.strip()
        title_node = getattr(soup, "title", None)
        if title_node:
            return normalize_text(title_node.get_text(strip=True))
        return None

    def _is_data_cell(self, cell: Any) -> bool:
        name = getattr(cell, "name", None) or getattr(cell, "tag", "")
        return name.lower() == "td"


__all__ = ["Parser", "ParserResult", "TARGET_COLUMNS"]
