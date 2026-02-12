/**
 * Centralized API client with error handling.
 */

export interface ApiError {
  message: string;
  code?: string;
  status: number;
}

export async function apiFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<{ data: T; ok: true } | { error: ApiError; ok: false }> {
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        ok: false,
        error: {
          message: json?.message ?? "Request failed",
          code: json?.error?.code,
          status: res.status,
        },
      };
    }

    return { ok: true, data: json as T };
  } catch {
    return {
      ok: false,
      error: {
        message: "Network error. Please check your connection.",
        status: 0,
      },
    };
  }
}
