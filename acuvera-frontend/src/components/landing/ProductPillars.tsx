"use client";

import { Search, ShieldAlert, DollarSign, MessageCircle } from "lucide-react";
import { AnimatedSection } from "./AnimatedSection";

const pillars = [
  {
    icon: Search,
    title: "Error Detection",
    desc: "Catch CPT/ICD mismatches, duplicate charges, upcoding flags, and modifier issues — automatically.",
    color: "#4A90FF",
  },
  {
    icon: ShieldAlert,
    title: "Denial Prevention",
    desc: "Predict likely denial reasons before submission. Pre-submit checks reduce rework and revenue leakage.",
    color: "#f59e0b",
  },
  {
    icon: DollarSign,
    title: "Payment Integrity",
    desc: "Identify under- and overpayments, fee-schedule variances, and balance-billing inconsistencies.",
    color: "#10b981",
  },
  {
    icon: MessageCircle,
    title: "Patient Clarity",
    desc: "Plain-English explanations of every charge — plus what to ask your insurer or provider.",
    color: "#a78bfa",
  },
];

export function ProductPillars() {
  return (
    <section id="product" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <AnimatedSection className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            What Acuvera does
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/40">
            Four pillars of billing intelligence — working together to protect
            revenue and build patient trust.
          </p>
        </AnimatedSection>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p, i) => (
            <AnimatedSection key={p.title} delay={0.1 + i * 0.08}>
              <div className="group h-full rounded-2xl border border-white/[0.06] bg-white/[0.02] p-7 transition-all duration-300 hover:border-white/10 hover:bg-white/[0.04]">
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-xl"
                  style={{ backgroundColor: `${p.color}15` }}
                >
                  <p.icon size={20} style={{ color: p.color }} />
                </div>
                <h3 className="mt-5 text-[15px] font-semibold text-white">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/40">
                  {p.desc}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
