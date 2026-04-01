/**
 * Typed API fetch client.
 *
 * Wraps fetch with:
 *   - Automatic Authorization header injection (reads from sessionStorage)
 *   - { data, error } return shape — no try/catch needed in components
 *   - Typed responses via generics
 *
 * @example
 * const { data, error } = await api.get<User[]>("/api/users");
 * const { data, error } = await api.post<{ id: string }>("/api/users", { name: "Alice" });
 * const { data, error } = await api.patch("/api/users?id=123", { name: "Bob" });
 * const { data, error } = await api.delete("/api/users?id=123");
 */

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

function getAuthHeader(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const token = sessionStorage.getItem("sessionToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(
  url: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
      ...options.headers,
    },
  });

  const status = res.status;

  if (!res.ok) {
    let error = `Request failed (${status})`;
    try {
      const body = await res.json();
      if (body?.error) error = body.error;
    } catch { /* ignore parse errors */ }
    return { data: null, error, status };
  }

  // 204 No Content — no body to parse
  if (status === 204) return { data: null, error: null, status };

  try {
    const data = (await res.json()) as T;
    return { data, error: null, status };
  } catch {
    return { data: null, error: "Failed to parse response", status };
  }
}

// ─── Public API ────────────────────────────────────────────────────────────────

export const api = {
  get<T>(url: string): Promise<ApiResponse<T>> {
    return request<T>(url, { method: "GET" });
  },

  post<T>(url: string, body: unknown): Promise<ApiResponse<T>> {
    return request<T>(url, {
      method: "POST",
      body:   JSON.stringify(body),
    });
  },

  patch<T>(url: string, body: unknown): Promise<ApiResponse<T>> {
    return request<T>(url, {
      method: "PATCH",
      body:   JSON.stringify(body),
    });
  },

  put<T>(url: string, body: unknown): Promise<ApiResponse<T>> {
    return request<T>(url, {
      method: "PUT",
      body:   JSON.stringify(body),
    });
  },

  delete<T = { success: boolean }>(url: string): Promise<ApiResponse<T>> {
    return request<T>(url, { method: "DELETE" });
  },
};
