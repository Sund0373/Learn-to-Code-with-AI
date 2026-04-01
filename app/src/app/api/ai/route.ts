/**
 * POST /api/ai
 *
 * Sends a message to Claude and returns the response.
 * Supports both standard (JSON) and streaming (SSE) responses.
 *
 * Request body:
 *   { message: string, stream?: boolean }
 *
 * Standard response:
 *   { response: string }
 *
 * Streaming response:
 *   text/event-stream — each chunk: data: <text>\n\n
 *
 * Usage:
 *   Replace SYSTEM_PROMPT with your task-specific instructions.
 *   Add message history support if you need multi-turn conversations.
 */

import { NextRequest, NextResponse } from "next/server";
import { getAnthropicClient, CLAUDE_MODEL } from "@/lib/anthropic/client";

// ─── Replace this with your project-specific system prompt ────────────────────
const SYSTEM_PROMPT = `You are a helpful assistant.
Answer clearly and concisely.

// TODO: Replace with your task-specific instructions.
// Examples:
//   "You are a data extraction specialist. Extract structured JSON from the provided text."
//   "You are a customer support agent for [Company]. Help users with [task]."
`;
// ─────────────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const { message, stream = false } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "message is required" }, { status: 400 });
    }

    const client = getAnthropicClient();

    // ─── Streaming response ──────────────────────────────────────────────────
    if (stream) {
      const encoder = new TextEncoder();

      const readable = new ReadableStream({
        async start(controller) {
          const stream = client.messages.stream({
            model:      CLAUDE_MODEL,
            max_tokens: 1024,
            system:     SYSTEM_PROMPT,
            messages:   [{ role: "user", content: message }],
          });

          stream.on("text", (text: string) => {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
            );
          });

          await stream.finalMessage();

          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        },
      });

      return new Response(readable, {
        headers: {
          "Content-Type":  "text/event-stream",
          "Cache-Control": "no-cache",
          Connection:      "keep-alive",
        },
      });
    }

    // ─── Standard response ───────────────────────────────────────────────────
    const response = await client.messages.create({
      model:      CLAUDE_MODEL,
      max_tokens: 1024,
      system:     SYSTEM_PROMPT,
      messages:   [{ role: "user", content: message }],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";

    return NextResponse.json({ response: text });
  } catch (error) {
    console.error("AI route error:", error);
    return NextResponse.json(
      { error: "Failed to get AI response" },
      { status: 500 }
    );
  }
}
