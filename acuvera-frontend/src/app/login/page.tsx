"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { warmBackend } from "@/lib/warmup";
import { setToken, setUser, setFreshLogin } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  useEffect(() => {
    warmBackend();
    router.prefetch("/dashboard");
  }, [router]);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("Signing in...");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setLoadingMsg("Connecting...");

    const timeout = setTimeout(() => setLoadingMsg("Waking up server..."), 3000);
    try {
      await warmBackend();
      clearTimeout(timeout);
      setLoadingMsg("Verifying credentials...");

      const res = await apiFetch<{
        success: boolean;
        data: { access_token: string; token_type: string; user: any };
      }>(
        "/auth/login",
        {
          method: "POST",
          body: JSON.stringify({ email, password: password.slice(0, 72) }),
        },
        { suppressAuthRedirect: true }
      );

      setToken(res.data.access_token);
      setUser(res.data.user);
      setFreshLogin();
      router.replace("/dashboard");
      toast.success("Welcome back!");
    } catch (err: any) {
      toast.error(err?.message ?? "Login failed. Please check your credentials.");
    } finally {
      clearTimeout(timeout);
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-[400px]">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link href="/" className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl">
            <img src="/acuvera-logo.png" alt="Acuvera" width={56} height={56} className="rounded-xl object-contain" />
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign in to your Acuvera account
          </p>
        </div>

        {/* Form */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[13px] font-medium text-foreground">
                Email address
              </Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[13px] font-medium text-foreground">
                Password
              </Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  {loadingMsg}
                </span>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-[13px] text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-primary hover:underline"
          >
            Create account
          </Link>
        </p>

        <div className="mt-4 flex items-center justify-center gap-3 text-[11px] text-muted-foreground">
          <Link href="/privacy" className="hover:text-foreground hover:underline">
            Privacy Policy
          </Link>
          <span>&middot;</span>
          <Link href="/support" className="hover:text-foreground hover:underline">
            Support
          </Link>
        </div>
      </div>
    </div>
  );
}
