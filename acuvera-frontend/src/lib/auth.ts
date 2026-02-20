export type AuthUser = {
  id: number;
  email: string;
  full_name: string;
  role: string;
  organization_id?: number;
};

const TOKEN_KEY = "acuvera_token";
const USER_KEY = "acuvera_user";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setUser(user: AuthUser) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  if (typeof sessionStorage !== "undefined") sessionStorage.removeItem("auth_fresh_at");
}

const FRESH_LOGIN_TTL_MS = 5000;

/** Call after login/register to skip redundant /auth/me for a few seconds. */
export function setFreshLogin() {
  if (typeof sessionStorage !== "undefined") sessionStorage.setItem("auth_fresh_at", String(Date.now()));
}

/** True if we just logged in and can skip the /auth/me round trip. */
export function isFreshLogin(): boolean {
  if (typeof sessionStorage === "undefined") return false;
  const raw = sessionStorage.getItem("auth_fresh_at");
  if (!raw) return false;
  const at = parseInt(raw, 10);
  return !isNaN(at) && Date.now() - at < FRESH_LOGIN_TTL_MS;
}
