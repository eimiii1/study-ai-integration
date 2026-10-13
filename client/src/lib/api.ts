export const TOKEN_KEY = "token";

// Single source of truth for the backend URL. Override with VITE_API_URL
// in a .env file (see .env.example) instead of editing this file per machine.
export const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? "http://127.0.0.1:5001";

export const isAuthenticated = () => Boolean(localStorage.getItem(TOKEN_KEY));
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

/**
 * Thin wrapper around fetch that attaches the JWT + JSON headers,
 * resolves relative paths against API_BASE_URL, and throws ApiError
 * on non-2xx responses so callers can just try/catch.
 *
 * A 401 on an authenticated request means the token expired or is invalid,
 * so we drop it and send the user back to the login page.
 */
export async function apiFetch(path: string, init: RequestInit = {}) {
  const token = localStorage.getItem(TOKEN_KEY);

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  });

  if (!response.ok) {
    if (response.status === 401 && token && path !== "/api/login") {
      clearToken();
      window.location.assign("/login");
    }

    let message = `Request failed with status ${response.status}`;
    try {
      const body = await response.json();
      message = body?.error ?? message;
    } catch {
      // response had no JSON body; fall back to the generic message
    }
    throw new ApiError(message, response.status);
  }

  if (response.status === 204) return null;
  return response.json();
}
