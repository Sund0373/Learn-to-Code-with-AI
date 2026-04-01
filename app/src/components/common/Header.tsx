"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { clearAllAuthData } from "@/lib/auth/authService";

export default function Header() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    clearAllAuthData();
    router.replace("/");
  };

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <a
            href={isAuthenticated ? "/dashboard" : "/"}
            className="text-lg font-semibold text-gray-900 hover:text-gray-700"
          >
            Project Name
          </a>

          <nav className="flex items-center gap-3">
            <a href="/learn" className="text-sm font-medium text-action-primary hover:text-action-primary-hover">
              Learn
            </a>
            {!isLoading && (
              isAuthenticated && user ? (
                <>
                  <span className="text-sm text-gray-600">
                    Hello, {user.email}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <a href="/" className="text-sm text-gray-600 hover:text-gray-900">
                    Home
                  </a>
                  <a href="/auth/login" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                    Sign in
                  </a>
                  <a
                    href="/auth/signup"
                    className="rounded-lg bg-action-primary px-4 py-2 text-sm font-semibold text-action-primary-text hover:bg-action-primary-hover"
                  >
                    Sign up
                  </a>
                </>
              )
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
