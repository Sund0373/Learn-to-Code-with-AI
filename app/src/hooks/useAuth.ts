"use client";

import { useState, useEffect } from "react";
import { isFirebaseConfigured, getClientAuth } from "@/lib/firebase/client";
import { checkAuthState, type AuthStatus } from "@/lib/auth/authService";

interface AuthUser {
  uid: string;
  email: string | null;
}

interface UseAuthReturn {
  user: AuthUser | null;
  authStatus: AuthStatus;
  isLoading: boolean;
  isAuthenticated: boolean;
}

/**
 * Hook to access the current authenticated user.
 * Uses Firebase onAuthStateChanged as the primary source of truth,
 * with sessionStorage as a fallback hint.
 */
export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const status = checkAuthState();

    if (isFirebaseConfigured()) {
      const auth = getClientAuth();
      if (auth) {
        import("firebase/auth").then(({ onAuthStateChanged }) => {
          onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
              setUser({ uid: firebaseUser.uid, email: firebaseUser.email });
              setIsAuthenticated(true);
            } else if (status.state === "authenticated" && status.userId) {
              // Firebase hasn't loaded yet but sessionStorage says logged in
              setUser({ uid: status.userId, email: null });
              setIsAuthenticated(true);
            } else {
              setUser(null);
              setIsAuthenticated(false);
            }
            setIsLoading(false);
          });
        }).catch(() => {
          setIsLoading(false);
        });
        return;
      }
    }

    // No Firebase — fall back to sessionStorage only
    if (status.state === "authenticated" && status.userId) {
      setUser({ uid: status.userId, email: null });
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  return {
    user,
    authStatus: isAuthenticated ? { state: "authenticated", userId: user?.uid } : { state: "anonymous" },
    isLoading,
    isAuthenticated,
  };
}
