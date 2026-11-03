export const TOKEN_KEY = "token";

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
      return
    }
    throw new ApiError(message, response.status);
  }

  if (response.status === 204) return null;
  return response.json();
}

// Like apiFetch, but for a file upload (FormData body): the Content-Type
// header is left out entirely so the browser can set it itself, including
// the multipart boundary — setting it to "application/json" like apiFetch
// does would break the upload.
export async function apiUpload(path: string, formData: FormData) {
  const token = localStorage.getItem(TOKEN_KEY);

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    body: formData,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    if (response.status === 401 && token) {
      clearToken();
      window.location.assign("/login");
    }

    let message = `Request failed with status ${response.status}`;
    try {
      const body = await response.json();
      message = body?.error ?? message;
    } catch {
      throw new ApiError(message, response.status);
    }
    throw new ApiError(message, response.status);
  }

  if (response.status === 204) return null;
  return response.json();
}