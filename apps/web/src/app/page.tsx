import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6 text-foreground">
      <div className="max-w-md space-y-4 rounded-2xl border bg-card p-8 text-center">
        <h1 className="text-2xl font-semibold">Acuvera Enterprise</h1>
        <p className="text-sm text-muted-foreground">
          Sign in to access your organization dashboard.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
}
