"use client";

import { useState } from "react";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  const handleReset = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/password-reset/confirm`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, new_password: password }),
      }
    );
    if (!response.ok) {
      setStatus("Reset failed.");
      return;
    }
    setStatus("Password reset. You can now sign in.");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6 text-foreground">
      <form
        onSubmit={handleReset}
        className="w-full max-w-md space-y-4 rounded-2xl border bg-card p-8"
      >
        <h1 className="text-2xl font-semibold">Reset password</h1>
        <label className="block text-sm">
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1 w-full rounded-md border bg-background px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          Reset token
          <input
            required
            value={token}
            onChange={(event) => setToken(event.target.value)}
            className="mt-1 w-full rounded-md border bg-background px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          New password
          <input
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-1 w-full rounded-md border bg-background px-3 py-2"
          />
        </label>
        {status ? <p className="text-sm text-muted-foreground">{status}</p> : null}
        <button
          type="submit"
          className="w-full rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
        >
          Reset password
        </button>
      </form>
    </div>
  );
}
