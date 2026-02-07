const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ??
  (typeof window !== "undefined" ? "" : "http://localhost:8000");

type FetchOpts = RequestInit & { suppressAuthRedirect?: boolean };

export async function apiFetch<T = unknown>(
  path: string,
  init?: FetchOpts,
  extra?: { suppressAuthRedirect?: boolean }
): Promise<T> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("acuvera_token") : null;

  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  // Don't set Content-Type for FormData (browser sets multipart boundary)
  const body = init?.body;
  if (body && !(body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${API_BASE}/api/v1${path}`, {
    ...init,
    headers: { ...headers, ...(init?.headers as Record<string, string>) },
  });

  if (res.status === 401 && typeof window !== "undefined") {
    const suppress = extra?.suppressAuthRedirect ?? (init as any)?.suppressAuthRedirect;
    if (!suppress) {
      localStorage.removeItem("acuvera_token");
      localStorage.removeItem("acuvera_user");
      window.location.href = "/login";
      throw new Error("Unauthorized");
    }
  }

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    const msg =
      json?.error?.message ?? json?.detail ?? `Request failed (${res.status})`;
    throw new Error(msg);
  }

  return json as T;
}
