"""Headless Selenium fallback for JavaScript-driven pagination."""
from __future__ import annotations

import contextlib
import time
from dataclasses import dataclass
from pathlib import Path
from typing import Generator, Iterable, Optional

from .logger import ScrubberLogger


@dataclass
class SeleniumConfig:
    headless: bool = True
    wait_seconds: float = 2.0
    max_pages: int = 200


class SeleniumFallback:
    def __init__(self, logger: ScrubberLogger, config: Optional[SeleniumConfig] = None) -> None:
        self.logger = logger
        self.config = config or SeleniumConfig()

    def available(self) -> bool:
        try:
            import selenium  # type: ignore  # noqa: F401
        except Exception:
            return False
        return True

    def collect_pages(self, start_url: str, output_dir: Path) -> Iterable[Path]:
        if not self.available():
            self.logger.warning("Selenium not available; skipping fallback")
            return []

        from selenium import webdriver  # type: ignore
        from selenium.webdriver.chrome.options import Options  # type: ignore
        from selenium.webdriver.common.by import By  # type: ignore
        from selenium.common.exceptions import NoSuchElementException  # type: ignore

        options = Options()
        if self.config.headless:
            options.add_argument("--headless=new")
        options.add_argument("--disable-gpu")
        options.add_argument("--no-sandbox")
        driver = webdriver.Chrome(options=options)
        driver.set_page_load_timeout(60)
        output_paths = []
        try:
            driver.get(start_url)
            for index in range(1, self.config.max_pages + 1):
                time.sleep(self.config.wait_seconds)
                html = driver.page_source
                path = output_dir / f"selenium_page_{index}.html"
                path.write_text(html, encoding="utf-8")
                output_paths.append(path)
                self.logger.info("Selenium captured page", page=index, path=str(path))
                try:
                    next_button = self._find_next_button(driver)
                except NoSuchElementException:
                    self.logger.info("No next button; ending Selenium capture", page=index)
                    break
                if next_button is None:
                    break
                next_button.click()
        finally:
            driver.quit()
        return output_paths

    def _find_next_button(self, driver):  # type: ignore[override]
        from selenium.webdriver.common.by import By  # type: ignore

        candidates = [
            (By.LINK_TEXT, "التالي"),
            (By.LINK_TEXT, "Next"),
            (By.CSS_SELECTOR, "a.next"),
            (By.CSS_SELECTOR, "button[aria-label='Next']"),
        ]
        for by, value in candidates:
            try:
                element = driver.find_element(by, value)
                if element and element.is_enabled():
                    return element
            except Exception:
                continue
        return None


__all__ = ["SeleniumFallback", "SeleniumConfig"]
