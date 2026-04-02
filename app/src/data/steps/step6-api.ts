import { StepData } from "../types";

export const step6Api: StepData = {
  id: "creating-api",
  stepNumber: 6,
  title: "Creating an API",
  subtitle: "Understand how your backend works and create your own endpoint.",
  estimatedMinutes: 15,
  sections: [
    {
      title: "What Is an API?",
      blocks: [
        {
          type: "text",
          content:
            "An API (Application Programming Interface) is how the frontend (what users see) talks to the backend (where data and logic live). When you click \"Sign in\" on the login page, the browser sends a request to `/api/auth/login` — that's an API endpoint. It processes the request and sends back a response.",
        },
        {
          type: "text",
          content:
            "In Next.js, API routes live in the `app/api/` folder. Each folder with a `route.ts` file becomes an endpoint. For example:",
        },
        {
          type: "checklist",
          content: "",
          items: [
            "`POST /api/auth/login` — verifies credentials and creates a session",
            "`POST /api/auth/signup` — creates a new account and session",
            "`app/api/ai/route.ts` → handles `POST /api/ai`",
            "`app/api/[collection]/route.ts` → handles any collection (dynamic route)",
          ],
        },
      ],
    },
    {
      title: "Your Built-In APIs",
      blocks: [
        {
          type: "text",
          content:
            "This template comes with several API routes already built. Here's what you have:",
        },
        {
          type: "checklist",
          content: "",
          items: [
            "Authentication: `/api/auth/login`, `/api/auth/signup`, `/api/auth/logout` — handle user sessions",
            "AI: `/api/ai` — sends messages to Claude and returns responses (standard or streaming)",
            "CRUD: `/api/[collection]` — a generic route that lets you create, read, update, and delete data in ANY Firestore collection",
          ],
        },
      ],
    },
    {
      title: "The Generic CRUD Route",
      blocks: [
        {
          type: "text",
          content:
            "The `[collection]` route is especially powerful. The brackets mean it's dynamic — it matches any URL. So `/api/products`, `/api/users`, `/api/blog-posts` all hit the same route, and the collection name is pulled from the URL.",
        },
        {
          type: "text",
          content: "Here's what each HTTP method does:",
        },
        {
          type: "checklist",
          content: "",
          items: [
            "`GET /api/products` — List all products",
            "`GET /api/products?id=abc123` — Get a single product by ID",
            "`POST /api/products` with a JSON body — Create a new product",
            "`PATCH /api/products?id=abc123` with a JSON body — Update a product",
            "`DELETE /api/products?id=abc123` — Delete a product",
          ],
        },
        {
          type: "callout",
          variant: "tip",
          content:
            "You can test these right now! If Firebase is set up from Step 4, try opening your browser to http://localhost:3000/api/products — you should get an empty array back (since there's no data yet).",
        },
      ],
    },
    {
      title: "Exercise: Create a Custom API Endpoint",
      blocks: [
        {
          type: "text",
          content:
            "Let's create a simple API endpoint that returns some information. Ask your AI coding agent to help you. Try giving it a prompt like:",
        },
        {
          type: "code",
          language: "text",
          label: "Prompt for your AI agent",
          content: `Create a new API route at app/src/app/api/hello/route.ts that:
- Handles GET requests
- Returns a JSON response with { message: "Hello from my API!", timestamp: current date/time }
- Returns a 200 status code`,
        },
        {
          type: "text",
          content: "Once your agent creates the file, test it by visiting:",
        },
        {
          type: "terminal",
          content: "http://localhost:3000/api/hello",
          label: "Open in your browser",
        },
        {
          type: "text",
          content:
            "You should see a JSON response with your message and the current timestamp. You just created your first API endpoint!",
        },
        {
          type: "callout",
          variant: "info",
          content:
            "API routes in Next.js are server-side only — the code in route.ts never runs in the browser. This is where you put logic that needs to be secure: database queries, API key usage, data validation, etc.",
        },
      ],
    },
    {
      title: "How Frontend Talks to Backend",
      blocks: [
        {
          type: "text",
          content:
            "This template includes a typed API client at `lib/apiClient.ts` that makes calling your APIs clean and easy. Instead of writing raw `fetch()` calls, you can use:",
        },
        {
          type: "code",
          language: "typescript",
          label: "How to use the API client in your frontend code",
          content: `import { api } from "@/lib/apiClient";

// GET request
const { data, error } = await api.get<Product[]>("/api/products");

// POST request
const { data, error } = await api.post<{ id: string }>("/api/products", {
  name: "Widget",
  price: 9.99,
});`,
        },
        {
          type: "text",
          content:
            "The API client automatically includes your authentication token, handles errors, and gives you typed responses. Your AI agent can use this whenever it builds frontend features that need to talk to the backend.",
        },
      ],
    },
  ],
};
