import { StepData } from "../types";

export const step9Agents: StepData = {
  id: "building-agents",
  stepNumber: 9,
  title: "Building Agents",
  subtitle: "Understand what AI agents are and how to build them into your app.",
  estimatedMinutes: 15,
  sections: [
    {
      title: "What Is an AI Agent?",
      blocks: [
        {
          type: "text",
          content:
            "You've been using an AI agent this whole time — Claude Code is an agent! An agent is an AI that doesn't just answer questions — it can take actions. It can read files, run commands, make API calls, and decide what to do next based on results. A regular chatbot just responds; an agent can actually DO things.",
        },
        {
          type: "callout",
          variant: "info",
          content:
            "Think of the difference like this: a chatbot is like asking someone for directions. An agent is like having a co-pilot who can actually drive the car, check the GPS, and re-route if there's traffic.",
        },
      ],
    },
    {
      title: "Agents vs Chatbots",
      blocks: [
        {
          type: "text",
          content: "Here's what makes an agent different from a simple AI chat:",
        },
        {
          type: "checklist",
          content: "",
          items: [
            "Tools — Agents can use tools (search the web, query databases, call APIs, read/write files)",
            "Multi-step reasoning — Instead of one prompt → one response, agents can plan multiple steps and execute them",
            "Decision-making — Agents decide WHAT tool to use and WHEN based on the situation",
            "Memory — Agents can remember context from earlier in the conversation to inform later decisions",
          ],
        },
      ],
    },
    {
      title: "How to Build an Agent",
      blocks: [
        {
          type: "text",
          content:
            "Building an agent is essentially giving an LLM access to tools and letting it decide when to use them. Here's the basic pattern:",
        },
        {
          type: "checklist",
          content: "",
          items: [
            "Define the tools your agent can use (e.g., \"search the database\", \"send an email\", \"create a file\")",
            "Write a system prompt that describes the agent's role and available tools",
            "Send the user's request to the LLM along with the tool definitions",
            "The LLM decides which tool(s) to call and with what inputs",
            "Your code executes the tool calls and sends the results back to the LLM",
            "The LLM uses the results to form its next response (or call more tools)",
            "This loop continues until the agent has a final answer",
          ],
        },
        {
          type: "callout",
          variant: "tip",
          content:
            "Both Claude and OpenAI support \"function calling\" / \"tool use\" — a structured way for the model to request specific actions. Your AI coding agent can help you implement this pattern.",
        },
      ],
    },
    {
      title: "Example: A Data Lookup Agent",
      blocks: [
        {
          type: "text",
          content:
            "Let's say you want to build an agent that can answer questions about data in your Firestore database. Here's how you'd describe it to your AI coding agent:",
        },
        {
          type: "code",
          language: "text",
          label: "Prompt for your AI agent",
          content: `Build an AI agent API route at app/src/app/api/agent/route.ts that:
- Receives a user question via POST
- Uses Claude with tool_use to give it access to these tools:
  1. "search_collection" - queries a Firestore collection with filters
  2. "get_document" - fetches a specific document by ID
- The agent should analyze the user's question, decide which tool to call,
  execute the Firestore query, then use the results to answer the question
- Use the existing crud.ts helpers for database operations
- Return the agent's final answer as JSON`,
        },
        {
          type: "text",
          content:
            "Your AI coding agent will use the existing Firestore CRUD helpers and Claude's tool_use feature to build this. The result is an agent that can answer natural language questions about your data.",
        },
      ],
    },
    {
      title: "Ideas for Your Own Agents",
      blocks: [
        {
          type: "text",
          content:
            "Now that you have all the building blocks — a database, authentication, APIs, web scraping, and LLM integration — you can combine them to build powerful agents. Here are some ideas:",
        },
        {
          type: "checklist",
          content: "",
          items: [
            "Research Agent — Scrapes websites, summarizes findings, and saves them to your database",
            "Customer Support Agent — Answers questions by looking up relevant data from your Firestore collections",
            "Content Generator — Creates blog posts, product descriptions, or reports using AI and saves them",
            "Data Analyst — Takes natural language questions, queries your database, and explains the results",
            "Notification Agent — Monitors data changes and sends alerts when certain conditions are met",
          ],
        },
        {
          type: "callout",
          variant: "success",
          content:
            "The best part? You don't have to write all the code yourself. Describe what you want to your AI coding agent and work with it to build these features step by step. That's the power of AI-assisted development!",
        },
      ],
    },
    {
      title: "What You've Accomplished",
      blocks: [
        {
          type: "text",
          content:
            "If you've worked through all 9 steps, you now understand:",
        },
        {
          type: "checklist",
          content: "",
          items: [
            "How a modern web application is structured (frontend + backend + database)",
            "How to manage secrets and environment variables securely",
            "How to set up a database and store data",
            "How authentication works (signup, login, sessions, protected routes)",
            "How to create and use API endpoints",
            "How to scrape data from websites",
            "How to integrate AI models into your applications",
            "What agents are and how to build them",
            "How to use Git to manage your code and collaborate",
          ],
        },
        {
          type: "text",
          content:
            "Most importantly, you know how to work WITH an AI coding agent to build all of this. You don't need to memorize syntax or write every line of code — you need to understand the concepts and guide your agent in the right direction. That's modern software development.",
        },
        {
          type: "callout",
          variant: "tip",
          content:
            "Keep experimenting! The best way to learn is to build something you're excited about. Take this template, pick a project idea, and start asking your AI agent to help you build it.",
        },
      ],
    },
  ],
};
