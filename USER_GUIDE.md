# User Guide

A step-by-step guide for setting up and using this project template.

---

## Table of Contents

1. [Getting Started](#1-getting-started)
2. [Building a Backend](#2-building-a-backend)
3. [Building a Frontend](#3-building-a-frontend)
4. [Authentication & Security](#4-authentication--security)
5. [Data Integration](#5-data-integration)
6. [AI Integration](#6-ai-integration)
7. [Deployment & Operations](#7-deployment--operations)
8. [Testing & Quality](#8-testing--quality)
9. [Advanced Topics](#9-advanced-topics)

---

## 1. Getting Started

### Step 1 — Install dependencies first

> **Before doing anything else**, run `npm install` inside the `app/` directory.
> Until you do, your IDE will show errors like *"Cannot find module 'next/server'"* on every file — these are not real code errors, just missing packages.

```bash
cd app
npm install
```

Once installed, copy the environment file and fill in your secrets:

```bash
cp ../.env.example .env.local
```

Then start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). All IDE errors should clear.

---

### Prompt Engineering — The good, the bad, the ugly

Before writing a single line of code, know how to talk to the AI you're integrating.

**Good prompts are:**
- Specific about format: *"Return a JSON object with keys: name, price, url"*
- Role-scoped: *"You are a data extraction specialist..."*
- Constrained: *"Only return data present in the source. Never fabricate values."*

**Bad prompts:**
- Vague: *"Summarize this"* — summarize how? For whom?
- Open-ended output: No format specified → inconsistent responses, brittle parsing
- No guardrails: Model hallucinates, fills gaps with plausible-sounding nonsense

**The ugly:**
- Prompt injection — user input that hijacks your system prompt. Always sanitize.
- Token limits — long prompts + long responses = expensive + truncated. Be concise.
- Hallucination at the edges — models are confident when wrong. Validate AI output before saving to DB.

The system prompt lives in [app/src/app/api/ai/route.ts](app/src/app/api/ai/route.ts). Replace the placeholder with your task-specific instructions.

---

### Available Commands

**Prerequisites:** Node.js v18+, npm

| Command | Action |
|---|---|
| `npm run dev` | Start local dev server with hot reload |
| `npm run build` | Build for production |
| `npm run start` | Run the production build locally |
| `npm run lint` | Run ESLint |

**Debugging in the browser:**
- Open DevTools → **Console** for client errors
- Open DevTools → **Network** tab to inspect API requests/responses
- Next.js server logs appear in the terminal where `npm run dev` is running

---

### Storing Secrets & Environment Variables

Never hardcode secrets. Never commit `.env.local`.

```bash
cp .env.example app/.env.local
```

**Current variables (see [.env.example](.env.example)):**

| Variable | What it's for |
|---|---|
| `FIREBASE_SERVICE_ACCOUNT_JSON` | Firestore access (server-side) |
| `ANTHROPIC_API_KEY` | Claude AI API |
| `JWT_SECRET` | Signing auth tokens — generate with `openssl rand -base64 32` |
| `NEXT_PUBLIC_APP_URL` | Public base URL (safe to expose) |

**Rules:**
- Variables prefixed `NEXT_PUBLIC_` are exposed to the browser — never put secrets there
- Server-only secrets stay unprefixed — Next.js keeps them server-side only
- Rotate any secret that was accidentally committed immediately

---

## 2. Building a Backend

### Designing a Data Schema

Plan your Firestore collections before writing a single API route.

**Firestore is document-based — think in collections and documents, not tables and rows:**

```
users/                      ← collection
  {userId}/                 ← document (auto-ID or custom)
    name: "Alice"
    email: "alice@..."
    createdAt: Timestamp

orders/
  {orderId}/
    userId: "ref to user"   ← store IDs, not nested objects (unless truly embedded)
    items: [...]            ← arrays are fine for small, non-queryable lists
    status: "pending"
    total: 99.99
```

**Rules of thumb:**
- Each document should be fetchable independently
- Don't nest data you'll need to query or update separately
- Keep documents under ~1MB (Firestore hard limit)
- Use subcollections for 1-to-many relationships that grow unbounded

---

### Building and Managing a Database

The CRUD helpers live in [app/src/lib/firebase/crud.ts](app/src/lib/firebase/crud.ts).

```ts
import { createDoc, getDoc, getDocs, queryDocs, updateDoc, deleteDoc } from "@/lib/firebase/crud";

const id      = await createDoc("orders", { userId, total: 99.99, status: "pending" });
const order   = await getDoc("orders", id);
const orders  = await getDocs("orders");
const pending = await queryDocs("orders", "status", "==", "pending");

await updateDoc("orders", id, { status: "shipped" });
await deleteDoc("orders", id);
```

All documents automatically receive `createdAt` and `updatedAt` timestamps.

**Firestore setup:**
1. Firebase Console → Firestore Database → Create database
2. Project Settings → Service Accounts → Generate new private key
3. Paste the JSON (single line) into `app/.env.local`:
   ```
   FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account","project_id":"..."}
   ```

---

### Building a CRUD API

The generic REST API at `/api/{collection}` handles all collections automatically.

| Method | URL | Body | Action |
|---|---|---|---|
| `GET` | `/api/{collection}` | — | List all |
| `GET` | `/api/{collection}?id=ID` | — | Get one |
| `POST` | `/api/{collection}` | `{ ...fields }` | Create |
| `PATCH` | `/api/{collection}?id=ID` | `{ ...fields }` | Update |
| `DELETE` | `/api/{collection}?id=ID` | — | Delete |

For custom business logic, add a dedicated route:

```ts
// app/src/app/api/orders/fulfill/route.ts
export async function POST(req: NextRequest) {
  const { id } = await req.json();
  const order = await getDoc("orders", id);
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await updateDoc("orders", id, { status: "fulfilled", fulfilledAt: new Date() });
  return NextResponse.json({ success: true });
}
```

Always return `{ error: string }` on failure with the correct HTTP status (400, 401, 404, 500).

---

## 3. Building a Frontend

### Building a UI

Tailwind CSS is pre-configured. Customize your color palette in [app/src/theme/colors.ts](app/src/theme/colors.ts) — changes apply everywhere via the token mapping in [app/tailwind.config.ts](app/tailwind.config.ts).

**Use semantic color tokens instead of raw Tailwind colors:**

```tsx
// Do this — rethemeable by changing one file
<div className="bg-app-bg text-text-primary border border-border-default">

// Avoid this — hardcoded, hard to retheme
<div className="bg-gray-50 text-gray-900 border border-gray-200">
```

**Reusable component classes** (defined in `globals.css`):
```html
<button class="btn-primary">Save</button>
<button class="btn-secondary">Cancel</button>
<div class="card">Content</div>
<input class="input" />
```

**Button component:**
```tsx
import Button from "@/components/ui/Button";

<Button variant="primary" size="md" loading={isSubmitting}>Save</Button>
<Button variant="danger">Delete</Button>
<Button variant="ghost" size="sm">Cancel</Button>
```

---

### State Management

Start with React's built-in tools before reaching for a library.

**`useState`** — local component state:
```tsx
const [isOpen, setIsOpen] = useState(false);
```

**`useContext`** — share state across a subtree:
```tsx
const UserContext = createContext<User | null>(null);
<UserContext.Provider value={user}>{children}</UserContext.Provider>
const user = useContext(UserContext);
```

**Add Zustand** when you need shared state between unrelated components or complex async state:
```bash
npm install zustand
```
```ts
import { create } from "zustand";

const useCartStore = create((set) => ({
  items: [],
  add:   (item) => set((s) => ({ items: [...s.items, item] })),
  clear: ()     => set({ items: [] }),
}));
```

---

### Forms & Validation

**Client-side validation** with [app/src/lib/validation.ts](app/src/lib/validation.ts):

```tsx
import { validate, required, isEmail, minLength } from "@/lib/validation";

const emailResult    = validate(email,    [required, isEmail]);
const passwordResult = validate(password, [(v) => minLength(v, 8)]);

if (!emailResult.valid)    setEmailError(emailResult.message);
if (!passwordResult.valid) setPasswordError(passwordResult.message);
```

**Always validate on the server too** — client validation is UX, not security:
```ts
const { email, password } = await req.json();
if (!email || !password) {
  return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
}
```

---

### Connecting Frontend to API

Use the typed `api` client from [app/src/lib/apiClient.ts](app/src/lib/apiClient.ts). It auto-attaches auth headers and returns `{ data, error }` — no try/catch in components.

```tsx
import { api } from "@/lib/apiClient";

// Fetch on mount
const { data, error } = await api.get<User[]>("/api/users");

// On form submit
const { data, error } = await api.post<{ id: string }>("/api/users", { name, email });
if (error) setError(error);
else router.push(`/users/${data.id}`);

// Loading + error pattern
const [isLoading, setIsLoading] = useState(false);
const handleSubmit = async () => {
  setIsLoading(true);
  const { error } = await api.post("/api/orders", payload);
  setIsLoading(false);
  if (error) setError(error);
};
```

---

## 4. Authentication & Security

### Authentication

The template includes a complete JWT auth layer. Here's how the pieces connect:

```
User submits login form
  → POST /api/auth/login          validates credentials, issues JWT in httpOnly cookie
  → authService.setAuthenticatedState()  stores token reference in sessionStorage
  → middleware.ts                  verifies cookie on protected routes, redirects if invalid
  → useAuth()                      reads auth state in any client component
```

**Protecting a page route** — add it to the `matcher` in [app/src/middleware.ts](app/src/middleware.ts):
```ts
export const config = {
  matcher: ["/dashboard/:path*", "/account/:path*", "/admin/:path*"],
};
```

**Protecting an API route:**
```ts
import { verifyToken } from "@/lib/auth/tokenVerifier";

export async function GET(req: NextRequest) {
  const token   = req.cookies.get("Authorization")?.value;
  const payload = await verifyToken(token ?? "");
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // payload.uid, payload.email available here
}
```

**Replace the placeholder credential check** in [app/src/app/api/auth/login/route.ts](app/src/app/api/auth/login/route.ts) with your real auth logic.

---

### Security Basics

| Threat | Mitigation |
|---|---|
| **SQL / NoSQL injection** | Use the Firestore SDK — never interpolate user input into queries |
| **XSS** | React escapes output by default — never use `dangerouslySetInnerHTML` with user content |
| **CORS** | Next.js API routes are same-origin by default; add explicit CORS headers only if needed |
| **Input sanitization** | Validate and strip unexpected fields before saving to DB |
| **Prompt injection** | Never pass raw user input directly into a system prompt — sanitize first |
| **Rate limiting** | Add rate limiting to auth and AI routes before going to production |

---

### Storing Secrets

- Never commit `.env.local`, service account JSON, or API keys
- Never use `NEXT_PUBLIC_*` for secrets — they are bundled into the client bundle
- Rotate immediately if a secret is accidentally exposed
- Use platform secret managers in production (Vercel Environment Variables, GCP Secret Manager)
- The `.gitignore` already excludes `.env.local` and `service-account.json`

---

## 5. Data Integration

### Scraping & Extracting Data

The Python Playwright scraper toolkit lives in [scrapers/](scrapers/).

**Setup:**
```bash
cd scrapers
python -m venv .venv
source .venv/bin/activate      # Windows: .venv\Scripts\activate
pip install -r requirements.txt
playwright install chromium
```

**Configure your target** in [scrapers/config.py](scrapers/config.py):
```python
TARGET_URL = "https://target-site.com"
SELECTORS  = {
    "title": "h1.product-title",
    "price": "span.price",
}
```

**Build your scraper** — copy `example_scraper.py` and implement `scrape_page`:
```python
class MyScraper(BaseScraper):
    def scrape_page(self, page: Page, url: str) -> list[dict]:
        return [{
            "title": self.safe_text(page, config.SELECTORS["title"]),
            "price": self.safe_text(page, config.SELECTORS["price"]),
        }]

if __name__ == "__main__":
    MyScraper().run()
```

**Common patterns:**
```python
# Wait for element before scraping
def before_page(self, page, url):
    page.wait_for_selector(".product-card")

# Multiple pages
def get_urls(self):
    return [f"https://site.com/page/{i}" for i in range(1, 11)]

# Infinite scroll
def scrape_page(self, page, url):
    self.scroll_to_bottom(page, pause=1.5)
    return [{"text": el.text_content()} for el in page.query_selector_all(".item")]

# Debug — watch the browser
# Set HEADLESS = False in config.py
```

Results save to `scrapers/output.json`.

---

### File Uploads

For images, CSVs, or PDFs — use Firebase Storage.

```ts
// app/src/lib/storage.ts
import { getStorage } from "firebase-admin/storage";
import { getAdminApp } from "./firebase/admin";

export async function uploadFile(buffer: Buffer, destination: string, contentType: string): Promise<string> {
  getAdminApp();
  const bucket = getStorage().bucket();
  const file   = bucket.file(destination);
  await file.save(buffer, { contentType, resumable: false });
  await file.makePublic();
  return `https://storage.googleapis.com/${bucket.name}/${destination}`;
}
```

```ts
// In an API route
export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file     = formData.get("file") as File;
  const buffer   = Buffer.from(await file.arrayBuffer());
  const url      = await uploadFile(buffer, `uploads/${file.name}`, file.type);
  return NextResponse.json({ url });
}
```

---

### Real-time Data

**Polling** (simplest — good for low-frequency updates):
```tsx
useEffect(() => {
  const interval = setInterval(async () => {
    const { data } = await api.get("/api/orders");
    setOrders(data ?? []);
  }, 5000);
  return () => clearInterval(interval);
}, []);
```

**Firestore real-time listener** (instant updates, client-side):
```ts
import { getFirestore, collection, onSnapshot } from "firebase/firestore";

const unsubscribe = onSnapshot(collection(getFirestore(), "orders"), (snap) => {
  setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
});
return () => unsubscribe();
```

**Server-Sent Events** — same pattern as the AI streaming route, works for any data feed.

---

## 6. AI Integration

### AI Model Integrations

The Anthropic Claude client and API route are pre-configured.

**Direct usage in a server route:**
```ts
import { getAnthropicClient, CLAUDE_MODEL } from "@/lib/anthropic/client";

const client   = getAnthropicClient();
const response = await client.messages.create({
  model:      CLAUDE_MODEL,
  max_tokens: 1024,
  system:     "You are a helpful assistant.",
  messages:   [{ role: "user", content: userMessage }],
});
const text = response.content[0].type === "text" ? response.content[0].text : "";
```

**Via the API route:**
```ts
// Standard response
const { data } = await api.post<{ response: string }>("/api/ai", { message: userInput });

// Streaming response
const res    = await fetch("/api/ai", {
  method:  "POST",
  headers: { "Content-Type": "application/json" },
  body:    JSON.stringify({ message: userInput, stream: true }),
});
const reader = res.body!.getReader();
// read chunks and append to UI state
```

Replace the placeholder system prompt in [app/src/app/api/ai/route.ts](app/src/app/api/ai/route.ts) with your task-specific instructions.

---

### Prompt Caching

Reduce cost on repeated requests that share a large system prompt.

```ts
const response = await client.messages.create({
  model:      CLAUDE_MODEL,
  max_tokens: 1024,
  system: [
    {
      type:          "text",
      text:          LONG_SYSTEM_PROMPT,  // must be >1024 tokens to benefit
      cache_control: { type: "ephemeral" },
    },
  ],
  messages: [{ role: "user", content: userMessage }],
});
```

Cache TTL is ~5 minutes. Cached input tokens cost ~90% less. Most useful for large knowledge bases, document analysis, or fixed tool definitions.

---

### RAG (Retrieval-Augmented Generation)

When Claude needs to answer questions about your own data:

1. **Embed** documents into vectors (Voyage via Anthropic, or OpenAI embeddings)
2. **Store** in a vector DB (Pinecone, Supabase pgvector)
3. **Retrieve** the top-K most relevant chunks at query time
4. **Inject** retrieved context into the Claude message

```ts
const chunks  = await vectorDb.search(userQuery, { topK: 5 });
const context = chunks.map((c) => c.text).join("\n\n");

const response = await client.messages.create({
  model:      CLAUDE_MODEL,
  max_tokens: 2048,
  system:     `Answer based only on the provided context:\n\n${context}`,
  messages:   [{ role: "user", content: userQuery }],
});
```

---

### Fine-tuning vs. Few-shot Prompting

| | Few-shot prompting | Fine-tuning |
|---|---|---|
| **When to use** | Almost always — try this first | Only after exhausting prompting |
| **Cost** | API call cost only | Training cost + higher per-token cost |
| **Speed** | Minutes | Days to weeks |
| **Best for** | Format, tone, style, task framing | Domain vocabulary, consistent output at high volume |

Rule of thumb: if 5 examples in the prompt get you 80% of the way, fine-tuning will only reach ~85% — probably not worth it.

---

## 7. Deployment & Operations

### Deploying to Production

**Frontend → Vercel** (recommended):
1. Push `app/` to GitHub
2. Import the repo at [vercel.com](https://vercel.com), set root directory to `app`
3. Add all `.env.local` variables as Vercel Environment Variables
4. Deploy — Vercel handles builds, CDN, and SSL automatically

**Backend → Firebase** (already managed):
- Firestore runs as a managed service — nothing to deploy
- Enable Firebase Storage in the Firebase Console if using file uploads

**Python scrapers** — run locally or schedule via cron / GitHub Actions / Cloud Run.

---

### Monitoring & Logging

**Vercel** provides logs out of the box:
- Function logs: Vercel Dashboard → Deployments → Functions
- Real-time: `vercel logs --follow`

**Add Sentry for production error tracking:**
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

Then hook it into `ErrorBoundary.tsx`:
```ts
componentDidCatch(error, info) {
  Sentry.captureException(error, { extra: info });
}
```

**Structured API logging:**
```ts
console.error(JSON.stringify({ level: "error", route: "/api/orders", error: String(e), userId }));
```

---

### Rate Limiting & Throttling

Protect your AI and auth routes before going to production.

```ts
// app/src/lib/rateLimit.ts
const requests = new Map<string, number[]>();

export function rateLimit(key: string, maxRequests: number, windowMs: number): boolean {
  const now   = Date.now();
  const times = (requests.get(key) ?? []).filter((t) => now - t < windowMs);
  if (times.length >= maxRequests) return false;
  requests.set(key, [...times, now]);
  return true;
}
```

```ts
// In your API route
const allowed = rateLimit(req.ip ?? "anon", 10, 60_000); // 10 req/min
if (!allowed) return NextResponse.json({ error: "Too many requests" }, { status: 429 });
```

For multi-instance deployments, use Redis (Upstash) instead of in-memory.

---

### Cost Optimization

**AI:**
- Use `claude-haiku-4-5` for high-volume simple tasks (classification, short summaries)
- Use `claude-sonnet-4-6` for reasoning-heavy tasks
- Enable prompt caching for repeated large prompts (up to 90% savings on cached tokens)
- Set `max_tokens` as low as the task allows

**Firestore:**
- Reads are cheap; writes cost more — batch where possible
- Cache frequent reads client-side for short TTLs
- Add filters to queries — never unbounded `getDocs()` on large collections

**Storage:**
- Compress images before upload
- Set lifecycle policies to delete old files automatically

---

## 8. Testing & Quality

### Automated Testing

**Unit tests** for pure functions and utilities:
```bash
npm install -D vitest @testing-library/react
```

```ts
// src/lib/validation.test.ts
import { isEmail } from "./validation";

test("valid email passes", () => expect(isEmail("user@example.com").valid).toBe(true));
test("invalid email fails", () => expect(isEmail("not-an-email").valid).toBe(false));
```

**AI output testing — validate structure, not exact text:**
```ts
const { data } = await api.post("/api/ai", { message: "Extract price from: $19.99" });
expect(data.response).toMatch(/19\.99/);
expect(typeof data.response).toBe("string");
```

---

### CI/CD Pipelines

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: cd app && npm install
      - run: cd app && npm run lint
      - run: cd app && npm test
```

Vercel auto-deploys on push to `main` — no additional config needed.

---

### Performance Profiling

- DevTools → **Lighthouse** → run for Core Web Vitals
- `next build` output shows bundle sizes — watch for large chunks
- Lazy-load heavy components:
  ```ts
  const HeavyChart = dynamic(() => import("@/components/HeavyChart"), { ssr: false });
  ```
- Add timing logs to slow API routes:
  ```ts
  console.time("db-query");
  const data = await getDocs("orders");
  console.timeEnd("db-query");
  ```

---

### Error Handling & Resilience

**Wrap unstable UI sections** with `ErrorBoundary`:
```tsx
import ErrorBoundary from "@/components/common/ErrorBoundary";

<ErrorBoundary fallback={<p>This section failed to load.</p>}>
  <UnstableWidget />
</ErrorBoundary>
```

**Retry transient failures:**
```ts
async function withRetry<T>(fn: () => Promise<T>, retries = 3, delayMs = 500): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try { return await fn(); }
    catch (e) {
      if (i === retries - 1) throw e;
      await new Promise((r) => setTimeout(r, delayMs * (i + 1)));
    }
  }
  throw new Error("Max retries exceeded");
}
```

Always return `{ error: string }` with the right HTTP status from API routes so the frontend can handle failures gracefully.

---

## 9. Advanced Topics

### System Design for Scale

| Pattern | When to use |
|---|---|
| **Background jobs** | Long-running tasks — offload to a queue (Cloud Tasks, BullMQ) |
| **Caching layer** | High-read, low-write data — add Redis (Upstash) in front of Firestore |
| **Microservices** | When one domain needs independent scaling |
| **Edge functions** | Low-latency personalization — deploy middleware to CDN edge |

```ts
// Don't run slow work inline in an API route (it will time out):
await processLargeFile(file);  // bad

// Queue it and return immediately:
await queue.add("process-file", { fileUrl });
return NextResponse.json({ status: "queued" }, { status: 202 });
```

---

### API Design

**Versioning** — prefix routes for breaking changes:
```
/api/v1/users    current stable
/api/v2/users    new version with breaking changes
```

**Consistent response shape:**
```ts
{ data: T,    error: null }      // success
{ data: null, error: "message" } // failure
```

**Deprecation** — give consumers time:
1. Add response headers: `Deprecation: true`, `Sunset: 2026-01-01`
2. Log usage of deprecated endpoints
3. Remove only after the sunset date

---

### Database Query Optimization

**Firestore indexes** — compound queries require composite indexes:
```ts
// This will fail without a composite index — Firebase Console shows a link to create it
await queryDocs("orders", "userId", "==", uid);  // + orderBy("createdAt")
```

**Avoid N+1 queries:**
```ts
// Bad — one query per order
for (const order of orders) {
  const user = await getDoc("users", order.userId);
}

// Good — fetch all at once
const userIds = [...new Set(orders.map((o) => o.userId))];
const users   = await Promise.all(userIds.map((id) => getDoc("users", id)));
```

**Paginate large collections:**
```ts
const snap = await getDb()
  .collection("orders")
  .orderBy("createdAt", "desc")
  .limit(20)
  .startAfter(lastDoc)
  .get();
```

---

## Project Structure

```
_base-template/
├── app/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx              Root layout (header, footer)
│   │   │   ├── page.tsx                Hello World home page
│   │   │   ├── globals.css             Tailwind + global component classes
│   │   │   ├── auth/login/page.tsx     Login page (email + password)
│   │   │   └── api/
│   │   │       ├── [collection]/       Generic Firestore CRUD
│   │   │       ├── auth/login/         Issues JWT on login
│   │   │       ├── auth/logout/        Clears auth cookie
│   │   │       └── ai/                 Claude API route (standard + streaming)
│   │   ├── components/
│   │   │   ├── ui/Button.tsx           Button (variants, sizes, loading)
│   │   │   └── common/
│   │   │       ├── LoadingOverlay.tsx   Full-screen loading spinner
│   │   │       └── ErrorBoundary.tsx    React error boundary
│   │   ├── hooks/useAuth.ts            Auth state hook
│   │   ├── lib/
│   │   │   ├── firebase/admin.ts       Firebase Admin SDK init
│   │   │   ├── firebase/crud.ts        CRUD helpers
│   │   │   ├── auth/tokenGenerator.ts  JWT signing (server)
│   │   │   ├── auth/tokenVerifier.ts   JWT verification (server)
│   │   │   ├── auth/authService.ts     Session state (client)
│   │   │   ├── auth/authInterceptor.ts Auto auth headers (client)
│   │   │   ├── anthropic/client.ts     Claude client singleton
│   │   │   ├── apiClient.ts            Typed fetch wrapper
│   │   │   └── validation.ts           Form/input validators
│   │   ├── middleware.ts               Route protection (JWT cookie check)
│   │   └── theme/colors.ts            Semantic color tokens
│   ├── package.json
│   ├── tailwind.config.ts
│   ├── next.config.ts
│   ├── postcss.config.js
│   └── tsconfig.json
├── scrapers/
│   ├── config.py
│   ├── base_scraper.py
│   ├── example_scraper.py
│   └── requirements.txt
├── .env.example
├── .gitignore
├── service-account.placeholder.json
├── README.md
└── USER_GUIDE.md
```
