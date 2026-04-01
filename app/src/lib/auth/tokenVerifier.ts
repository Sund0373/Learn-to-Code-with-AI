import { jwtVerify } from "jose";

/**
 * Verifies a JWT token signature and expiry.
 * Returns the decoded payload if valid, null otherwise.
 */
export async function verifyToken(
  token: string
): Promise<Record<string, unknown> | null> {
  if (!token) return null;

  // Quick format check before attempting crypto
  if (!/^[\w-]+\.[\w-]+\.[\w-.+/=]*$/.test(token)) return null;

  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET environment variable is not set");
    return null;
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS256"],
      clockTolerance: 30, // allow 30s clock skew
    });

    // Enforce required claims — add/remove as needed for your project
    if (!payload.uid || !payload.email) {
      console.warn("Token missing required claims (uid, email)");
      return null;
    }

    return payload as Record<string, unknown>;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}
