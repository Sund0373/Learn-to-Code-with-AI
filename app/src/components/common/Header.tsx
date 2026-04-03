"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { clearAllAuthData } from "@/lib/auth/authService";
import { isFirebaseConfigured, getClientAuth } from "@/lib/firebase/client";
import AiChat from "./AiChat";

interface AiStatus {
  anthropic: boolean;
  openai: boolean;
}

function useAiStatus() {
  const [aiStatus, setAiStatus] = useState<AiStatus | null>(null);

  useEffect(() => {
    fetch("/api/ai/status")
      .then((r) => r.json())
      .then((data: AiStatus) => setAiStatus(data))
      .catch(() => setAiStatus(null));
  }, []);

  return aiStatus;
}

export default function Header() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [chatOpen, setChatOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const aiStatus = useAiStatus();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    clearAllAuthData();
    if (isFirebaseConfigured()) {
      const auth = getClientAuth();
      if (auth) {
        const { signOut } = await import("firebase/auth");
        await signOut(auth);
      }
    }
    router.replace("/auth");
  };

  const hasAi = aiStatus?.anthropic || aiStatus?.openai;

  return (
    <>
      <header className="relative z-50 border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            <Link
              href="/"
              className="text-lg font-semibold text-gray-900 hover:text-gray-700 truncate"
            >
              Learn to Code with AI
            </Link>

            <nav className="flex shrink-0 items-center gap-3">
              {/* AI Assistant button */}
              {hasAi && (
                <button
                  onClick={() => setChatOpen(true)}
                  className="relative flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <svg
                    className="h-4 w-4 text-action-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                  <span className="hidden sm:inline">AI Assistant</span>
                  <span className="flex gap-0.5 ml-0.5">
                    {aiStatus?.anthropic && (
                      <span className="h-2 w-2 rounded-full bg-action-primary" title="Claude available" />
                    )}
                    {aiStatus?.openai && (
                      <span className="h-2 w-2 rounded-full bg-green-500" title="OpenAI available" />
                    )}
                  </span>
                </button>
              )}

              {/* Auth state */}
              {!isLoading && isAuthenticated && (
                <div className="relative">
                  <button
                    onClick={() => setAccountOpen((prev) => !prev)}
                    className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    {user?.email || "Account"}
                  </button>
                  {accountOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setAccountOpen(false)}
                      />
                      <div className="absolute right-0 z-50 mt-1 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                        {user?.email && (
                          <div className="px-3 py-2 text-xs text-gray-500 border-b border-gray-100 truncate">
                            {user.email}
                          </div>
                        )}
                        <button
                          onClick={() => {
                            setAccountOpen(false);
                            handleLogout();
                          }}
                          className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Log out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Tutorial */}
              <Link href="/learn" className="text-sm font-medium text-action-primary hover:text-action-primary-hover">
                Tutorial
              </Link>

              {/* Home icon */}
              <Link
                href="/"
                className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
                title="Home"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" />
                </svg>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {chatOpen && aiStatus && (
        <AiChat
          onClose={() => setChatOpen(false)}
          availableProviders={aiStatus}
        />
      )}
    </>
  );
}
