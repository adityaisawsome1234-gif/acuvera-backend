"use client";

import { Lock, Eye, ShieldCheck, FileCheck, Server, UserCheck } from "lucide-react";
import { AnimatedSection } from "./AnimatedSection";

const features = [
  { icon: Lock, title: "Encryption at rest & in transit", desc: "All data encrypted with AES-256 and TLS 1.3." },
  { icon: Eye, title: "Least-privilege access", desc: "Role-based access controls. Users see only their data." },
  { icon: Server, title: "Data minimization", desc: "We process only what's needed and discard the rest." },
  { icon: FileCheck, title: "Audit logs", desc: "Every action is logged for compliance review." },
  { icon: UserCheck, title: "Consent-first AI", desc: "We ask permission before sending data to any third-party AI service." },
  { icon: ShieldCheck, title: "Compliance roadmap", desc: "SOC 2 (Planned) · HIPAA-ready controls (as applicable)." },
];

export function Security() {
  return (
    <section id="security" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <AnimatedSection className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Security &amp; Privacy
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/40">
            Built for healthcare from day one. Your data stays yours.
          </p>
        </AnimatedSection>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <AnimatedSection key={f.title} delay={0.1 + i * 0.06}>
              <div className="flex gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all duration-300 hover:border-white/10">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#2563EB]/10">
                  <f.icon size={18} className="text-[#4A90FF]" />
                </div>
                <div>
                  <h3 className="text-[15px] font-semibold text-white">{f.title}</h3>
                  <p className="mt-1 text-sm text-white/40">{f.desc}</p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={0.4} className="mt-12 text-center">
          <div className="inline-block rounded-2xl border border-[#4A90FF]/20 bg-[#4A90FF]/[0.05] px-8 py-4">
            <p className="text-sm text-[#4A90FF]">
              <strong>Consent-first AI:</strong> We never send your data to external AI providers
              without explicit permission. You control what gets analyzed.
            </p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
