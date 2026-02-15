"use client";

import Link from "next/link";
import { Shield, FileSearch, DollarSign, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // If logged in, redirect to dashboard
  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [user, loading, router]);

  if (loading || user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated gradient background */}
      <div
        className="pointer-events-none fixed inset-0 opacity-30"
        style={{
          background:
            "linear-gradient(135deg, hsl(var(--primary) / 0.08) 0%, transparent 40%, hsl(var(--success) / 0.05) 60%, transparent 100%)",
          backgroundSize: "200% 200%",
          animation: "gradient-shift 12s ease infinite",
        }}
      />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5 sm:px-12">
        <div
          className="flex items-center gap-3"
          style={{ animation: "fade-in 0.6s ease-out" }}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
            <Shield size={20} className="text-white" />
          </div>
          <div>
            <p className="text-lg font-semibold tracking-tight text-foreground">
              Acuvera
            </p>
            <p className="text-[11px] font-medium text-muted-foreground">
              Billing Intelligence
            </p>
          </div>
        </div>
        <Link
          href="/login"
          style={{ animation: "fade-in 0.6s ease-out 0.2s backwards" }}
        >
          <Button variant="outline" size="sm" className="gap-2">
            Sign in
          </Button>
        </Link>
      </header>

      {/* Hero */}
      <main className="relative z-10 flex flex-col items-center px-6 pt-16 pb-24 text-center sm:px-12 sm:pt-24">
        {/* Logo with glow */}
        <div
          className="mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary"
          style={{
            animation: "fade-in-up 0.8s ease-out, glow-pulse 3s ease-in-out infinite 1s",
          }}
        >
          <Shield size={40} className="text-white" />
        </div>

        <h1
          className="max-w-3xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl"
          style={{ animation: "fade-in-up 0.8s ease-out 0.15s backwards" }}
        >
          AI-Powered Medical
          <br />
          <span className="bg-gradient-to-r from-primary to-info bg-clip-text text-transparent">
            Billing Intelligence
          </span>
        </h1>

        <p
          className="mt-6 max-w-xl text-lg text-muted-foreground"
          style={{ animation: "fade-in-up 0.8s ease-out 0.25s backwards" }}
        >
          Detect billing errors, overcharges, and compliance issues in seconds.
          Protect your revenue with intelligent analysis.
        </p>

        <div
          className="mt-10 flex flex-col gap-3 sm:flex-row"
          style={{ animation: "fade-in-up 0.8s ease-out 0.35s backwards" }}
        >
          <Link href="/login">
            <Button size="lg" className="w-full gap-2 sm:w-auto">
              Sign in to Acuvera Enterprise
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Create account
            </Button>
          </Link>
        </div>

        {/* Feature pills */}
        <div
          className="mt-16 grid max-w-3xl gap-4 sm:grid-cols-3"
          style={{ animation: "fade-in-up 0.8s ease-out 0.5s backwards" }}
        >
          {[
            {
              icon: FileSearch,
              title: "Error Detection",
              desc: "AI finds duplicates, upcoding, and compliance issues",
            },
            {
              icon: DollarSign,
              title: "Savings Insights",
              desc: "Estimated recovery opportunities on every bill",
            },
            {
              icon: Zap,
              title: "Instant Analysis",
              desc: "Upload a bill, get results in seconds",
            },
          ].map((f, i) => (
            <div
              key={f.title}
              className="rounded-2xl border border-border bg-card/80 p-5 text-left backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:bg-card"
              style={{
                animation: `fade-in-up 0.8s ease-out ${0.55 + i * 0.1}s backwards`,
              }}
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <f.icon size={18} className="text-primary" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">{f.title}</h3>
              <p className="mt-1 text-[13px] text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer
        className="relative z-10 border-t border-border px-6 py-6 sm:px-12"
        style={{ animation: "fade-in 0.8s ease-out 0.7s backwards" }}
      >
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-[12px] text-muted-foreground">
            © {new Date().getFullYear()} Acuvera. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-[12px] text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground hover:underline">
              Privacy Policy
            </Link>
            <Link href="/support" className="hover:text-foreground hover:underline">
              Support
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
