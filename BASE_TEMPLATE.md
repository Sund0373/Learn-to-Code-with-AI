# Base Template Conversion — Instructions for Your AI Agent

This document is written for an AI coding agent (Claude Code, Codex, Copilot, etc.). The user has just finished the "Learn to Code with AI" tutorial and wants to convert this working project into their own personal base template they can use to start future projects.

You are about to help them strip out the tutorial-specific code, keep all the working infrastructure, and push the result to a new private GitHub repository they can mark as a template.

**This is a recommended path, not a strict script.** The user is encouraged to disagree with you, ask questions, and take the work in their own direction. If they want to keep something on the removal list, keep it. If they want to remove something on the keep list, ask why and then comply if they're sure. Your job is to be a thoughtful collaborator, not a railroad.

---

## Before You Touch Anything

Run through this pre-flight checklist with the user:

1. **Confirm intent.** Ask the user: "Are you ready to convert this project into your personal base template? This will delete the tutorial wizard, demo pages, and tutorial content from this folder. Your `.env.local`, `service-account.json`, Firebase project, and API keys will all stay exactly where they are." Wait for an explicit yes.

2. **Snapshot the current state.** If there are uncommitted changes, commit them. If there's nothing to commit, create an empty marker commit. Either way, the user should have a clean recovery point they can `git reset --hard` back to if anything goes wrong.

   ```
   git add -A
   git commit -m "Pre-template-conversion snapshot"
   ```

3. **Confirm the branch.** If the user is on `main`, ask whether they want to do this on `main` or create a `template-conversion` branch first. Either is fine — defer to them.

4. **List what's currently configured.** Read `.env.local` (do not print the actual values) and tell the user which credentials are present: Firebase keys, JWT secret, Anthropic key, OpenAI key, etc. This helps them understand what they're keeping.

---

## Files and Folders to Remove (no negotiation)

These are tutorial-specific and have no use outside the tutorial. Delete them without asking:

**Pages and routes:**
- `app/src/app/learn/` (entire folder including `page.tsx`, `complete/page.tsx`)
- `app/src/app/products/page.tsx`
- `app/src/app/scraper-results/page.tsx`

**Components (the entire wizard UI):**
- `app/src/components/learn/` (entire folder — WizardShell, WizardContent, WizardSidebar, StepRenderer, CodeBlock, TerminalBlock, InfoCallout, HelloWorldDemo, Confetti, SeedDatabase)

**Tutorial content and types:**
- `app/src/data/steps/` (entire folder — all 10 step files plus `index.ts`)
- `app/src/data/types.ts` (only contains wizard types — `StepData`, `Section`, `ContentBlock`)

**Wizard state management:**
- `app/src/context/WizardContext.tsx`
- `app/src/hooks/useWizardProgress.ts`

**Tutorial-specific API routes:**
- `app/src/app/api/seed/route.ts` (bulk-seeds the 200 sample products)
- `app/src/app/api/import/route.ts` (used by scraper-results page)
- `app/src/app/api/products/search/route.ts` (tutorial-specific products demo)

**Tutorial assets:**
- `app/public/sample-products.csv`
- `app/public/Celebration.m4a`
- `app/public/branch-indicator.png`
- `app/public/git-status-example.png`
- `app/public/Screenshot 2026-04-03 062541.png`
- `app/public/Screenshot 2026-04-03 064613.png`

**Project-level docs:**
- `BASE_TEMPLATE.md` (this file — delete it last, after the conversion is done)
- `Post_Learning_Survey.md` if present
- `USER_GUIDE.md` if present (it's tutorial documentation)

After deleting these, run `npm run build` and report any broken imports back to the user. You'll need to fix them as part of the next sections.

---

## Files and Folders to Keep (do not touch)

These contain credentials, working infrastructure, or configuration the user needs. **Never delete these. Never modify their contents unless the user explicitly asks.**

**Credentials (CRITICAL — do not even read these):**
- `app/.env.local`
- `app/service-account.json` (if present)
- `.env.local` at project root (if present)

**Working infrastructure:**
- `app/src/lib/` (entire folder — auth, firebase, anthropic, openai, validation, apiClient)
- `app/src/app/api/auth/` (login, signup, logout)
- `app/src/app/api/ai/` (chat endpoint and status check)
- `app/src/app/api/[collection]/route.ts` (generic Firestore CRUD — extremely useful default)
- `app/src/hooks/useAuth.ts`
- `app/src/components/common/` (Header, AiChat, LoadingOverlay, ErrorBoundary)
- `app/src/components/ui/` (Button and any other UI primitives)

**Build configuration:**
- `app/package.json`, `app/package-lock.json`, `app/tsconfig.json`, `app/next.config.ts`, `app/tailwind.config.ts`, `app/postcss.config.js`, `app/eslint.config.mjs`
- `.gitignore` at project root
- `app/.gitignore`

---

## Negotiation Points (CONFIRM with the user)

For each of these, ask the user before doing anything. Present the tradeoff in plain language and let them decide. Don't railroad them into the "recommended" answer.

### 1. Project name
"What should I rename this project to? I'll update `app/package.json`'s `name` field, the `<title>` and `description` in `app/src/app/layout.tsx`, the brand text in `app/src/components/common/Header.tsx`, and the `# Title` line in `README.md`."

### 2. Home page copy
"What should the home page heading say? The current text is 'Learn to Code with AI' — that needs to change. You can give me a placeholder like 'Welcome to {project name}' and edit it later, or tell me exactly what you want."

Update `app/src/app/page.tsx` accordingly. The current page also has a "Start the Tutorial" button linking to `/learn` — that link is now broken. Either remove the button or repoint it somewhere meaningful (like `/dashboard` if the user keeps it, or just delete the button entirely).

### 3. Tutorial link in the header
The Header component has a "Tutorial" link pointing to `/learn`. That route no longer exists. Remove the link entirely from `app/src/components/common/Header.tsx`.

### 4. Dashboard route
"Do you want to keep the example `/dashboard` route as a starting point for protected pages? It's a working 'you're logged in' example that's useful as a reference, but it's empty scaffolding. Most projects benefit from keeping it as a starting point, but if you have a different routing plan, we can remove it."

If they remove it, delete `app/src/app/dashboard/page.tsx`.

### 5. Generic CRUD endpoint
"The `/api/[collection]/route.ts` endpoint is a generic Firestore CRUD handler — it can read, write, update, and delete documents in any collection without you writing collection-specific routes. Most projects benefit from keeping it as a flexible default. The alternative is removing it and writing dedicated routes per collection. Which do you prefer?"

If they remove it, delete `app/src/app/api/[collection]/route.ts`.

### 6. AI Assistant button in header
"The Header has a floating AI Assistant button that auto-detects whether you have Anthropic and/or OpenAI keys configured. Keep it? It's wired up to work with any LLM keys in your `.env.local`."

If they remove it, remove the `<AiChat>` integration from `app/src/components/common/Header.tsx` and delete `app/src/components/common/AiChat.tsx`.

### 7. Scrapers folder
"Do you want to keep the Python `scrapers/` folder? It contains the base scraper class, requirements, and config — useful if your projects might need web scraping, dead weight if not. We can keep just the base class without the example file, or remove the whole folder."

Three valid answers: keep all, keep base only (delete `scrapers/example_scraper.py`), or delete the whole folder.

### 8. Auth flow
"Keep email/password auth via Firebase? Most projects need auth in some form, so I'd recommend keeping it — but if you have a different auth approach in mind (OAuth providers, magic links, no auth at all), we can remove or replace it now."

If they remove it, delete `app/src/app/auth/page.tsx`, `app/src/app/api/auth/`, `app/src/hooks/useAuth.ts`, and the auth helpers in `app/src/lib/auth/`. This is a significant change — confirm twice before doing it.

### 9. Personal agent instructions file
"Do you want me to create a `CLAUDE.md` (or `AGENTS.md`, depending on which agent you use) at the project root capturing your personal coding preferences? This file gets carried into every project you spin up from this template, so investing in it once pays off forever. I can ask you a few questions to fill it out — things like preferred code style, frameworks you like, things you always want me to do or avoid."

If yes, ask the user 4–6 questions and write a `CLAUDE.md` to the project root. Topics worth asking about:
- Preferred code style (functional vs OOP, comments density, naming conventions)
- Tech stack opinions (any libraries they always reach for, any they avoid)
- Testing preferences
- How they want you to communicate (terse vs detailed, ask vs assume)
- Anything they wish you'd done differently in the workshop

Don't make this exhaustive — better to ship a short, true `CLAUDE.md` than a long aspirational one.

---

## Updates That Always Happen (after negotiation)

Once the negotiation is settled, make these changes:

1. **Project name everywhere:** package.json, layout metadata title and description, Header brand, README title.

2. **Home page rewrite:** Replace `app/src/app/page.tsx` with a generic landing matching the user's chosen home page copy. Remove the broken "Start the Tutorial" button.

3. **README rewrite:** The current README is workshop documentation. Replace it with something appropriate for the user's new template — a few sentences describing what the template is, the tech stack, and how to start a new project from it. Reference the `CLAUDE.md` if you created one. **Do not** include workshop content, slide links, or tutorial step descriptions.

4. **Header cleanup:** Remove the "Tutorial" link, update the brand text, leave everything else (auth state, AI Assistant if kept, home icon).

5. **Build verification:** Run `npm run build` from `app/`. Fix any broken imports caused by the file removals. Common breakages: `WizardContext` references, `HelloWorldDemo` imports in step files, `StepData` type references. Once `npm run build` succeeds, the conversion is structurally clean.

---

## Credential Warning — The User Must Read This

Before pushing anything to GitHub, read this section to the user word-for-word. Do not paraphrase. Do not skip it.

> **Important: when you start your next project from this template, you MUST set up fresh credentials.**
>
> The current `.env.local` and `service-account.json` are wired to the Firebase project and API keys you set up during the tutorial. They are intentionally being left in this folder so YOU can keep using them in this project — but they should NOT be committed to your template repo, and they should NOT be shared between separate projects you build later.
>
> Your `.gitignore` already excludes `.env.local` and `service-account.json` — that's why pushing this template to GitHub is safe. The credentials stay on your local machine; only the template structure goes to GitHub.
>
> **For each new project you create from this template, you must:**
>
> 1. Generate a new JWT secret: `openssl rand -base64 32`
> 2. Create a new Firebase project (or deliberately decide to reuse an existing one, knowing the data will be shared)
> 3. Download a fresh service account JSON from that Firebase project
> 4. Create a new `.env.local` with the new project's credentials
> 5. Get fresh API keys from Anthropic / OpenAI if you want isolated billing per project
>
> Sharing credentials across projects is a footgun: data bleeds between projects, one leaked key affects everything, and you can't share the template with anyone else without sharing your secrets. Be deliberate.

After reading this, ask the user: "Understood?" Wait for confirmation before continuing.

---

## Push to GitHub as a Private Template

This is the final step. The goal is a private GitHub repository the user owns, marked as a template repository, that they (and only they) can clone for future projects.

**This step has two valid paths and the user can choose either:**

### Path A: User does it themselves

Some users prefer to handle the GitHub push manually. If they want this, give them the exact commands to run after they create an empty private repo on github.com:

1. Tell them to go to github.com → "+" menu → New repository → name it (suggest `my-base-template` or `{their-project-name}`) → set Private → **do not** initialize with a README, .gitignore, or license → Create repository.

2. GitHub will show them the "push an existing repository" snippet. The commands they need to run from the project root are:
   ```
   git remote add origin https://github.com/THEIR-USERNAME/REPO-NAME.git
   git branch -M main
   git push -u origin main
   ```

3. Once pushed, tell them to go to the repo on github.com → Settings → scroll to the top → check "Template repository" → save.

### Path B: Agent does it

If the user wants you to handle the push, do these steps in order:

1. Confirm with the user the desired repo name and that it should be private.

2. Tell the user to create the empty private repo on github.com first (you cannot create a GitHub repo without their browser action unless they have `gh` CLI authenticated — and even then, ask before assuming). Once they confirm the empty repo exists, ask for the URL.

3. Run:
   ```
   git remote add origin <user-provided-url>
   git branch -M main
   git push -u origin main
   ```

4. If `git push` triggers a browser auth popup (Git Credential Manager on Windows, `gh` on Mac), tell the user what to expect and wait.

5. After the push succeeds, walk the user through the "Mark as template" browser step: github.com → repo Settings → check "Template repository" → save. This step requires their browser action; you cannot do it for them via plain git.

Either path is fine. Don't push the user toward one or the other — ask which they prefer and follow their lead.

---

## Post-Conversion Summary — Show This to the User

When everything above is done, give the user a summary that covers:

1. **What was removed:** A bullet list of the major things deleted (the wizard, the demo pages, tutorial assets, etc.). Don't list every file — group them.

2. **What was kept:** A bullet list of the working infrastructure that's still in place (auth, AI, scrapers, generic CRUD, etc.).

3. **What was updated:** Project name, home page, header, README, and any negotiation point changes.

4. **Repository status:** Confirmation that the cleaned project has been pushed to a new private template repository on GitHub, with the URL.

5. **A reminder about credentials.** One more time, in your own words, remind the user that the current `.env.local` is still wired to their tutorial Firebase project, and that future projects spun up from this template need fresh credentials.

---

## Suggested Next Steps for the User

After the summary, suggest these next steps. You don't need to walk through them in this conversation — just plant the seeds:

1. **Start a new project with your template.** Go to your private template repo on GitHub, click "Use this template," create a new private repo for your real project, clone it, set up fresh credentials, and start building. This is the loop closing — you received this project as a template repo on Day 1, and now you have your own.

2. **Personalize your Agent Instructions.** If you didn't create a `CLAUDE.md` (or `AGENTS.md`) during this conversion, do it now. Capture how you like to work, your tech stack opinions, things you want your agent to do or avoid. This file gets carried into every future project — investment now pays off forever.

3. **Add to / update your project template as you build new reusable features.** When you build something in a real project that you'll want again — a custom auth flow, a useful component, a billing integration — go back to your template repo and copy it over. Your template should grow with your skills.

4. **Connect to a web hosting service. We recommend Vercel.** Vercel + GitHub gives you push-to-deploy on a generous free tier. You'll need to re-add your environment variables in the Vercel dashboard since they're not in the repo, but after that, every push deploys automatically.

5. **Explore GitHub Actions.** Once you're comfortable with the basics, GitHub Actions unlocks automated tests on push, scheduled scrapers, deployment automation, and more. Don't try to learn it all at once — just know it exists for when you need it.

---

## Final Note for the Agent

This is a big change. The user just spent a few hours building something they're proud of, and now they're trusting you to transform it without breaking anything. Be careful, be communicative, and check in often. If at any point you're not sure whether to delete something, ask. If the user wants to deviate from this document, follow their lead — this is their template, not yours.

Good luck. Ship them something they're going to use for years.
