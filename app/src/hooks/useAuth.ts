"use client";

import { useState, useEffect } from "react";
import { checkAuthState, type AuthStatus } from "@/lib/auth/authService";

interface DecodedUser {
  uid: string;
  email: string;
  [key: string]: unknown;
}

interface UseAuthReturn {
  user: DecodedUser | null;
  authStatus: AuthStatus;
  isLoading: boolean;
  isAuthenticated: boolean;
}

/** Decode a JWT payload without verifying signature (client-side only). */
function decodeJwt(token: string): Record<string, unknown> | null {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

/**
 * Hook to access the current authenticated user.
 *
 * @example
 * const { user, isAuthenticated, isLoading } = useAuth();
 * if (!isAuthenticated) router.push("/auth/login");
 */
export function useAuth(): UseAuthReturn {
  const [user, setUser]           = useState<DecodedUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authStatus, setAuthStatus] = useState<AuthStatus>({ state: "anonymous" });

  useEffect(() => {
    const status = checkAuthState();
    setAuthStatus(status);

    if (status.state === "authenticated" && status.token) {
      const decoded = decodeJwt(status.token);
      if (decoded?.uid && decoded?.email) {
        setUser(decoded as DecodedUser);
      }
    }

    setIsLoading(false);
  }, []);

  return {
    user,
    authStatus,
    isLoading,
    isAuthenticated: authStatus.state === "authenticated",
  };
}
