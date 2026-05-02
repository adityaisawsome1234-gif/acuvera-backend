"use client";

import { useState } from "react";
import posthog from "posthog-js";

type RegisterPayload = {
  email: string;
  name: string;
  password: string;
  org_name?: string;
  join_code?: string;
};

export default function RegisterPage() {
  const [form, setForm] = useState({
    email: "",
    name: "",
    password: "",
    orgName: "",
    joinCode: "",
    joinExisting: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (key: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const payload: RegisterPayload = {
      email: form.email,
      name: form.name,
      password: form.password,
    };
    if (form.joinExisting) {
      payload.join_code = form.joinCode;
    } else {
      payload.org_name = form.orgName;
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/register`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
    if (!response.ok) {
      const data = await response.json().catch(() => null);
      setError(data?.detail || "Unable to register.");
      return;
    }
    posthog.capture("signup_success");
    setSuccess("Account created. Check your email for verification.");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6 text-foreground">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-4 rounded-2xl border bg-card p-8"
      >
        <div>
          <h1 className="text-2xl font-semibold">Create your account</h1>
          <p className="text-sm text-muted-foreground">
            Start a new organization or join an existing team.
          </p>
        </div>
        <label className="block text-sm">
          Full name
          <input
            required
            value={form.name}
            onChange={(event) => handleChange("name", event.target.value)}
            className="mt-1 w-full rounded-md border bg-background px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          Email
          <input
            type="email"
            required
            value={form.email}
            onChange={(event) => handleChange("email", event.target.value)}
            className="mt-1 w-full rounded-md border bg-background px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          Password
          <input
            type="password"
            required
            value={form.password}
            onChange={(event) => handleChange("password", event.target.value)}
            className="mt-1 w-full rounded-md border bg-background px-3 py-2"
          />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.joinExisting}
            onChange={(event) => handleChange("joinExisting", event.target.checked)}
          />
          Join an existing organization
        </label>
        {form.joinExisting ? (
          <label className="block text-sm">
            Join code
            <input
              required
              value={form.joinCode}
              onChange={(event) => handleChange("joinCode", event.target.value)}
              className="mt-1 w-full rounded-md border bg-background px-3 py-2"
            />
          </label>
        ) : (
          <label className="block text-sm">
            Organization name
            <input
              required
              value={form.orgName}
              onChange={(event) => handleChange("orgName", event.target.value)}
              className="mt-1 w-full rounded-md border bg-background px-3 py-2"
            />
          </label>
        )}
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        {success ? <p className="text-sm text-success">{success}</p> : null}
        <button
          type="submit"
          className="w-full rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
        >
          Create account
        </button>
      </form>
    </div>
  );
}
