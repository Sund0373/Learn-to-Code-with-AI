import { StepData } from "../types";

export const step7Scraping: StepData = {
  id: "web-scraping",
  stepNumber: 8,
  title: "Web Scraping",
  subtitle: "Scrape a website, design a data schema, review results, and import to your database.",
  estimatedMinutes: 25,
  sections: [
    {
      title: "What Is Web Scraping?",
      blocks: [
        {
          type: "text",
          content:
            "Web scraping is automatically extracting data from websites. Instead of manually copying information from a webpage, you write a program that visits the page, finds the data you want, and saves it. This template includes a Python-based scraping toolkit — and Claude will write the scraper for you.",
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
      title: "Step 1: Install the Dependencies",
      blocks: [
        {
          type: "text",
          content:
            "The scraper uses Python. Open a new terminal in VS Code (click the + button) and check if Python is installed:",
        },
        {
          type: "terminal",
          content: "python --version",
          label: "Check Python version (3.10+ is ideal)",
        },
        {
          type: "text",
          content:
            "If you see a version number, you're good. If not, ask your AI agent:",
        },
        {
          type: "code",
          language: "text",
          label: "Tell your AI agent",
          content: "I don't have Python installed. Help me install it on Windows and make sure it's added to PATH.",
        },
        {
          type: "text",
          content: "Once Python is ready, install the scraping packages and browser in the same terminal:",
        },
        {
          type: "terminal",
          content:
            "cd scrapers\npip install -r requirements.txt\nplaywright install chromium",
          label: "Run from your terminal",
        },
        {
          type: "callout",
          variant: "tip",
          content:
            "If `pip` gives a permissions error, try `pip install --user -r requirements.txt` instead.",
        },
      ],
    },
    {
      title: "Step 2: Pick a Website & Find the Elements",
      blocks: [
        {
          type: "text",
          content:
            "Choose a website with lists of items — product pages, directories, job boards, recipe sites, etc. Then use your browser's Developer Tools to find the elements you want to extract:",
        },
        {
          type: "checklist",
          content: "",
          items: [
            "Open the website in Chrome (or Edge)",
            "Right-click on a specific element you want to scrape (e.g., a product name, price)",
            "Click \"Inspect\" — Developer Tools opens and highlights the HTML for that element",
            "Look at the highlighted HTML — note the class names, IDs, and tag types",
            "Right-click the highlighted HTML > \"Copy\" > \"Copy selector\" to get the CSS selector",
            "Repeat for each piece of data you want (name, price, description, etc.)",
          ],
        },
        {
          type: "callout",
          variant: "tip",
          content:
            "CSS selectors are like addresses for elements on a page. `.product-title` targets elements with class \"product-title\", `#main-price` targets the element with ID \"main-price\".",
        },
      ],
    },
    {
      title: "Step 3: Design the Schema with Claude",
      blocks: [
        {
          type: "text",
          content:
            "Before building the scraper, think about how you want the data structured. This is called a \"schema\" — the shape of each record. A clean schema means clean data in your database. Ask Claude to help you design it:",
        },
        {
          type: "code",
          language: "text",
          label: "Tell your AI agent",
          content: `I'm going to scrape [website name/URL] which has a list of [items].

Here's the HTML for one item (I copied this from the Inspect panel):

[paste the HTML you copied]

I want to store this data in Firestore. Help me design a clean schema
for each item. Consider:
- What fields to extract and what to name them
- What data types each field should be (string, number, array, etc.)
- Whether any fields need to be cleaned or transformed (e.g., "$24.99" → 24.99)
- What a good collection name would be

Then create the scraper in scrapers/my_scraper.py that outputs the data
matching this schema to output.json.`,
        },
        {
          type: "text",
          content:
            "You can also take a screenshot of the page and the Inspect panel and share them with Claude — it can read screenshots and identify the HTML structure directly.",
        },
        {
          type: "callout",
          variant: "info",
          content:
            "Getting the schema right before scraping saves a lot of rework. If your scraper outputs messy data (prices as strings, inconsistent field names, nested junk), you'll have to clean it up before importing. Let Claude help you get it right from the start.",
        },
      ],
    },
    {
      title: "Step 4: Run the Scraper",
      blocks: [
        {
          type: "text",
          content:
            "Once Claude creates your scraper, run it from the `scrapers/` directory:",
        },
        {
          type: "terminal",
          content: "python my_scraper.py",
          label: "Run from the scrapers/ directory",
        },
        {
          type: "text",
          content:
            "You'll see logs showing the scraper's progress. When it's done, check `scrapers/output.json` for the extracted data.",
        },
        {
          type: "callout",
          variant: "tip",
          content:
            "Want to watch it work? Tell Claude to set HEADLESS = False in config.py. You'll see a Chrome window open and navigate the site automatically — great for debugging.",
        },
      ],
    },
    {
      title: "Step 5: Review Results & Import to Database",
      blocks: [
        {
          type: "text",
          content:
            "Now open the Scraper Results page to review your data before importing it to Firestore:",
        },
        {
          type: "link",
          content: "/scraper-results",
          label: "Open Scraper Results Page",
        },
        {
          type: "checklist",
          content: "",
          items: [
            "Drag your `scrapers/output.json` file onto the upload zone (or click to browse)",
            "Review the detected schema — check that field names and types look correct",
            "Scroll through the data preview table to spot-check the values",
            "If something looks wrong, go back to Claude and fix the scraper",
            "Choose a collection name (this creates a new collection in your Firestore database)",
            "Click \"Import\" to upload all the data to Firestore",
          ],
        },
        {
          type: "text",
          content:
            "After importing, check your Firebase Console > Firestore Database. You should see your new collection with all the scraped documents.",
        },
      ],
    },
    {
      title: "Step 6: If the Schema Doesn't Look Right",
      blocks: [
        {
          type: "text",
          content:
            "If the results page shows messy or incorrect data, here's how to fix it with Claude:",
        },
        {
          type: "code",
          language: "text",
          label: "Tell your AI agent",
          content: `The scraper output in output.json doesn't look right. Here's what I see:
- [describe what's wrong: wrong fields, missing data, prices as strings, etc.]

Here's the schema I want:
- [list the fields and types you want]

Fix the scraper to output clean data matching this schema.
Make sure prices are numbers (not strings with $),
dates are ISO format, and empty fields are null (not "").`,
        },
        {
          type: "callout",
          variant: "tip",
          content:
            "Common fixes: stripping $ from prices and converting to numbers, trimming whitespace, removing HTML tags from text, splitting combined fields (like \"City, State\" into separate fields). Claude handles all of this when you describe what you want.",
        },
      ],
    },
    {
      title: "Troubleshooting",
      blocks: [
        {
          type: "checklist",
          content: "",
          items: [
            "Scraper finds nothing? Run with HEADLESS = False to see what the browser sees",
            "Elements not found? The page might load dynamically — tell Claude to add wait logic",
            "Only getting partial data? The site may have pagination or infinite scroll — tell Claude to handle it",
            "Getting blocked? Some sites detect bots — try adding delays between requests",
          ],
        },
        {
          type: "code",
          language: "text",
          label: "Tell your AI agent",
          content:
            "The Python scraping environment is set up in the scrapers/ directory with Playwright and Chromium installed. I have BaseScraper as a base class and config.py for settings. I can review and import results at /scraper-results. Help me scrape [describe your target site and the data you want].",
        },
      ],
    },
  ],
};
