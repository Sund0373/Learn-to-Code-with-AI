import Anthropic from "@anthropic-ai/sdk";

let client: Anthropic | null = null;

/**
 * Returns a singleton Anthropic client.
 * Requires ANTHROPIC_API_KEY in environment variables.
 */
export function getAnthropicClient(): Anthropic {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY environment variable is not set");
  }

  if (!client) {
    client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }

  return client;
}

export const CLAUDE_MODEL = "claude-sonnet-4-6";
