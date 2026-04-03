import { StepData } from "../types";

export const step3Env: StepData = {
  id: "env-vars",
  stepNumber: 3,
  title: "Environment Variables & Secrets",
  subtitle: "Set up your secret keys and understand how configuration works.",
  estimatedMinutes: 10,
  sections: [
    {
      title: "What Are Environment Variables?",
      blocks: [
        {
          type: "text",
          content:
            "Environment variables are secret values your application needs to run — API keys, database passwords, encryption keys. They live in a special file called `.env.local` that is NEVER uploaded to GitHub (it's in the `.gitignore`). This keeps your secrets safe.",
        },
        {
          type: "callout",
          variant: "warning",
          content:
            "Never put API keys, passwords, or secrets directly in your code files. Always use environment variables. If you accidentally push a secret to GitHub, consider it compromised and rotate it immediately.",
        },
      ],
    },
    {
      title: "What Is .gitignore?",
      blocks: [
        {
          type: "text",
          content:
            "Before we create any secret files, you need to understand `.gitignore`. This is a special file in your project that tells Git which files to completely ignore — Git won't track them, commit them, or push them to GitHub.",
        },
        {
          type: "text",
          content:
            "Your project already has a `.gitignore` that includes `.env.local` and `service-account.json`. That means even if you run `git add .`, these files will be skipped. This is how you keep secrets out of GitHub.",
        },
        {
          type: "callout",
          variant: "tip",
          content:
            "If a file shows up in grey in VS Code's file explorer, that usually means it's being ignored by Git. You can also run `git status` at any time — ignored files won't appear in the list.",
        },
      ],
    },
    {
      title: "Create Your .env.local File",
      blocks: [
        {
          type: "text",
          content:
            "There's already a template file called `.env.example` in the project root that shows all the variables you'll need. Let's copy it to create your actual config file.",
        },
        {
          type: "terminal",
          content: "cp .env.example .env.local",
          label: "Run this from the app/ directory",
        },
        {
          type: "text",
          content:
            "Now open `.env.local` in your editor. You'll see empty variables that we'll fill in over the next few steps. It should look like this:",
        },
        {
          type: "code",
          language: "env",
          label: ".env.local",
          content: `# Firebase Client (public, safe for browser)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# AI Providers (set one or both)
ANTHROPIC_API_KEY=
OPENAI_API_KEY=

# JWT Auth
JWT_SECRET=

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000`,
        },
      ],
    },
    {
      title: "Generate Your JWT Secret",
      blocks: [
        {
          type: "text",
          content:
            "The `JWT_SECRET` is a random string used to sign authentication tokens. Think of it like a unique stamp your app uses to verify that login sessions are real and haven't been tampered with.",
        },
        {
          type: "text",
          content: "Generate one by running this in your terminal:",
        },
        {
          type: "terminal",
          content: "node -e \"console.log(require('crypto').randomBytes(32).toString('base64'))\"",
          label: "Generate a random secret",
        },
        {
          type: "text",
          content:
            "Copy the output (it'll look like a random string of letters and numbers) and paste it as the value for `JWT_SECRET` in your `.env.local` file:",
        },
        {
          type: "code",
          language: "env",
          label: ".env.local",
          content: "JWT_SECRET=your-generated-string-goes-here",
        },
      ],
    },
    {
      title: "Server vs Client Variables",
      blocks: [
        {
          type: "text",
          content:
            "Notice some variables start with `NEXT_PUBLIC_` and others don't. This is an important security distinction:",
        },
        {
          type: "checklist",
          content: "",
          items: [
            "`NEXT_PUBLIC_*` variables are visible to the browser — anyone can see them. Only put non-secret config here (like your Firebase project ID).",
            "Variables WITHOUT the prefix are server-only — they can never be accessed from the browser. Put all secrets here (API keys, JWT secret).",
          ],
        },
        {
          type: "callout",
          variant: "warning",
          content:
            "If you put your ANTHROPIC_API_KEY with a NEXT_PUBLIC_ prefix, anyone visiting your site could steal it and use your API credits. The server-only protection prevents this.",
        },
      ],
    },
    {
      title: "Set the App URL",
      blocks: [
        {
          type: "text",
          content:
            "The last easy one — set your app URL. For local development, it's already correct:",
        },
        {
          type: "code",
          language: "env",
          label: ".env.local",
          content: "NEXT_PUBLIC_APP_URL=http://localhost:3000",
        },
        {
          type: "callout",
          variant: "info",
          content:
            "We'll fill in the Firebase and Anthropic variables in the next steps when we create those accounts. For now, you've got your JWT_SECRET and app URL set.",
        },
      ],
    },
    {
      title: "Restart Your Dev Server",
      blocks: [
        {
          type: "text",
          content:
            "Whenever you change `.env.local`, you need to restart your development server for the changes to take effect. Stop the server (Ctrl+C in your terminal) and start it again:",
        },
        {
          type: "terminal",
          content: "npm run dev",
        },
        {
          type: "callout",
          variant: "success",
          content:
            "Your environment is now configured! The remaining empty variables (Firebase, Anthropic) will be filled in as we set up those services in the upcoming steps.",
        },
        {
          type: "code",
          language: "text",
          label: "Tell your AI agent",
          content:
            "I've created my .env.local file in the app/ directory with my JWT_SECRET and app URL configured. The Firebase and Anthropic keys are still empty — we'll add those next.",
        },
      ],
    },
  ],
};
