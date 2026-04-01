import { SignJWT } from "jose";

export interface TokenPayload {
  uid: string;
  email: string;
  [key: string]: unknown;
}

/**
 * Generates a signed JWT using HS256.
 * Requires JWT_SECRET in environment variables.
 */
export async function generateToken(
  payload: TokenPayload,
  { expiresIn = 60 * 60 * 24 * 7 } = {} // default: 7 days in seconds
): Promise<string> {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not set");
  }

  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  return new SignJWT(payload as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + expiresIn)
    .sign(secret);
}
