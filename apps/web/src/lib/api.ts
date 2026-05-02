// API utility functions for frontend
// Uses NEXT_PUBLIC_API_BASE_URL environment variable

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL environment variable is required");
}

// Remove trailing slash if present
const baseUrl = API_BASE_URL.replace(/\/$/, "");

/**
 * Fetch from API with proper base URL
 */
export async function apiFetch(
  endpoint: string,
  options?: RequestInit
): Promise<any> {
  const url = `${baseUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  return response.json();
}
