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

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"PATIENT" | "PROVIDER" | "ADMIN">("PATIENT");
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
        "/auth/register",
        {
          method: "POST",
          body: JSON.stringify({
            email,
            password: safePassword,
            full_name: fullName,
            role,
          }),
        },
        { suppressAuthRedirect: true }
      );

      setToken(res.data.access_token);
      setUser(res.data.user);
      toast.success("Account created!");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err?.message ?? "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen px-6 py-16">
      <div className="mx-auto max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Create your Acuvera account</CardTitle>
            <CardDescription>Get personalized billing insights in minutes.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Full name</Label>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Jamie Doe"
                required
              />
            </div>
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
                placeholder="Create a secure password"
                maxLength={72}
                required
              />
              <p className="text-xs text-slate-400">
                {password.length}/72 characters
              </p>
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <select
                className="h-11 w-full rounded-2xl border border-border bg-secondary/70 px-4 text-sm text-white"
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
              >
                <option value="PATIENT">Patient</option>
                <option value="PROVIDER">Provider</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Create account"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
