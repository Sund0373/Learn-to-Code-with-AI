"use client";

import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
        Hello, World
      </h1>
      <p className="mt-4 text-lg text-gray-500">
        Your new project is ready. Start building something great.
      </p>
      <div className="mt-8 flex gap-4">
        <a
          href="/learn"
          className="btn-primary"
        >
          Start the Tutorial
        </a>
        {!isAuthenticated && (
          <a href="/auth/login" className="btn-secondary">
            Sign in
          </a>
        )}
      </div>

      <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="card text-left">
          <h2 className="font-semibold text-gray-900">Tailwind CSS</h2>
          <p className="mt-2 text-sm text-gray-500">
            Utility-first CSS already configured. Edit{" "}
            <code className="text-action-primary">tailwind.config.ts</code> to
            customize.
          </p>
        </div>
        <div className="card text-left">
          <h2 className="font-semibold text-gray-900">Firestore CRUD</h2>
          <p className="mt-2 text-sm text-gray-500">
            Generic CRUD API routes ready. Add your service account to{" "}
            <code className="text-action-primary">.env.local</code> to activate.
          </p>
        </div>
        <div className="card text-left">
          <h2 className="font-semibold text-gray-900">Scrapers</h2>
          <p className="mt-2 text-sm text-gray-500">
            Python Playwright base scraper in{" "}
            <code className="text-action-primary">scrapers/</code>. Configure your
            target URL and selectors.
          </p>
        </div>
      </div>
    </div>
  );
}
