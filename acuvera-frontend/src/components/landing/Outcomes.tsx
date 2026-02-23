"use client";

import { TrendingUp, Clock, ShieldCheck, Users } from "lucide-react";
import { AnimatedSection } from "./AnimatedSection";

const outcomes = [
  {
    icon: TrendingUp,
    metric: "60%",
    qualifier: "Target",
    label: "Reduction in claim rework",
    desc: "Pre-submission error detection catches issues before they become denials.",
  },
  {
    icon: Clock,
    metric: "3×",
    qualifier: "Target",
    label: "Faster review cycles",
    desc: "Automated analysis replaces hours of manual line-item review.",
  },
  {
    icon: ShieldCheck,
    metric: "95%+",
    qualifier: "Example",
    label: "Clean claim rate",
    desc: "First-pass resolution improves when errors are caught early.",
  },
  {
    icon: Users,
    metric: "4.8/5",
    qualifier: "Pilot",
    label: "Patient clarity score",
    desc: "Patients understand their bills and know what questions to ask.",
  },
];

export function Outcomes() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <AnimatedSection className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Outcomes that matter
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/40">
            Measurable impact across the revenue cycle.
          </p>
        </AnimatedSection>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {outcomes.map((o, i) => (
            <AnimatedSection key={o.label} delay={0.1 + i * 0.08}>
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-7 text-center transition-all duration-300 hover:border-white/10">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-[#2563EB]/10">
                  <o.icon size={20} className="text-[#4A90FF]" />
                </div>
                <div className="mt-5 text-3xl font-bold text-white">{o.metric}</div>
                <span className="inline-block rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white/40">
                  {o.qualifier}
                </span>
                <h3 className="mt-3 text-[15px] font-semibold text-white">{o.label}</h3>
                <p className="mt-2 text-sm text-white/40">{o.desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
