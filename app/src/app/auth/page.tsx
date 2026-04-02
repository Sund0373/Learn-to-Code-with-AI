"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getClientAuth, isFirebaseConfigured } from "@/lib/firebase/client";
import { checkAuthState, setAuthenticatedState } from "@/lib/auth/authService";
import LoadingOverlay from "@/components/common/LoadingOverlay";

function FirebaseNotReady() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-app-bg px-4">
      <div className="w-full max-w-sm rounded-2xl bg-app-bg-card p-8 shadow-sm border border-border-default text-center">
        <h1 className="mb-2 text-2xl font-semibold text-text-primary">
          Firebase Not Configured
        </h1>
        <p className="mb-6 text-sm text-text-secondary">
          To use authentication, you need to set up Firebase first. Follow the
          tutorial to get your Firebase credentials configured.
        </p>
        <a
          href="/learn"
          className="inline-block rounded-lg bg-action-primary px-6 py-2.5 text-sm font-semibold text-action-primary-text hover:bg-action-primary-hover"
        >
          Go to Tutorial
        </a>
      </div>
    </div>
  );
}

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";
  const initialMode = searchParams.get("mode") === "signup" ? "signup" : "login";

  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isFirebaseConfigured()) return;
    const { state } = checkAuthState();
    if (state === "authenticated") {
      router.replace(redirect);
    }
  }, [redirect, router]);

  if (!isFirebaseConfigured()) {
    return <FirebaseNotReady />;
  }

  const isLogin = mode === "login";

  const isFormValid = isLogin
    ? email.length > 0 && password.length >= 6
    : email.length > 0 && password.length >= 6 && password === confirm;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isLogin && password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const { signInWithEmailAndPassword, createUserWithEmailAndPassword } = await import("firebase/auth");
      const auth = getClientAuth()!;
      const credential = isLogin
        ? await signInWithEmailAndPassword(auth, email, password)
        : await createUserWithEmailAndPassword(auth, email, password);

      const idToken = await credential.user.getIdToken();

      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/signup";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || `${isLogin ? "Login" : "Signup"} failed. Please try again.`);
        return;
      }

      setAuthenticatedState(data.userId);
      router.replace(redirect);
    } catch (err: unknown) {
      const code = (err as { code?: string }).code;
      switch (code) {
        case "auth/email-already-in-use":
          setError("An account with this email already exists.");
          break;
        case "auth/weak-password":
          setError("Password must be at least 6 characters.");
          break;
        case "auth/invalid-email":
          setError("Please enter a valid email address.");
          break;
        case "auth/invalid-credential":
        case "auth/user-not-found":
        case "auth/wrong-password":
          setError("Invalid email or password.");
          break;
        default:
          setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    setMode(isLogin ? "signup" : "login");
    setError("");
    setConfirm("");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-app-bg px-4">
      <LoadingOverlay isLoading={isLoading} />

      <div className="w-full max-w-sm rounded-2xl bg-app-bg-card p-8 shadow-sm border border-border-default">
        <h1 className="mb-1 text-2xl font-semibold text-text-primary">
          {isLogin ? "Sign in" : "Create account"}
        </h1>
        <p className="mb-6 text-sm text-text-secondary">
          {isLogin
            ? "Enter your credentials to continue."
            : "Sign up to get started."}
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
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
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
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              placeholder="••••••••"
              autoComplete={isLogin ? "current-password" : "new-password"}
              required
              className="input w-full"
            />
            {!isLogin && (
              <p className="mt-1 text-xs text-text-secondary">
                Minimum 6 characters
              </p>
            )}
          </div>

          {!isLogin && (
            <div>
              <label
                htmlFor="confirm"
                className="mb-1 block text-sm font-medium text-text-primary"
              >
                Confirm password
              </label>
              <input
                id="confirm"
                type="password"
                value={confirm}
                onChange={(e) => {
                  setConfirm(e.target.value);
                  setError("");
                }}
                placeholder="••••••••"
                autoComplete="new-password"
                required
                className="input w-full"
              />
            </div>
          )}

          {error && <p className="text-sm text-text-danger">{error}</p>}

          <button
            type="submit"
            disabled={!isFormValid || isLoading}
            className={`w-full rounded-lg py-2.5 text-sm font-semibold transition-colors ${
              isFormValid && !isLoading
                ? "bg-action-primary text-action-primary-text hover:bg-action-primary-hover"
                : "bg-action-disabled-bg text-action-disabled-text cursor-not-allowed"
            }`}
          >
            {isLoading
              ? isLogin
                ? "Signing in..."
                : "Creating account..."
              : isLogin
              ? "Sign in"
              : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-text-secondary">
          {isLogin ? "Don\u2019t have an account? " : "Already have an account? "}
          <button
            onClick={switchMode}
            className="font-medium text-action-primary hover:underline"
          >
            {isLogin ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<LoadingOverlay isLoading />}>
      <AuthForm />
    </Suspense>
  );
}
