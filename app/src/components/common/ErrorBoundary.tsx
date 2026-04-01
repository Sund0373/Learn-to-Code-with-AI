"use client";

import React from "react";

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Catches unhandled React render errors.
 * Wrap any section of the tree that could fail in isolation.
 *
 * @example
 * <ErrorBoundary fallback={<p>Failed to load widget.</p>}>
 *   <SomeUnstableComponent />
 * </ErrorBoundary>
 */
export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info.componentStack);
    // TODO: send to your error tracking service (e.g. Sentry)
    // logError(error, info);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="rounded-xl border border-border-danger bg-white p-6 text-center">
          <h2 className="font-semibold text-text-primary">Something went wrong</h2>
          <p className="mt-1 text-sm text-text-secondary">
            Please refresh the page. If the problem persists, contact support.
          </p>
          {process.env.NODE_ENV === "development" && this.state.error && (
            <details className="mt-4 text-left text-xs text-text-muted">
              <summary className="cursor-pointer font-medium">
                Error details (dev only)
              </summary>
              <pre className="mt-2 overflow-auto rounded bg-app-bg-muted p-3">
                {this.state.error.toString()}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
