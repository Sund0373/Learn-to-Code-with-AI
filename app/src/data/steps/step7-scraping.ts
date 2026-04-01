import { StepData } from "../types";

export const step7Scraping: StepData = {
  id: "web-scraping",
  stepNumber: 7,
  title: "Web Scraping",
  subtitle: "Set up Python and Playwright to extract data from websites.",
  estimatedMinutes: 20,
  sections: [
    {
      title: "What Is Web Scraping?",
      blocks: [
        {
          type: "text",
          content:
            "Web scraping is automatically extracting data from websites. Instead of manually copying information from a webpage, you write a program that visits the page, finds the data you want, and saves it. This template includes a Python-based scraping toolkit using Playwright — a tool that controls a real web browser programmatically.",
        },
        {
          type: "callout",
          variant: "warning",
          content:
            "Always check a website's terms of service before scraping. Many sites prohibit it. Be respectful — don't hammer a site with thousands of requests. Use scraping responsibly and ethically.",
        },
      ],
    },
    {
      title: "Step 1: Install Python",
      blocks: [
        {
          type: "text",
          content:
            "The scraper uses Python (a different programming language from JavaScript). You may already have it installed. Check by running:",
        },
        {
          type: "terminal",
          content: "python --version",
        },
        {
          type: "text",
          content:
            "If you see a version number (3.10 or higher is ideal), you're good. If not, download Python from python.org and install it. Make sure to check \"Add Python to PATH\" during installation.",
        },
      ],
    },
    {
      title: "Step 2: Set Up the Virtual Environment",
      blocks: [
        {
          type: "text",
          content:
            "A virtual environment keeps your Python packages isolated to this project (similar to `node_modules` for JavaScript). Navigate to the scrapers folder and set it up:",
        },
        {
          type: "terminal",
          content:
            "cd scrapers\npython -m venv .venv",
          label: "Create the virtual environment",
        },
        {
          type: "text",
          content: "Now activate it:",
        },
        {
          type: "terminal",
          content: ".venv\\Scripts\\activate",
          label: "Windows",
        },
        {
          type: "terminal",
          content: "source .venv/bin/activate",
          label: "Mac / Linux",
        },
        {
          type: "text",
          content:
            "You should see `(.venv)` at the beginning of your terminal prompt. Now install the dependencies and Playwright's browser:",
        },
        {
          type: "terminal",
          content:
            "pip install -r requirements.txt\nplaywright install chromium",
          label: "Install packages and browser",
        },
      ],
    },
    {
      title: "Step 3: Configure Your Target",
      blocks: [
        {
          type: "text",
          content:
            "Open `scrapers/config.py` in your editor. This is where you tell the scraper what website to visit and what data to look for:",
        },
        {
          type: "code",
          language: "python",
          label: "scrapers/config.py — the key settings",
          content: `# The website you want to scrape
TARGET_URL = "https://example.com"

# CSS selectors that identify the data you want
SELECTORS = {
    "title": "h1",              # The main heading
    "items": ".item-card",      # Each item/card on the page
    "item_name": ".item-title", # Name within each card
    "item_price": ".price",     # Price within each card
}`,
        },
        {
          type: "callout",
          variant: "tip",
          content:
            "CSS selectors are patterns that identify elements on a page. `h1` selects heading elements, `.item-card` selects elements with class \"item-card\", and `#main` selects the element with ID \"main\". You can find selectors by right-clicking an element in your browser and choosing \"Inspect.\"",
        },
      ],
    },
    {
      title: "Step 4: Build Your Scraper",
      blocks: [
        {
          type: "text",
          content:
            "The template includes a `BaseScraper` class that handles all the browser automation. You just need to tell it what to extract. Ask your AI agent to help build a scraper:",
        },
        {
          type: "code",
          language: "text",
          label: "Prompt for your AI agent",
          content: `Look at scrapers/base_scraper.py and scrapers/example_scraper.py.
Create a new scraper in scrapers/my_scraper.py that:
- Extends BaseScraper
- Scrapes [describe the website and data you want]
- Update config.py with the target URL and CSS selectors
- Save the results to output.json`,
        },
        {
          type: "text",
          content:
            "Your AI agent will look at the existing examples and create a scraper customized for your target site.",
        },
      ],
    },
    {
      title: "Step 5: Run Your Scraper",
      blocks: [
        {
          type: "text",
          content:
            "Make sure your virtual environment is active (you should see `(.venv)` in your terminal), then run:",
        },
        {
          type: "terminal",
          content: "python my_scraper.py",
          label: "Run from the scrapers/ directory",
        },
        {
          type: "text",
          content:
            "You'll see logs showing the scraper's progress. When it's done, check `scrapers/output.json` to see the extracted data.",
        },
        {
          type: "callout",
          variant: "tip",
          content:
            "If you want to see the browser in action (instead of headless mode), change `HEADLESS = True` to `HEADLESS = False` in config.py. You'll see a Chrome window open and navigate automatically — it's fun to watch!",
        },
        {
          type: "code",
          language: "text",
          label: "Tell your AI agent",
          content:
            "The Python scraping environment is set up in the scrapers/ directory with Playwright installed. I have a working scraper that outputs to scrapers/output.json. If I want to scrape a new site, help me update config.py with the target URL and CSS selectors, and create a new scraper class that extends BaseScraper.",
        },
      ],
    },
  ],
};
