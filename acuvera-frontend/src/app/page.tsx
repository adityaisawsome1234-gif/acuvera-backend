"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  FileCheck,
  Search,
  Lock,
  TrendingUp,
  ShieldCheck,
  Activity,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useInView } from "@/hooks/use-in-view";

const L = {
  navy: "#0F172A",
  medicalBlue: "#2563EB",
  signalBlue: "#4A90FF",
  white: "#FFFFFF",
  softGray: "#F8FAFC",
  muted: "#64748B",
  border: "#E2E8F0",
};

export default function LandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const heroVis = useInView(0.1);
  const problemVis = useInView(0.1);
  const howVis = useInView(0.1);
  const detectVis = useInView(0.1);
  const impactVis = useInView(0.1);
  const integrationVis = useInView(0.1);
  const trustVis = useInView(0.1);
  const ctaVis = useInView(0.2);

  useEffect(() => {
    if (!loading && user) router.replace("/dashboard");
  }, [user, loading, router]);

  if (loading || user) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: L.navy }}>
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/30 border-t-white" />
      </div>
    );
  }

  return (
    <div className="landing min-h-screen" style={{ background: L.navy, color: L.white }}>
      {/* Header */}
      <header className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between border-b px-6 py-4 transition-colors"
        style={{ background: "rgba(15,23,42,0.9)", borderColor: "rgba(255,255,255,0.06)" }}>
        <Link href="/" className="flex items-center gap-3">
          <img
            src="/acuvera-logo.png"
            alt="Acuvera"
            width={36}
            height={36}
            className="rounded-lg object-contain"
          />
          <span className="text-lg font-semibold tracking-tight">Acuvera</span>
        </Link>
        <div className="flex items-center gap-3">
          <a href="#how-it-works" className="text-sm text-white/70 hover:text-white transition-colors">How it works</a>
          <Link
            href="/login"
            className="rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-white/5"
            style={{ borderColor: "rgba(255,255,255,0.2)" }}
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="rounded-lg px-4 py-2 text-sm font-medium transition-colors"
            style={{ background: L.medicalBlue, color: L.white }}
          >
            Request Demo
          </Link>
        </div>
      </header>

      {/* 1. Hero */}
      <section className="relative pt-32 pb-24 px-6 sm:px-12 lg:px-24">
        <div
          ref={heroVis.ref}
          className={`max-w-4xl transition-all duration-700 ${heroVis.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl" style={{ color: L.white, lineHeight: 1.15 }}>
            Stop Losing Revenue to Preventable Billing Errors.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed" style={{ color: L.muted }}>
            AI that audits every claim before submission — catching costly mistakes, reducing denials,
            and increasing reimbursement without disrupting clinical workflows.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-medium transition-opacity hover:opacity-90"
              style={{ background: L.medicalBlue, color: L.white }}
            >
              Request Demo <ArrowRight size={16} />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 rounded-lg border px-6 py-3 text-sm font-medium transition-colors hover:bg-white/5"
              style={{ borderColor: "rgba(255,255,255,0.2)", color: L.white }}
            >
              See How It Works
            </a>
          </div>
        </div>
        {/* Hero visual: claims analysis dashboard */}
        <div
          ref={heroVis.ref}
          className={`relative mt-16 overflow-hidden rounded-xl border transition-all duration-1000 delay-200 ${heroVis.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          style={{ borderColor: "rgba(255,255,255,0.08)" }}
        >
          <Image
            src="/acuvera-hero-dashboard.png"
            alt="Acuvera claims analysis dashboard"
            width={960}
            height={400}
            className="w-full object-cover object-top"
            unoptimized
          />
        </div>
      </section>

      {/* 2. Problem */}
      <section className="py-24 px-6 sm:px-12 lg:px-24" style={{ background: L.softGray, color: L.navy }}>
        <div
          ref={problemVis.ref}
          className={`mx-auto max-w-5xl transition-all duration-700 ${problemVis.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">The hidden loss in healthcare billing</h2>
          <p className="mt-4 max-w-2xl text-lg" style={{ color: L.muted }}>
            Most revenue loss is invisible until it&apos;s too late. Undercoding, denial-prone claims, and
            documentation gaps drain 3–10% of revenue before claims ever reach the payer.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Denials", value: "12–18%", desc: "of claims denied" },
              { label: "Undercoding", value: "3–7%", desc: "revenue left behind" },
              { label: "Rework cost", value: "$25+", desc: "per claim" },
              { label: "Audit exposure", value: "High", desc: "compliance risk" },
            ].map((item, i) => (
              <div
                key={item.label}
                className="rounded-xl border bg-white p-6 transition-all duration-500"
                style={{
                  borderColor: L.border,
                  opacity: problemVis.inView ? 1 : 0,
                  transform: problemVis.inView ? "translateY(0)" : "translateY(12px)",
                  transitionDelay: `${i * 80}ms`,
                }}
              >
                <p className="text-2xl font-bold" style={{ color: L.medicalBlue }}>{item.value}</p>
                <p className="mt-1 font-medium" style={{ color: L.navy }}>{item.label}</p>
                <p className="mt-0.5 text-sm" style={{ color: L.muted }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. How it works */}
      <section id="how-it-works" className="py-24 px-6 sm:px-12 lg:px-24">
        <div
          ref={howVis.ref}
          className={`mx-auto max-w-5xl transition-all duration-700 ${howVis.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">How Acuvera works</h2>
          <p className="mt-4 max-w-2xl text-lg" style={{ color: L.muted }}>
            Pre-submission intelligence between EMR and clearinghouse — no workflow changes required.
          </p>
          <div className="mt-16 flex flex-col gap-12 lg:flex-row lg:justify-between">
            {[
              { icon: Activity, title: "Ingest", desc: "Connects to your billing workflow and receives claims before submission." },
              { icon: Search, title: "Analyze", desc: "AI reviews every claim against payer rules, coding logic, and documentation." },
              { icon: ShieldCheck, title: "Protect Revenue", desc: "Flags issues before submission. Fix once, avoid denials and rework." },
            ].map((step, i) => (
              <div key={step.title} className="flex-1">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl" style={{ background: `${L.medicalBlue}20` }}>
                    <step.icon size={22} style={{ color: L.medicalBlue }} />
                  </div>
                  <span className="text-sm font-medium" style={{ color: L.signalBlue }}>Step {i + 1}</span>
                </div>
                <h3 className="mt-4 text-xl font-semibold">{step.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed" style={{ color: L.muted }}>{step.desc}</p>
              </div>
            ))}
          </div>
          {howVis.inView && (
            <div className="mt-12 flex items-center justify-center gap-4 opacity-60">
              <div className="h-px w-16" style={{ background: L.signalBlue }} />
              <ArrowRight size={20} style={{ color: L.signalBlue }} />
              <div className="h-px w-16" style={{ background: L.signalBlue }} />
              <ArrowRight size={20} style={{ color: L.signalBlue }} />
              <div className="h-px w-16" style={{ background: L.signalBlue }} />
            </div>
          )}
        </div>
      </section>

      {/* 4. What Acuvera detects */}
      <section className="py-24 px-6 sm:px-12 lg:px-24" style={{ background: "rgba(15,23,42,0.5)" }}>
        <div
          ref={detectVis.ref}
          className={`mx-auto max-w-5xl transition-all duration-700 ${detectVis.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">What Acuvera detects</h2>
          <p className="mt-4 max-w-2xl text-lg" style={{ color: L.muted }}>
            Comprehensive pre-submission checks across coding, documentation, and payer rules.
          </p>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              "Undercoding (lost revenue)",
              "Overcoding risk (compliance exposure)",
              "Missing documentation",
              "Modifier misuse",
              "Denial-prone claims",
              "Payer rule mismatches",
              "Audit risks",
            ].map((item, i) => (
              <div
                key={item}
                className="flex items-center gap-4 rounded-xl border p-5 transition-all duration-500"
                style={{
                  borderColor: "rgba(255,255,255,0.08)",
                  background: "rgba(255,255,255,0.02)",
                  opacity: detectVis.inView ? 1 : 0,
                  transform: detectVis.inView ? "translateY(0)" : "translateY(12px)",
                  transitionDelay: `${i * 60}ms`,
                }}
              >
                <FileCheck size={18} style={{ color: L.signalBlue }} />
                <span className="text-[15px] font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Financial impact */}
      <section className="py-24 px-6 sm:px-12 lg:px-24" style={{ background: L.softGray, color: L.navy }}>
        <div
          ref={impactVis.ref}
          className={`mx-auto max-w-5xl transition-all duration-700 ${impactVis.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Measurable outcomes</h2>
          <p className="mt-4 max-w-2xl text-lg" style={{ color: L.muted }}>
            Performance-based. Acuvera succeeds when captured revenue increases.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: TrendingUp, label: "Increased net collections" },
              { icon: Search, label: "Reduced denial rates" },
              { icon: Activity, label: "Lower rework costs" },
              { icon: Lock, label: "Audit protection" },
              { icon: Activity, label: "Faster reimbursement cycles" },
            ].map((item, i) => (
              <div
                key={item.label}
                className="flex items-center gap-4 rounded-xl border bg-white p-5 transition-all duration-500"
                style={{
                  borderColor: L.border,
                  opacity: impactVis.inView ? 1 : 0,
                  transform: impactVis.inView ? "translateY(0)" : "translateY(12px)",
                  transitionDelay: `${i * 80}ms`,
                }}
              >
                <item.icon size={20} style={{ color: L.medicalBlue }} />
                <span className="font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Integration */}
      <section className="py-24 px-6 sm:px-12 lg:px-24">
        <div
          ref={integrationVis.ref}
          className={`mx-auto max-w-5xl transition-all duration-700 ${integrationVis.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Built for your stack</h2>
          <p className="mt-4 max-w-2xl text-lg" style={{ color: L.muted }}>
            Works alongside EMR, clearinghouse, and RCM workflows. Infrastructure, not another tool.
          </p>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 rounded-2xl border p-12"
            style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.02)" }}>
            <div className="rounded-xl px-6 py-3" style={{ background: "rgba(255,255,255,0.06)" }}>EMR</div>
            <ArrowRight size={24} style={{ color: L.muted }} />
            <div className="rounded-xl px-6 py-3" style={{ background: L.medicalBlue, color: L.white }}>Acuvera</div>
            <ArrowRight size={24} style={{ color: L.muted }} />
            <div className="rounded-xl px-6 py-3" style={{ background: "rgba(255,255,255,0.06)" }}>Clearinghouse</div>
            <ArrowRight size={24} style={{ color: L.muted }} />
            <div className="rounded-xl px-6 py-3" style={{ background: "rgba(255,255,255,0.06)" }}>RCM</div>
          </div>
        </div>
      </section>

      {/* 7. Trust */}
      <section className="py-24 px-6 sm:px-12 lg:px-24" style={{ background: "rgba(15,23,42,0.5)" }}>
        <div
          ref={trustVis.ref}
          className={`mx-auto max-w-5xl transition-all duration-700 ${trustVis.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Enterprise-grade security</h2>
          <p className="mt-4 max-w-2xl text-lg" style={{ color: L.muted }}>
            Built for healthcare financial accuracy. Designed to align with compliance standards.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {[
              "Secure data handling",
              "Compliance-aligned design",
              "Enterprise deployment ready",
            ].map((item, i) => (
              <div
                key={item}
                className="flex items-center gap-4 rounded-xl border p-5"
                style={{
                  borderColor: "rgba(255,255,255,0.08)",
                  background: "rgba(255,255,255,0.02)",
                  opacity: trustVis.inView ? 1 : 0,
                  transform: trustVis.inView ? "translateY(0)" : "translateY(12px)",
                  transition: "all 0.5s ease",
                  transitionDelay: `${i * 80}ms`,
                }}
              >
                <ShieldCheck size={20} style={{ color: L.signalBlue }} />
                <span className="font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Closing CTA */}
      <section className="py-24 px-6 sm:px-12 lg:px-24" style={{ background: L.softGray, color: L.navy }}>
        <div
          ref={ctaVis.ref}
          className={`mx-auto max-w-2xl text-center transition-all duration-700 ${ctaVis.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Revenue integrity should be automatic.
          </h2>
          <p className="mt-4 text-lg" style={{ color: L.muted }}>
            Schedule a demo and see how Acuvera fits into your revenue cycle.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-lg px-8 py-4 text-base font-medium transition-opacity hover:opacity-90"
              style={{ background: L.medicalBlue, color: L.white }}
            >
              Schedule a Demo
            </Link>
            <Link
              href="/login"
              className="text-base font-medium transition-colors hover:opacity-80"
              style={{ color: L.medicalBlue }}
            >
              Sign in to Acuvera
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-6 sm:px-12 lg:px-24" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 sm:flex-row">
          <Link href="/" className="flex items-center gap-3">
            <img
              src="/acuvera-logo.png"
              alt="Acuvera"
              width={32}
              height={32}
              className="rounded-lg object-contain"
            />
            <span className="text-sm font-medium">Acuvera</span>
          </Link>
          <p className="text-sm" style={{ color: L.muted }}>
            © {new Date().getFullYear()} Acuvera. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm" style={{ color: L.muted }}>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/support" className="hover:text-white transition-colors">Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
