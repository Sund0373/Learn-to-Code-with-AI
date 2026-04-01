export type AuthState = "authenticated" | "recognized" | "anonymous";

export interface AuthStatus {
  state: AuthState;
  token?: string;
  userId?: string;
}

const SESSION_TOKEN_KEY = "sessionToken";
const USER_ID_KEY       = "userId";
const RECOGNIZED_KEY    = "recognizedUser";

// ─── Read ──────────────────────────────────────────────────────────────────────

/**
 * Returns the current auth state by checking sessionStorage then localStorage.
 * - authenticated: active session token present
 * - recognized:    user has logged in before (remembered for 30 days)
 * - anonymous:     no known user
 */
export function checkAuthState(): AuthStatus {
  const token  = sessionStorage.getItem(SESSION_TOKEN_KEY);
  const userId = sessionStorage.getItem(USER_ID_KEY);

  if (token && userId) {
    return { state: "authenticated", token, userId };
  }

  const raw = localStorage.getItem(RECOGNIZED_KEY);
  if (raw) {
    try {
      const recognized = JSON.parse(raw);
      if (recognized.expiresAt && recognized.expiresAt > Date.now()) {
        return { state: "recognized" };
      }
      localStorage.removeItem(RECOGNIZED_KEY);
    } catch {
      localStorage.removeItem(RECOGNIZED_KEY);
    }
  }

  return { state: "anonymous" };
}

// ─── Write ─────────────────────────────────────────────────────────────────────

/** Persist an active session after successful login. */
export function setAuthenticatedState(token: string, userId: string): void {
  sessionStorage.setItem(SESSION_TOKEN_KEY, token);
  sessionStorage.setItem(USER_ID_KEY, userId);

  // Remember this user for 30 days (pre-fills email on next login)
  localStorage.setItem(
    RECOGNIZED_KEY,
    JSON.stringify({
      userId,
      lastLogin: Date.now(),
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
    })
  );
}

/** Clear the active session (but keep recognized state for easier re-login). */
export function clearAuthState(): void {
  sessionStorage.removeItem(SESSION_TOKEN_KEY);
  sessionStorage.removeItem(USER_ID_KEY);
}

/** Full sign-out — clears everything including the remembered user. */
export function clearAllAuthData(): void {
  sessionStorage.removeItem(SESSION_TOKEN_KEY);
  sessionStorage.removeItem(USER_ID_KEY);
  localStorage.removeItem(RECOGNIZED_KEY);
}

/** Returns the current session token, or null if not authenticated. */
export function getSessionToken(): string | null {
  return sessionStorage.getItem(SESSION_TOKEN_KEY);
}
