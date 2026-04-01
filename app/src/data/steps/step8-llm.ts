import { StepData } from "../types";

export const step8Llm: StepData = {
  id: "llm-apis",
  stepNumber: 8,
  title: "Connecting to LLM APIs",
  subtitle: "Get API keys for Claude and OpenAI, and test AI-powered features.",
  estimatedMinutes: 15,
  sections: [
    {
      title: "What Are LLM APIs?",
      blocks: [
        {
          type: "text",
          content:
            "LLMs (Large Language Models) like Claude and ChatGPT are the AI models that power tools like Claude Code. You can integrate them directly into your own apps via their APIs. Instead of chatting with them in a browser, your code sends them a prompt and gets a response back — allowing you to build AI features into anything you build.",
        },
      ],
    },
    {
      title: "Option A: Set Up Claude (Anthropic)",
      blocks: [
        {
          type: "text",
          content:
            "This template is pre-wired for Claude. Here's how to get your API key:",
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
          type: "text",
          content:
            "If you also want to experiment with OpenAI's models (GPT-4, etc.), here's how to get set up:",
        },
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
          content:
            "To use OpenAI in your app, you'd add this to `.env.local`:",
        },
        {
          type: "code",
          language: "env",
          label: ".env.local",
          content: "OPENAI_API_KEY=sk-...",
        },
        {
          type: "callout",
          variant: "info",
          content:
            "This template's built-in AI route uses Claude, but your AI coding agent can help you add OpenAI support too. Just ask it to create a new API route that uses the OpenAI SDK.",
        },
      ],
    },
    {
      title: "Test the AI Endpoint",
      blocks: [
        {
          type: "text",
          content:
            "With your Anthropic API key set and dev server restarted, you can test the built-in AI endpoint. Ask your AI coding agent:",
        },
        {
          type: "code",
          language: "text",
          label: "Prompt for your AI agent",
          content: `Create a simple test page at app/src/app/ai-test/page.tsx that:
- Has a text input and a "Send" button
- When clicked, sends the input to /api/ai via POST
- Displays the AI response below the input
- Keep it simple, no streaming needed for now`,
        },
        {
          type: "text",
          content:
            "Once created, visit `http://localhost:3000/ai-test`, type a question, and click Send. You should see Claude's response appear!",
        },
      ],
    },
    {
      title: "Understanding the AI Route",
      blocks: [
        {
          type: "text",
          content:
            "The AI endpoint at `app/src/app/api/ai/route.ts` does a few things:",
        },
        {
          type: "checklist",
          content: "",
          items: [
            "Receives a message from the frontend",
            "Sends it to Claude with a system prompt (instructions that shape how Claude responds)",
            "Can return the full response at once, or stream it word-by-word (for a ChatGPT-like typing effect)",
            "The system prompt in the file is a placeholder — you'd customize it for your specific use case",
          ],
        },
        {
          type: "callout",
          variant: "tip",
          content:
            "The system prompt is the most important part of AI integration. It tells the model what role to play, what rules to follow, and how to format responses. Ask your AI agent to help you write a good system prompt for your specific use case.",
        },
      ],
    },
    {
      title: "Try the OpenAI Playground",
      blocks: [
        {
          type: "text",
          content:
            "While you have your OpenAI account, check out the Playground — it's a great way to experiment with different models and prompts without writing code:",
        },
        {
          type: "checklist",
          content: "",
          items: [
            "Go to platform.openai.com/playground",
            "Select a model (start with GPT-4o-mini for cheaper experimentation)",
            "Type a prompt in the System section (e.g., \"You are a helpful coding tutor\")",
            "Type a user message and click \"Submit\"",
            "Experiment with different system prompts and see how the responses change",
          ],
        },
        {
          type: "callout",
          variant: "info",
          content:
            "The Playground uses the same API your code would use — it's just a visual interface for testing. Once you find prompts that work well, you can copy them into your app's system prompt.",
        },
        {
          type: "code",
          language: "text",
          label: "Tell your AI agent",
          content:
            "My ANTHROPIC_API_KEY is configured in app/.env.local and working. The AI endpoint at /api/ai is functional. The current system prompt in api/ai/route.ts is a placeholder — help me customize it for [describe your use case]. I also have an OpenAI key if we want to add GPT support.",
        },
      ],
    },
  ],
};
