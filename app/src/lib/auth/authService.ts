/**
 * Client-side auth state management.
 *
 * Auth architecture:
 *   - The JWT lives in an httpOnly cookie (set by the server, never accessible to JS)
 *   - The middleware verifies the cookie on every protected request
 *   - This service only tracks userId in sessionStorage as a UI hint
 *     (e.g., "should we show the logged-in header?")
 *   - The cookie is the single source of truth for authentication
 */

const USER_ID_KEY = "userId";

export interface AuthStatus {
  state: "authenticated" | "anonymous";
  userId?: string;
}

/** Check if the user has an active session (client-side hint only). */
export function checkAuthState(): AuthStatus {
  if (typeof window === "undefined") return { state: "anonymous" };

  const userId = sessionStorage.getItem(USER_ID_KEY);
  if (userId) {
    return { state: "authenticated", userId };
  }

  return { state: "anonymous" };
}

/** Mark the user as logged in (called after successful login/signup). */
export function setAuthenticatedState(userId: string): void {
  sessionStorage.setItem(USER_ID_KEY, userId);
}

/** Clear all client-side auth state (called on logout). */
export function clearAllAuthData(): void {
  sessionStorage.removeItem(USER_ID_KEY);
}
