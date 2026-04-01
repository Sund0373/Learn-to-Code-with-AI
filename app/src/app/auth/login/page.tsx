"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { clientAuth } from "@/lib/firebase/client";
import { checkAuthState, setAuthenticatedState } from "@/lib/auth/authService";
import { setupAuthInterceptor } from "@/lib/auth/authInterceptor";
import LoadingOverlay from "@/components/common/LoadingOverlay";

function LoginForm() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const redirect     = searchParams.get("redirect") || "/dashboard";

  const [email,     setEmail]     = useState("");
  const [password,  setPassword]  = useState("");
  const [error,     setError]     = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setupAuthInterceptor();
    const { state } = checkAuthState();
    if (state === "authenticated") {
      router.replace(redirect);
    }
  }, [redirect, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Sign in with Firebase client SDK, get ID token
      const credential = await signInWithEmailAndPassword(clientAuth, email, password);
      const idToken = await credential.user.getIdToken();

      // Exchange ID token for our JWT + httpOnly cookie
      const res = await fetch("/api/auth/login", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ idToken }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed. Please try again.");
        return;
      }

      setAuthenticatedState(data.token, data.userId);
      router.replace(redirect);
    } catch (err: unknown) {
      const code = (err as { code?: string }).code;
      if (code === "auth/invalid-credential" || code === "auth/user-not-found" || code === "auth/wrong-password") {
        setError("Invalid email or password.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = email.length > 0 && password.length >= 6;

  return (
    <div className="flex min-h-screen items-center justify-center bg-app-bg px-4">
      <LoadingOverlay isLoading={isLoading} />

      <div className="w-full max-w-sm rounded-2xl bg-app-bg-card p-8 shadow-sm border border-border-default">
        <h1 className="mb-1 text-2xl font-semibold text-text-primary">Sign in</h1>
        <p className="mb-6 text-sm text-text-secondary">
          Enter your credentials to continue.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-text-primary"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              placeholder="you@example.com"
              autoComplete="email"
              required
              className="input w-full"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-text-primary"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              placeholder="••••••••"
              autoComplete="current-password"
              required
              className="input w-full"
            />
          </div>

          {error && (
            <p className="text-sm text-text-danger">{error}</p>
          )}

          <button
            type="submit"
            disabled={!isFormValid || isLoading}
            className={`w-full rounded-lg py-2.5 text-sm font-semibold transition-colors ${
              isFormValid && !isLoading
                ? "bg-action-primary text-action-primary-text hover:bg-action-primary-hover"
                : "bg-action-disabled-bg text-action-disabled-text cursor-not-allowed"
            }`}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-text-secondary">
          Don&apos;t have an account?{" "}
          <a href="/auth/signup" className="font-medium text-action-primary hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingOverlay isLoading />}>
      <LoginForm />
    </Suspense>
  );
}
