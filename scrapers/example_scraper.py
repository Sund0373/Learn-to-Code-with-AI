"""
Example scraper — copy this file and rename it for each new scraping task.

Steps:
  1. Set TARGET_URL and SELECTORS in config.py
  2. Implement scrape_page() below
  3. Run: python example_scraper.py
"""

from playwright.sync_api import Page
from base_scraper import BaseScraper
import config


class ExampleScraper(BaseScraper):

    def before_page(self, page: Page, url: str) -> None:
        # Optional: wait for a specific element before scraping
        # page.wait_for_selector(config.SELECTORS["title"])
        pass

    def scrape_page(self, page: Page, url: str) -> list[dict]:
        rows = []

        # ── Single element example ─────────────────────────────────────────────
        # title = self.safe_text(page, config.SELECTORS["title"])
        # price = self.safe_text(page, config.SELECTORS["price"])
        # rows.append({"url": url, "title": title, "price": price})

        # ── List of items example ──────────────────────────────────────────────
        # items = page.query_selector_all(".item-card")
        # for item in items:
        #     rows.append({
        #         "url":   url,
        #         "name":  (item.query_selector(".name") or item).text_content().strip(),
        #         "price": (item.query_selector(".price") or item).text_content().strip(),
        #     })

        # ── Paginated example ─────────────────────────────────────────────────
        # while True:
        #     items = page.query_selector_all(".item")
        #     for item in items:
        #         rows.append({"text": item.text_content().strip()})
        #     next_btn = page.query_selector(config.SELECTORS["next_page"])
        #     if not next_btn:
        #         break
        #     next_btn.click()
        #     page.wait_for_load_state("domcontentloaded")

        return rows

    # Optional: override get_urls() to scrape multiple pages
    # def get_urls(self) -> list[str]:
    #     return [f"https://example.com/page/{i}" for i in range(1, 11)]


if __name__ == "__main__":
    scraper = ExampleScraper()
    results = scraper.run()
    print(f"Done — {len(results)} records scraped.")
