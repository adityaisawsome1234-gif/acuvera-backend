"use client";

import { Upload, Search, FileText, Zap } from "lucide-react";
import { AnimatedSection } from "./AnimatedSection";

const steps = [
  { icon: Upload, label: "Upload / Connect", desc: "Upload a bill, EOB, or connect your billing system. PDF, image, or structured data." },
  { icon: Search, label: "Analyze", desc: "AI reviews every line item against coding rules, payer policies, and historical patterns." },
  { icon: FileText, label: "Explain", desc: "Get a clear, actionable report — findings, risk scores, and plain-English explanations." },
  { icon: Zap, label: "Act", desc: "Recommended corrections, appeal templates, and a compliance-ready audit trail." },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-24 sm:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#4A90FF]/[0.02] to-transparent" />
      <div className="relative mx-auto max-w-7xl px-6">
        <AnimatedSection className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            How it works
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/40">
            From upload to action in minutes — not days.
          </p>
        </AnimatedSection>

        {/* Steps */}
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <AnimatedSection key={s.label} delay={0.1 + i * 0.1}>
              <div className="relative text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2563EB]/10 ring-1 ring-[#2563EB]/20">
                  <s.icon size={22} className="text-[#4A90FF]" />
                </div>
                <div className="mt-1 text-xs font-bold text-[#4A90FF]/60">Step {i + 1}</div>
                <h3 className="mt-3 text-[15px] font-semibold text-white">{s.label}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/40">{s.desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Sample output mock */}
        <AnimatedSection delay={0.3} className="mt-20">
          <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02]">
            <div className="border-b border-white/[0.06] px-6 py-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500/40" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/40" />
                <div className="h-3 w-3 rounded-full bg-green-500/40" />
                <span className="ml-3 text-xs text-white/30">analysis-report.pdf</span>
              </div>
            </div>
            <div className="grid gap-0 divide-x divide-white/[0.06] lg:grid-cols-3">
              {/* Findings */}
              <div className="p-6">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#4A90FF]">Findings</h4>
                <ul className="mt-4 space-y-3">
                  {[
                    { severity: "high", text: "Duplicate charge: CPT 99213" },
                    { severity: "medium", text: "Modifier 25 missing on E/M" },
                    { severity: "low", text: "ICD-10 specificity: Z00.00" },
                  ].map((f) => (
                    <li key={f.text} className="flex items-start gap-2 text-xs text-white/50">
                      <span
                        className={`mt-1 h-2 w-2 flex-shrink-0 rounded-full ${
                          f.severity === "high" ? "bg-red-400" : f.severity === "medium" ? "bg-amber-400" : "bg-blue-400"
                        }`}
                      />
                      {f.text}
                    </li>
                  ))}
                </ul>
              </div>
              {/* Explanation */}
              <div className="p-6">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Explanation</h4>
                <p className="mt-4 text-xs leading-relaxed text-white/40">
                  CPT 99213 appears twice on the same date of service for the same provider.
                  This is typically denied as a duplicate. The second instance should be
                  reviewed for bundling or removed.
                </p>
              </div>
              {/* Next steps */}
              <div className="p-6">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-400">Next Steps</h4>
                <ul className="mt-4 space-y-2">
                  {[
                    "Remove duplicate CPT 99213",
                    "Add modifier 25 to E/M code",
                    "Verify ICD-10 with documentation",
                  ].map((s) => (
                    <li key={s} className="flex items-center gap-2 text-xs text-white/50">
                      <div className="h-4 w-4 rounded border border-white/20 flex-shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
