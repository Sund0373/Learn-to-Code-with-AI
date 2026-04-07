# Learn to Code with AI

A full-stack training template with an interactive step-by-step wizard. Students clone the repo, install dependencies, run the dev server, and the app walks them through everything else.

## Workshop Setup

**👉 Start here:** [Learn to Code with AI — Workshop Slides](https://drive.google.com/file/d/17qJpTNd6JUvS9aQoOJRa7EsXMt8K0tIJ/view?usp=sharing)

The slides walk you through everything before this README picks up: installing VS Code, setting up a coding agent, creating a GitHub account, installing Node.js and Git (including `gh` CLI for Mac users), using "Use this template" to make your own copy of this repo, and starting the dev server.

Once you've completed the slides, the in-app tutorial wizard takes over at [http://localhost:3000/learn](http://localhost:3000/learn).

## Quick Reference

After completing the workshop slides, your dev server should be running. The interactive tutorial starts at:

```
http://localhost:3000/learn
```

If you ever need to restart the dev server:

```bash
cd First-Project/app
npm run dev
```

## What's Inside

### 10-Step Interactive Tutorial (`/learn`)

| Step | Topic | What You'll Do |
|------|-------|----------------|
| 1 | Your First Website | See hot reload, understand project structure |
| 2 | Git Basics | Branch, commit, push to GitHub |
| 3 | Environment Variables | Create `.env.local`, generate JWT secret |
| 4 | Creating a Database | Set up Firebase + Firestore, seed sample data |
| 5 | Authentication | Enable login/signup, test protected routes |
| 6 | Creating an API | Understand routes, build a custom endpoint |
| 7 | Searching Your Data | Live product search page hitting Firestore |
| 8 | Web Scraping | Playwright + Python, design schemas, import to DB |
| 9 | Connecting to LLM APIs | Claude and/or OpenAI keys, test the AI endpoint |
| 10 | Building Agents | What agents are, multi-step AI workflows |

### Tech Stack

- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS
- **Database:** Firebase / Firestore
- **Auth:** Firebase Auth + JWT sessions (httpOnly cookies)
- **AI:** Anthropic Claude + OpenAI (auto-detects which key is configured)
- **Scraping:** Python + Playwright

### Key Pages

- `/learn` — The tutorial wizard
- `/products` — Search the seeded product catalog
- `/scraper-results` — Review and import scraped data
- `/auth/login` and `/auth/signup` — Authentication
- `/dashboard` — Protected route (requires login)

### Key API Routes

- `POST /api/auth/login` — Exchange Firebase token for JWT session
- `POST /api/auth/signup` — Create account + Firestore user doc
- `POST /api/ai` — Send message to Claude or OpenAI (auto-detects)
- `GET /api/ai/status` — Check which AI providers are configured
- `GET /api/products/search` — Search products with filters and sorting
- `POST /api/seed` — Bulk import CSV data to Firestore
- `POST /api/import` — Import scraped JSON data to any collection

## For Instructors

This repo is designed as a **GitHub Template Repository**. Students click "Use this template" to get their own copy they can freely push to. The full pre-wizard setup is covered in the [workshop slides](https://drive.google.com/file/d/17qJpTNd6JUvS9aQoOJRa7EsXMt8K0tIJ/view?usp=sharing).

The tutorial assumes students have:
- A GitHub account
- VS Code with an AI coding agent (Codex, Claude Code, or GitHub Copilot)
- Node.js and Git installed
- **Mac users:** GitHub CLI (`gh`) installed and authenticated via `gh auth login` — this prevents the terminal password prompt issue when pushing to GitHub

The wizard picks up after `npm run dev` — the slides cover everything before that point.

## Project Structure

```
├── app/                    # Next.js application
│   ├── src/
│   │   ├── app/            # Pages and API routes
│   │   ├── components/     # UI components
│   │   ├── lib/            # Auth, Firebase, AI utilities
│   │   ├── data/           # Tutorial step content
│   │   └── context/        # React context providers
│   ├── public/             # Static files (sample CSV)
│   └── .env.example        # Environment variable template
│
└── scrapers/               # Python web scraping toolkit
    ├── base_scraper.py     # Abstract base class
    ├── example_scraper.py  # Example implementation
    └── config.py           # Target URL and selectors
```
