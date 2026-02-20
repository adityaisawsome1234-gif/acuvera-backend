let warmPromise: Promise<boolean> | null = null;

/**
 * Fire-and-forget ping to /health so the backend wakes from a cold start
 * while the user is still typing credentials.
 * Returns a promise that resolves to true when the backend is ready.
 */
export function warmBackend(): Promise<boolean> {
  if (warmPromise) return warmPromise;

  const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") ?? "http://localhost:8000";
  warmPromise = fetch(`${base}/health`, { method: "GET", mode: "cors" })
    .then(() => true)
    .catch(() => false);

  return warmPromise;
}

export function isWarmed(): boolean {
  return warmPromise !== null;
}
