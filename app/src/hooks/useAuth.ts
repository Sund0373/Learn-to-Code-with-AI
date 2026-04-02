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
 * Cookie is the source of truth (server-side via middleware).
 * This hook provides client-side display info only.
 * Fully inert when Firebase is not configured.
 */
export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authStatus, setAuthStatus] = useState<AuthStatus>({ state: "anonymous" });

  useEffect(() => {
    const status = checkAuthState();
    setAuthStatus(status);

    if (isFirebaseConfigured()) {
      const auth = getClientAuth();
      if (auth) {
        import("firebase/auth").then(({ onAuthStateChanged }) => {
          onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser && status.state === "authenticated") {
              setUser({ uid: firebaseUser.uid, email: firebaseUser.email });
            } else if (status.state === "authenticated" && status.userId) {
              setUser({ uid: status.userId, email: null });
            }
            setIsLoading(false);
          });
        }).catch(() => {
          setIsLoading(false);
        });
        return;
      }
    }

    if (status.state === "authenticated" && status.userId) {
      setUser({ uid: status.userId, email: null });
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
