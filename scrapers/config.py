"""
Scraper configuration.
Set your target URL and CSS/XPath selectors here before running.
"""

# ─── TARGET ────────────────────────────────────────────────────────────────────

TARGET_URL = "https://example.com"   # <-- replace with your target

# ─── SELECTORS ─────────────────────────────────────────────────────────────────
# Map a friendly name to a CSS selector (or XPath string prefixed with "xpath=")

SELECTORS: dict[str, str] = {
    # "title":       "h1",
    # "price":       ".product-price",
    # "description": "#product-description p",
    # "next_page":   "a.pagination-next",
}

# ─── BROWSER ───────────────────────────────────────────────────────────────────

HEADLESS = True           # Set False to watch the browser
SLOW_MO  = 0              # Milliseconds between actions (useful for debugging)
TIMEOUT  = 30_000         # Default timeout in ms

# ─── OUTPUT ────────────────────────────────────────────────────────────────────

OUTPUT_FILE = "output.json"   # Where scraped data is saved locally
