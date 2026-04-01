"""
BaseScraper
-----------
Inherit from this class to build a scraper. Override the `scrape_page` method
to define what data to extract on each page.

Usage:
    class MyScraper(BaseScraper):
        def scrape_page(self, page: Page, url: str) -> list[dict]:
            title = page.text_content("h1")
            return [{"title": title}]

    scraper = MyScraper()
    results = scraper.run()
"""

import json
import time
import logging
from abc import ABC, abstractmethod
from pathlib import Path
from typing import Any

from playwright.sync_api import sync_playwright, Page, Browser, BrowserContext
import config

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)
log = logging.getLogger(__name__)


class BaseScraper(ABC):
    """
    Base class for Playwright scrapers.

    Subclass and implement `scrape_page`. Optionally override `get_urls` to
    return multiple pages to visit, or `after_run` for post-processing.
    """

    def __init__(self) -> None:
        self.results: list[dict[str, Any]] = []
        self.errors:  list[dict[str, Any]] = []

    # ─── To override ──────────────────────────────────────────────────────────

    @abstractmethod
    def scrape_page(self, page: Page, url: str) -> list[dict[str, Any]]:
        """Extract data from the current page. Return a list of row dicts."""
        ...

    def get_urls(self) -> list[str]:
        """Return URLs to visit. Defaults to the single TARGET_URL in config."""
        return [config.TARGET_URL]

    def before_page(self, page: Page, url: str) -> None:
        """Called after navigation, before scraping. Use for login, cookie
        handling, waiting for elements, etc."""
        pass

    def after_run(self, results: list[dict[str, Any]]) -> None:
        """Called after all pages are scraped. Default: save to JSON file."""
        out = Path(config.OUTPUT_FILE)
        out.write_text(json.dumps(results, indent=2, ensure_ascii=False))
        log.info("Saved %d records to %s", len(results), out)

    # ─── Internal ─────────────────────────────────────────────────────────────

    def _setup_context(self, browser: Browser) -> BrowserContext:
        context = browser.new_context(
            viewport={"width": 1280, "height": 800},
            user_agent=(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/120.0.0.0 Safari/537.36"
            ),
        )
        context.set_default_timeout(config.TIMEOUT)
        return context

    def run(self) -> list[dict[str, Any]]:
        urls = self.get_urls()
        log.info("Starting scrape of %d URL(s)", len(urls))

        with sync_playwright() as pw:
            browser = pw.chromium.launch(
                headless=config.HEADLESS,
                slow_mo=config.SLOW_MO,
            )
            context = self._setup_context(browser)
            page = context.new_page()

            for url in urls:
                try:
                    log.info("Visiting %s", url)
                    page.goto(url, wait_until="domcontentloaded")
                    self.before_page(page, url)
                    rows = self.scrape_page(page, url)
                    self.results.extend(rows)
                    log.info("  Extracted %d row(s)", len(rows))
                except Exception as exc:
                    log.error("  Failed on %s: %s", url, exc)
                    self.errors.append({"url": url, "error": str(exc)})

            browser.close()

        if self.errors:
            log.warning("%d page(s) had errors", len(self.errors))

        self.after_run(self.results)
        return self.results

    # ─── Helper utilities ─────────────────────────────────────────────────────

    @staticmethod
    def safe_text(page: Page, selector: str, default: str = "") -> str:
        """Return text content of selector, or default if not found."""
        try:
            el = page.query_selector(selector)
            return (el.text_content() or "").strip() if el else default
        except Exception:
            return default

    @staticmethod
    def safe_attr(page: Page, selector: str, attr: str, default: str = "") -> str:
        """Return an attribute value from selector, or default if not found."""
        try:
            el = page.query_selector(selector)
            return (el.get_attribute(attr) or "").strip() if el else default
        except Exception:
            return default

    @staticmethod
    def extract_all(page: Page, selector: str, attribute: str | None = None) -> list[str]:
        """Return a list of text (or attribute) values for all matching elements."""
        elements = page.query_selector_all(selector)
        results = []
        for el in elements:
            val = el.get_attribute(attribute) if attribute else el.text_content()
            results.append((val or "").strip())
        return results

    @staticmethod
    def wait_and_click(page: Page, selector: str) -> None:
        page.wait_for_selector(selector)
        page.click(selector)

    @staticmethod
    def scroll_to_bottom(page: Page, pause: float = 1.0) -> None:
        """Scroll to the bottom of the page (useful for infinite scroll)."""
        prev_height = 0
        while True:
            height = page.evaluate("() => document.body.scrollHeight")
            if height == prev_height:
                break
            page.evaluate("() => window.scrollTo(0, document.body.scrollHeight)")
            time.sleep(pause)
            prev_height = height
