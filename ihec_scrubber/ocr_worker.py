"""OCR helpers using pytesseract and pdf2image."""
from __future__ import annotations

import logging
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable, List, Optional

try:
    from PIL import Image  # type: ignore
except Exception as exc:  # pragma: no cover - optional dependency
    Image = None  # type: ignore
    logging.getLogger(__name__).warning("Pillow not available: %s", exc)

try:
    import pytesseract  # type: ignore
except Exception as exc:  # pragma: no cover - optional dependency
    pytesseract = None  # type: ignore
    logging.getLogger(__name__).warning("pytesseract not available: %s", exc)

try:
    from pdf2image import convert_from_path  # type: ignore
except Exception as exc:  # pragma: no cover - optional dependency
    convert_from_path = None  # type: ignore
    logging.getLogger(__name__).warning("pdf2image not available: %s", exc)


@dataclass
class OcrResult:
    text: str
    confidence: float
    ocr_extracted: bool


class OcrWorker:
    """Perform OCR on local images or PDFs."""

    def __init__(self, language: str = "ara+eng") -> None:
        self.language = language

    def process_path(self, path: Path) -> OcrResult:
        if path.suffix.lower() == ".pdf":
            return self._process_pdf(path)
        return self._process_image(path)

    def _process_image(self, path: Path) -> OcrResult:
        if pytesseract is None or Image is None:
            return OcrResult(text="", confidence=0.0, ocr_extracted=False)
        image = Image.open(path)
        ocr_data = pytesseract.image_to_data(image, lang=self.language, output_type=pytesseract.Output.DICT)
        text = "\n".join(filter(None, ocr_data.get("text", [])))
        confidences = [float(conf) for conf in ocr_data.get("conf", []) if conf not in ("-1", "" )]
        avg_conf = sum(confidences) / len(confidences) if confidences else 0.0
        return OcrResult(text=text.strip(), confidence=avg_conf, ocr_extracted=True)

    def _process_pdf(self, path: Path) -> OcrResult:
        if convert_from_path is None or pytesseract is None:
            return OcrResult(text="", confidence=0.0, ocr_extracted=False)
        images = convert_from_path(str(path))
        texts: List[str] = []
        confidences: List[float] = []
        for image in images:
            data = pytesseract.image_to_data(image, lang=self.language, output_type=pytesseract.Output.DICT)
            texts.extend(filter(None, data.get("text", [])))
            confidences.extend(float(conf) for conf in data.get("conf", []) if conf not in ("-1", ""))
        avg_conf = sum(confidences) / len(confidences) if confidences else 0.0
        return OcrResult(text="\n".join(texts).strip(), confidence=avg_conf, ocr_extracted=True)


__all__ = ["OcrWorker", "OcrResult"]
