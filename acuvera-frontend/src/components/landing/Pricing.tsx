"use client";

import { Check } from "lucide-react";
import { AnimatedSection } from "./AnimatedSection";

const tiers = [
  {
    name: "Patient",
    price: "Free",
    period: "",
    desc: "For individuals reviewing their own bills.",
    features: ["Scan a medical bill", "Plain-English charge explanations", "Export questions for your provider", "1 bill per month"],
    cta: "Get Started",
    highlight: false,
  },
  {
    name: "Clinic / Practice",
    price: "$99",
    period: "/ seat / month",
    desc: "For billing teams and revenue cycle managers.",
    features: ["Unlimited bill analysis", "Denial prediction & pre-submit checks", "Team analytics dashboard", "Batch upload & API access", "Priority support"],
    cta: "Request Demo",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    desc: "For health systems and large organizations.",
    features: ["Everything in Clinic", "SSO & SAML integration", "Custom SLAs & uptime guarantees", "EHR/RCM integrations", "Dedicated success manager"],
    cta: "Contact Sales",
    highlight: false,
  },
];

type Props = { onDemo: () => void };

export function Pricing({ onDemo }: Props) {
  return (
    <section id="pricing" className="relative py-24 sm:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#2563EB]/[0.02] to-transparent" />
      <div className="relative mx-auto max-w-7xl px-6">
        <AnimatedSection className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/40">
            Start free. Scale when you&apos;re ready.
          </p>
        </AnimatedSection>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {tiers.map((t, i) => (
            <AnimatedSection key={t.name} delay={0.1 + i * 0.1}>
              <div
                className={`relative flex h-full flex-col rounded-2xl border p-8 transition-all duration-300 ${
                  t.highlight
                    ? "border-[#2563EB]/40 bg-gradient-to-b from-[#2563EB]/[0.08] to-transparent shadow-lg shadow-[#2563EB]/5"
                    : "border-white/[0.06] bg-white/[0.02] hover:border-white/10"
                }`}
              >
                {t.highlight && (
                  <div className="absolute -top-3 left-8 rounded-full bg-[#2563EB] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                    Most Popular
                  </div>
                )}
                <h3 className="text-lg font-semibold text-white">{t.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-white">{t.price}</span>
                  {t.period && <span className="text-sm text-white/40">{t.period}</span>}
                </div>
                <p className="mt-2 text-sm text-white/40">{t.desc}</p>

                <ul className="mt-8 flex-1 space-y-3">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-white/60">
                      <Check size={16} className="mt-0.5 flex-shrink-0 text-[#4A90FF]" />
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={onDemo}
                  className={`mt-8 w-full rounded-xl py-3 text-sm font-semibold transition ${
                    t.highlight
                      ? "bg-[#2563EB] text-white hover:bg-[#1d4ed8]"
                      : "bg-white/[0.06] text-white hover:bg-white/10"
                  }`}
                >
                  {t.cta}
                </button>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={0.4} className="mt-8 text-center">
          <p className="text-xs text-white/30">
            Pricing is indicative and subject to change. Contact sales for final quotes.
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}
