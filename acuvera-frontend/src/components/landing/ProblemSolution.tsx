"use client";

import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { AnimatedSection } from "./AnimatedSection";

const problems = [
  "CPT/ICD coding mistakes go undetected until denial",
  "Hidden fees and balance-billing inconsistencies",
  "High denial rates from preventable submission errors",
  "Manual audits are slow, expensive, and error-prone",
];

const solutions = [
  "Automated line-item error detection before submission",
  "Plain-English explanations of every charge",
  "AI-recommended corrective actions and next steps",
  "Complete audit trail for compliance and review",
];

export function ProblemSolution() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <AnimatedSection className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            The billing problem is massive.{" "}
            <span className="text-[#4A90FF]">The fix doesn&apos;t have to be.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/40">
            Healthcare billing errors cost the U.S. system over $100B annually.
            Acuvera catches them before they become denials.
          </p>
        </AnimatedSection>

        <div className="mt-16 grid gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Problem */}
          <AnimatedSection delay={0.1}>
            <div className="rounded-2xl border border-red-500/10 bg-red-500/[0.03] p-8">
              <h3 className="flex items-center gap-3 text-lg font-semibold text-red-400">
                <AlertTriangle size={20} /> Without Acuvera
              </h3>
              <ul className="mt-6 space-y-4">
                {problems.map((p) => (
                  <li key={p} className="flex items-start gap-3 text-[15px] text-white/50">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-400/60" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </AnimatedSection>

          {/* Solution */}
          <AnimatedSection delay={0.2}>
            <div className="rounded-2xl border border-emerald-500/10 bg-emerald-500/[0.03] p-8">
              <h3 className="flex items-center gap-3 text-lg font-semibold text-emerald-400">
                <CheckCircle2 size={20} /> With Acuvera
              </h3>
              <ul className="mt-6 space-y-4">
                {solutions.map((s) => (
                  <li key={s} className="flex items-start gap-3 text-[15px] text-white/50">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-400/60" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
