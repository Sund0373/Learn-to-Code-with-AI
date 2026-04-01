import { getSessionToken } from "./authService";

/**
 * Monkey-patches window.fetch to automatically attach the session token
 * as an Authorization header on all same-origin requests.
 *
 * Call setupAuthInterceptor() once in your root layout or app provider.
 * Call cleanupAuthInterceptor() on logout if needed.
 */

type WindowWithInterceptor = Window & { _authInterceptorActive?: boolean };

let originalFetch: typeof window.fetch | undefined;

function headersToObject(headers: HeadersInit | undefined): Record<string, string> {
  if (!headers) return {};
  if (headers instanceof Headers) return Object.fromEntries(headers.entries());
  if (Array.isArray(headers)) return Object.fromEntries(headers);
  return headers as Record<string, string>;
}

export function setupAuthInterceptor(): void {
  if (typeof window === "undefined") return;
  if ((window as WindowWithInterceptor)._authInterceptorActive) return;

  originalFetch = window.fetch;

  window.fetch = function (input: RequestInfo | URL, init?: RequestInit) {
    const url =
      typeof input === "string"
        ? input
        : input instanceof URL
        ? input.href
        : (input as Request).url;

    const isSameOrigin =
      url.startsWith("/") || url.startsWith(window.location.origin);

    if (isSameOrigin) {
      const token = getSessionToken();
      if (token) {
        const newInit: RequestInit = {
          ...init,
          headers: {
            Authorization: `Bearer ${token}`,
            ...headersToObject(init?.headers),
          },
        };
        return originalFetch!.call(window, input, newInit);
      }
    }

    return originalFetch!.call(window, input, init);
  };

  (window as WindowWithInterceptor)._authInterceptorActive = true;
}

export function cleanupAuthInterceptor(): void {
  if (typeof window === "undefined") return;
  if (originalFetch) {
    window.fetch = originalFetch;
    originalFetch = undefined;
    (window as WindowWithInterceptor)._authInterceptorActive = false;
  }
}
