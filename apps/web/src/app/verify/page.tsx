"use client";

import { useState } from "react";

export default function VerifyPage() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  const handleVerify = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/verify`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token }),
      }
    );
    if (!response.ok) {
      setStatus("Verification failed.");
      return;
    }
    setStatus("Email verified. You can now sign in.");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6 text-foreground">
      <form
        onSubmit={handleVerify}
        className="w-full max-w-md space-y-4 rounded-2xl border bg-card p-8"
      >
        <h1 className="text-2xl font-semibold">Verify your email</h1>
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
          Verification token
          <input
            required
            value={token}
            onChange={(event) => setToken(event.target.value)}
            className="mt-1 w-full rounded-md border bg-background px-3 py-2"
          />
        </label>
        {status ? <p className="text-sm text-muted-foreground">{status}</p> : null}
        <button
          type="submit"
          className="w-full rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
        >
          Verify
        </button>
      </form>
    </div>
  );
}
