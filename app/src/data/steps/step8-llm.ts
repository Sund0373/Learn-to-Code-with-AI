import { StepData } from "../types";

export const step8Llm: StepData = {
  id: "llm-apis",
  stepNumber: 9,
  title: "Connecting to LLM APIs",
  subtitle: "Get API keys for Claude and/or OpenAI and test AI-powered features.",
  estimatedMinutes: 15,
  sections: [
    {
      title: "What Are LLM APIs?",
      blocks: [
        {
          type: "text",
          content:
            "LLMs (Large Language Models) like Claude and ChatGPT are the AI models that power tools like Claude Code. You can integrate them directly into your own apps via their APIs. Instead of chatting with them in a browser, your code sends them a prompt and gets a response back — this is how you build AI features into anything.",
        },
        {
          type: "text",
          content:
            "This template's `/api/ai` endpoint supports both Claude (Anthropic) and GPT (OpenAI). Just add the API key for whichever provider you want to use — or both. The endpoint auto-detects which is available.",
        },
        {
          type: "callout",
          variant: "info",
          content:
            "You only need ONE provider to proceed. Set up whichever you prefer — or both if you want to compare them.",
        },
      ],
    },
    {
      title: "Option A: Set Up Claude (Anthropic)",
      blocks: [
        {
          type: "callout",
          variant: "tip",
          content:
            "You'll need to run a terminal command after adding your key. Open a new terminal in VS Code (click the + button in the terminal panel) — keep your dev server running in the other one.",
        },
        {
          type: "checklist",
          content: "",
          items: [
            "Go to console.anthropic.com",
            "Create an account or sign in",
            "Click \"API Keys\" in the left sidebar",
            "Click \"Create Key\"",
            "Give it a name (e.g., \"my-training-app\")",
            "Copy the key — you'll only see it once!",
          ],
        },
        {
          type: "text",
          content: "Add it to your `.env.local` file:",
        },
        {
          type: "code",
          language: "env",
          label: ".env.local",
          content: "ANTHROPIC_API_KEY=sk-ant-api03-...",
        },
        {
          type: "callout",
          variant: "warning",
          content:
            "API keys cost money when used. Anthropic gives you a small amount of free credits to start. Keep an eye on your usage at console.anthropic.com to avoid surprises.",
        },
      ],
    },
    {
      title: "Option B: Set Up OpenAI",
      blocks: [
        {
          type: "checklist",
          content: "",
          items: [
            "Go to platform.openai.com",
            "Create an account or sign in",
            "Click your profile icon > \"API keys\" (or go to platform.openai.com/api-keys)",
            "Click \"Create new secret key\"",
            "Give it a name and copy the key",
          ],
        },
        {
          type: "text",
          content: "Add it to your `.env.local` file:",
        },
        {
          type: "code",
          language: "env",
          label: ".env.local",
          content: "OPENAI_API_KEY=sk-...",
        },
      ],
    },
    {
      title: "Test the AI Endpoint",
      blocks: [
        {
          type: "text",
          content:
            "After adding your key(s) to `.env.local`:",
        },
        {
          type: "checklist",
          content: "",
          items: [
            "Close your terminal completely (not just Ctrl+C — close the tab/window)",
            "Open a fresh terminal and run `npm run dev`",
            "In your browser, do a hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)",
            "You should see the \"AI Assistant\" button appear in the top-right of the header",
          ],
        },
        {
          type: "callout",
          variant: "warning",
          content:
            "Environment variable changes require a full server restart. Ctrl+C alone sometimes doesn't fully kill the Node process on Windows — close the terminal entirely to be safe. The hard browser refresh ensures the page re-fetches the AI status.",
        },
        {
          type: "text",
          content:
            "You can also ask your AI coding agent to build a test page:",
        },
        {
          type: "code",
          language: "text",
          label: "Tell your AI agent",
          content: `Create a simple test page at app/src/app/ai-test/page.tsx that:
- Has a text input and a "Send" button
- When clicked, sends the input to /api/ai via POST
- Displays the AI response below the input
- Also show which provider was used (it's in the response JSON)
- Keep it simple, no streaming needed for now`,
        },
        {
          type: "text",
          content: "Once created, open it in a new tab:",
        },
        {
          type: "link",
          content: "/ai-test",
          label: "Open AI Test Page",
        },
        {
          type: "text",
          content:
            "Type a question and click Send. You should see a response from Claude or GPT, along with which provider handled it.",
        },
      ],
    },
    {
      title: "How the Endpoint Works",
      blocks: [
        {
          type: "text",
          content:
            "The `/api/ai` route at `app/src/app/api/ai/route.ts` automatically picks the right provider:",
        },
        {
          type: "checklist",
          content: "",
          items: [
            "If only `ANTHROPIC_API_KEY` is set → uses Claude",
            "If only `OPENAI_API_KEY` is set → uses OpenAI",
            "If both are set → defaults to Claude, but you can pass `{ provider: \"openai\" }` in the request body to override",
            "Supports streaming for both providers (pass `{ stream: true }` for a ChatGPT-like typing effect)",
          ],
        },
        {
          type: "text",
          content: "Both providers use the same system prompt defined at the top of the route file. The system prompt is the most important part of AI integration — it tells the model what role to play and how to respond.",
        },
        {
          type: "callout",
          variant: "tip",
          content:
            "Want to customize the AI's behavior? Tell your agent: \"Update the SYSTEM_PROMPT in api/ai/route.ts to act as a [describe the role you want].\" The system prompt shapes everything about how the AI responds.",
        },
      ],
    },
    {
      title: "Try the OpenAI Playground",
      blocks: [
        {
          type: "text",
          content:
            "If you set up OpenAI, the Playground is a great way to experiment with prompts without writing code:",
        },
        {
          type: "checklist",
          content: "",
          items: [
            "Go to platform.openai.com/playground",
            "Select a model (gpt-4o-mini is cheapest for testing)",
            "Type a system prompt (e.g., \"You are a helpful coding tutor\")",
            "Type a user message and click \"Submit\"",
            "Experiment with different system prompts and see how responses change",
          ],
        },
        {
          type: "callout",
          variant: "info",
          content:
            "The Playground uses the same API your code uses — it's just a visual interface for testing. Once you find prompts that work well, you can copy them into your app's SYSTEM_PROMPT.",
        },
        {
          type: "code",
          language: "text",
          label: "Tell your AI agent",
          content:
            "My AI API key(s) are configured in app/.env.local and working. The /api/ai endpoint supports both Claude and OpenAI with auto-detection. The SYSTEM_PROMPT in api/ai/route.ts is still the default placeholder — help me customize it for [describe your use case].",
        },
      ],
    },
  ],
};
