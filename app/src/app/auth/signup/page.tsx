"use client";

import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { clientAuth } from "@/lib/firebase/client";
import { setAuthenticatedState } from "@/lib/auth/authService";
import LoadingOverlay from "@/components/common/LoadingOverlay";

function SignupForm() {
  const router = useRouter();

  const [email,     setEmail]     = useState("");
  const [password,  setPassword]  = useState("");
  const [confirm,   setConfirm]   = useState("");
  const [error,     setError]     = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isFormValid =
    email.length > 0 &&
    password.length >= 6 &&
    password === confirm;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      // Create the Firebase account and get ID token
      const credential = await createUserWithEmailAndPassword(clientAuth, email, password);
      const idToken = await credential.user.getIdToken();

      // Exchange ID token for our JWT + httpOnly cookie, and create Firestore user doc
      const res = await fetch("/api/auth/signup", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ idToken }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Signup failed. Please try again.");
        return;
      }

      setAuthenticatedState(data.token, data.userId);
      router.replace("/dashboard");
    } catch (err: unknown) {
      const code = (err as { code?: string }).code;
      if (code === "auth/email-already-in-use") {
        setError("An account with this email already exists.");
      } else if (code === "auth/weak-password") {
        setError("Password must be at least 6 characters.");
      } else if (code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-app-bg px-4">
      <LoadingOverlay isLoading={isLoading} />

      <div className="w-full max-w-sm rounded-2xl bg-app-bg-card p-8 shadow-sm border border-border-default">
        <h1 className="mb-1 text-2xl font-semibold text-text-primary">Create account</h1>
        <p className="mb-6 text-sm text-text-secondary">
          Sign up to get started.
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
              autoComplete="new-password"
              required
              className="input w-full"
            />
            <p className="mt-1 text-xs text-text-secondary">Minimum 6 characters</p>
          </div>

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
              onChange={(e) => { setConfirm(e.target.value); setError(""); }}
              placeholder="••••••••"
              autoComplete="new-password"
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
            {isLoading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-text-secondary">
          Already have an account?{" "}
          <a href="/auth/login" className="font-medium text-action-primary hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<LoadingOverlay isLoading />}>
      <SignupForm />
    </Suspense>
  );
}
