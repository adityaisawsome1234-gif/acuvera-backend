import { useCallback, useEffect, useState, useRef } from "react";
import { apiFetch } from "@/lib/api";
import { AuthUser, getToken, getUser, setUser, clearAuth } from "@/lib/auth";

type AuthState = {
  user: AuthUser | null;
  loading: boolean;
  error?: string;
};

export function useAuth() {
  const cachedUser = getUser();
  const hasToken = !!getToken();

  // If we have a cached user + token, start as NOT loading (prevents skeleton flash)
  const [state, setState] = useState<AuthState>({
    user: cachedUser,
    loading: hasToken && !cachedUser, // only loading if token exists but no cached user
  });

  const didValidate = useRef(false);

  const refresh = useCallback(async () => {
    if (!getToken()) {
      clearAuth();
      setState({ user: null, loading: false });
      return;
    }
    try {
      const res = await apiFetch<{ success: boolean; data: AuthUser }>(
        "/auth/me",
        undefined,
        { suppressAuthRedirect: true }
      );
      setUser(res.data);
      setState({ user: res.data, loading: false });
    } catch {
      clearAuth();
      setState({ user: null, loading: false });
    }
  }, []);

  useEffect(() => {
    // Validate in background but don't block rendering if we have cached user
    if (!didValidate.current) {
      didValidate.current = true;
      refresh();
    }
  }, [refresh]);

  return { ...state, refresh };
}
