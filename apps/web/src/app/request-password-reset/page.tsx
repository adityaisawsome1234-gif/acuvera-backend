"use client";

import { useState } from "react";

export default function RequestPasswordResetPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  const handleRequest = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/password-reset/request`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      }
    );
    setStatus(response.ok ? "Reset email sent." : "Unable to send reset email.");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6 text-foreground">
      <form
        onSubmit={handleRequest}
        className="w-full max-w-md space-y-4 rounded-2xl border bg-card p-8"
      >
        <h1 className="text-2xl font-semibold">Request password reset</h1>
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
        {status ? <p className="text-sm text-muted-foreground">{status}</p> : null}
        <button
          type="submit"
          className="w-full rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
        >
          Send reset email
        </button>
      </form>
    </div>
  );
}
