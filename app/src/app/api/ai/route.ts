/**
 * POST /api/ai
 *
 * Sends a message to Claude or OpenAI and returns the response.
 * Auto-detects which provider to use based on which API key is set.
 * If both are set, defaults to Claude. Override with { provider: "openai" }.
 *
 * Request body:
 *   { message: string, stream?: boolean, provider?: "anthropic" | "openai" }
 *
 * Standard response:
 *   { response: string, provider: string }
 *
 * Streaming response:
 *   text/event-stream — each chunk: data: {"text":"..."}\n\n
 */

import { NextRequest, NextResponse } from "next/server";
import { getAnthropicClient, CLAUDE_MODEL } from "@/lib/anthropic/client";
import { getOpenAIClient, OPENAI_MODEL } from "@/lib/openai/client";

// ─── System prompt for the built-in AI assistant ─────────────────────────────
const SYSTEM_PROMPT = `You are an AI learning assistant built into a full-stack web development training template. Your users are students learning to code with the help of AI tools like Claude Code.

The template they are using includes:
- A Next.js 15 web application with React 19 and TypeScript
- Firebase Authentication (email/password login/signup)
- Firestore database with a "products" collection of sample data
- API routes for auth, CRUD operations, and AI integration
- A Python web scraping toolkit using Playwright
- Tailwind CSS for styling

Help students understand:
- How the pieces of their application fit together
- Web development concepts (frontend, backend, APIs, databases, authentication)
- How to describe what they want to their AI coding agent effectively
- Debugging when something isn't working

Keep answers concise and practical. Use simple language — avoid jargon unless you explain it. When relevant, reference specific files in the project structure. If a student asks you to write code, remind them to use their AI coding agent (like Claude Code) for that — you're here to explain concepts and help them understand.`;
// ─────────────────────────────────────────────────────────────────────────────

type Provider = "anthropic" | "openai";

function detectProvider(requested?: string): Provider {
  const hasAnthropic = Boolean(process.env.ANTHROPIC_API_KEY);
  const hasOpenAI = Boolean(process.env.OPENAI_API_KEY);

  if (requested === "openai" && hasOpenAI) return "openai";
  if (requested === "anthropic" && hasAnthropic) return "anthropic";
  if (hasAnthropic) return "anthropic";
  if (hasOpenAI) return "openai";

  throw new Error("No AI API key configured. Set ANTHROPIC_API_KEY or OPENAI_API_KEY in .env.local");
}

// ─── Anthropic (Claude) ─────────────────────────────────────────────────────

async function handleAnthropic(message: string, stream: boolean) {
  const client = getAnthropicClient();

  if (stream) {
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          const s = client.messages.stream({
            model: CLAUDE_MODEL,
            max_tokens: 1024,
            system: SYSTEM_PROMPT,
            messages: [{ role: "user", content: message }],
          });

          s.on("text", (text: string) => {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
            );
          });

          await s.finalMessage();
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (err) {
          const msg = err instanceof Error ? err.message : "Stream failed";
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: msg })}\n\n`)
          );
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  }

  const response = await client.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: message }],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";

  return NextResponse.json({ response: text, provider: "anthropic" });
}

// ─── OpenAI (GPT) ───────────────────────────────────────────────────────────

async function handleOpenAI(message: string, stream: boolean) {
  const client = getOpenAIClient();

  if (stream) {
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          const s = await client.chat.completions.create({
            model: OPENAI_MODEL,
            max_tokens: 1024,
            stream: true,
            messages: [
              { role: "system", content: SYSTEM_PROMPT },
              { role: "user", content: message },
            ],
          });

          for await (const chunk of s) {
            const text = chunk.choices[0]?.delta?.content;
            if (text) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
              );
            }
          }

          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (err) {
          const msg = err instanceof Error ? err.message : "Stream failed";
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: msg })}\n\n`)
          );
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  }

  const response = await client.chat.completions.create({
    model: OPENAI_MODEL,
    max_tokens: 1024,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: message },
    ],
  });

  const text = response.choices[0]?.message?.content || "";

  return NextResponse.json({ response: text, provider: "openai" });
}

// ─── Route handler ──────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const { message, stream = false, provider: requestedProvider } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "message is required" }, { status: 400 });
    }

    const provider = detectProvider(requestedProvider);

    if (provider === "openai") {
      return handleOpenAI(message, stream);
    }

    return handleAnthropic(message, stream);
  } catch (error) {
    console.error("AI route error:", error);
    const msg = error instanceof Error ? error.message : "Failed to get AI response";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
