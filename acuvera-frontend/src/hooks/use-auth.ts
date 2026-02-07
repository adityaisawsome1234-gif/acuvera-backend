import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { AuthUser, getUser, setUser } from "@/lib/auth";

type AuthState = {
  user: AuthUser | null;
  loading: boolean;
  error?: string;
};

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: getUser(),
    loading: true,
  });

  const refresh = useCallback(async () => {
    try {
      const res = await apiFetch<{ success: boolean; data: AuthUser }>(
        "/auth/me",
        undefined,
        { suppressAuthRedirect: true }
      );
      setUser(res.data);
      setState({ user: res.data, loading: false });
    } catch (err: any) {
      setState({
        user: null,
        loading: false,
        error: err?.message ?? "Failed to fetch user",
      });
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { ...state, refresh };
}
