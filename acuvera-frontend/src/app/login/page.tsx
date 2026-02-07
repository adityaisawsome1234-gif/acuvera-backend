"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { setToken, setUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const safePassword = password.slice(0, 72);
    if (password.length > 72) {
      toast.error("Password was longer than 72 characters and was truncated.");
    }
    setLoading(true);
    try {
      const res = await apiFetch<{
        success: boolean;
        data: { access_token: string; token_type: string; user: any };
      }>(
        "/auth/login",
        {
          method: "POST",
          body: JSON.stringify({ email, password: safePassword }),
        },
        { suppressAuthRedirect: true }
      );

      setToken(res.data.access_token);
      setUser(res.data.user);
      toast.success("Welcome back!");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err?.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen px-6 py-16">
      <div className="mx-auto max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Sign in to Acuvera</CardTitle>
            <CardDescription>Access your dashboard and billing insights.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value.slice(0, 72))}
                placeholder="••••••••"
                maxLength={72}
                required
              />
              <p className="text-xs text-slate-400">
                {password.length}/72 characters
              </p>
            </div>
            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-slate-400">
            New here?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Create an account
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
