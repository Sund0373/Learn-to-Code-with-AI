import OpenAI from "openai";

let client: OpenAI | null = null;

/**
 * Returns a singleton OpenAI client.
 * Requires OPENAI_API_KEY in environment variables.
 */
export function getOpenAIClient(): OpenAI {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY environment variable is not set");
  }

  if (!client) {
    client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  return client;
}

export const OPENAI_MODEL = "gpt-4o-mini";
