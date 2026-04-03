import { StepData } from "../types";

export const step1Welcome: StepData = {
  id: "welcome",
  stepNumber: 1,
  title: "Your First Website Is Live",
  subtitle: "Understand what you just launched and how the project is structured.",
  estimatedMinutes: 10,
  sections: [
    {
      title: "Congratulations!",
      blocks: [
        {
          type: "text",
          content:
            "If you're reading this in your browser, you've already accomplished something huge — you're running a full web application on your own computer. The page you're looking at right now is being served by a framework called Next.js, which is one of the most popular tools for building modern websites.",
        },
        {
          type: "callout",
          variant: "info",
          content:
            "Next.js is built on top of React, which is a library for building user interfaces. Together, they handle everything from rendering pages in your browser to running server-side code for APIs and authentication.",
        },
      ],
    },
    {
      title: "What's Running Right Now",
      blocks: [
        {
          type: "text",
          content:
            "When you ran `npm run dev`, you started a local development server. This server watches your files for changes and automatically refreshes your browser when you save — this is called \"hot reload.\" It's running at:",
        },
        {
          type: "terminal",
          content: "http://localhost:3000",
        },
        {
          type: "text",
          content:
            "This is only running on YOUR computer — nobody else can see it. Later, you'll learn how to deploy it so the whole world can access it.",
        },
      ],
    },
    {
      title: "Project Structure",
      blocks: [
        {
          type: "text",
          content:
            "Here's how this project is organized. Don't worry about memorizing it — you'll get familiar with it as you work through the steps.",
        },
        {
          type: "file-tree",
          content: `Base_Template/
├── app/                        # The Next.js web application
│   ├── src/
│   │   ├── app/                # Pages & API routes
│   │   │   ├── page.tsx        # Home page (what you see at /)
│   │   │   ├── layout.tsx      # Shared layout (header, footer)
│   │   │   ├── learn/          # This wizard!
│   │   │   ├── auth/           # Login & signup pages
│   │   │   ├── dashboard/      # Protected dashboard
│   │   │   └── api/            # Backend API endpoints
│   │   ├── components/         # Reusable UI components
│   │   ├── lib/                # Utilities (auth, database, AI)
│   │   └── hooks/              # React hooks
│   ├── package.json            # Dependencies & scripts
│   └── tailwind.config.ts      # Styling configuration
│
├── scrapers/                   # Python web scraping tools
│   ├── base_scraper.py         # Base class for scrapers
│   ├── example_scraper.py      # Example to copy & customize
│   └── config.py               # Target URL & selectors
│
└── .env.local                  # Your secret keys (you'll create this)`,
        },
        {
          type: "callout",
          variant: "tip",
          content:
            "Files ending in .tsx are TypeScript React files — they contain both logic and UI. Files ending in .ts are pure TypeScript (no UI). You'll be working with both.",
        },
      ],
    },
    {
      title: "Your AI Coding Agent",
      blocks: [
        {
          type: "text",
          content:
            "Throughout this tutorial, you'll be working WITH an AI coding agent (like Claude Code). You won't need to write code by hand — your agent will handle that. Your job is to understand the concepts, complete the setup steps, and tell your agent what to build.",
        },
        {
          type: "callout",
          variant: "tip",
          content:
            "Think of your AI agent like a very capable junior developer sitting next to you. You make the decisions and guide the direction — it writes the code. The better you understand what you want, the better results you'll get.",
        },
        {
          type: "text",
          content:
            "When you see a box labeled \"Tell your AI agent,\" that's a suggested prompt you can give to your coding agent after completing a manual step. This helps your agent understand what you've set up so it can build on top of it.",
        },
      ],
    },
    {
      title: "Try It: Hot Reload",
      blocks: [
        {
          type: "text",
          content:
            "Let's prove that hot reload works. See the heading below?",
        },
        {
          type: "component",
          content: "HelloWorldDemo",
        },
        {
          type: "text",
          content:
            "Ask your AI coding agent to change it:",
        },
        {
          type: "code",
          language: "text",
          label: "Tell your AI agent",
          content:
            "Change the \"Hello, World\" heading on Step 1 to say \"Hello, [your name]\"",
        },
        {
          type: "text",
          content:
            "Watch the heading above — it should update instantly without a manual refresh. That's hot reload in action!",
        },
        {
          type: "callout",
          variant: "success",
          content:
            "If you saw the heading change, everything is working. Your agent can make changes to ANY file in the project and you'll see the result immediately.",
        },
      ],
    },
    {
      title: "Key Concepts",
      blocks: [
        {
          type: "text",
          content: "Before moving on, here are a few terms you'll see throughout this tutorial:",
        },
        {
          type: "checklist",
          content: "",
          items: [
            "Frontend — What users see and interact with (pages, buttons, forms)",
            "Backend — Server-side code that handles data, authentication, and business logic",
            "API — An endpoint your frontend calls to talk to the backend (like /api/auth/login)",
            "Component — A reusable piece of UI (a button, a header, a form)",
            "Route — A URL path that maps to a page or API endpoint",
            "Environment Variable — A secret or config value stored outside your code (in .env.local)",
          ],
        },
      ],
    },
  ],
};
