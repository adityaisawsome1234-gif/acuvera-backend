"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedSection } from "./AnimatedSection";

const faqs = [
  {
    q: "Is Acuvera medical advice?",
    a: "No. Acuvera is a billing intelligence tool that identifies potential errors and provides explanations. It does not diagnose, treat, or provide medical advice. Always consult qualified professionals for medical or legal decisions.",
  },
  {
    q: "Do you store my bills?",
    a: "This is configurable. By default, uploaded documents are stored only for the duration of analysis and then deleted. Enterprise customers can configure retention policies to meet their compliance requirements.",
  },
  {
    q: "Can I try it without uploading real PHI?",
    a: "Yes. We provide sample bills for demo purposes so you can explore the platform without uploading any personal health information.",
  },
  {
    q: "What data is sent to AI providers?",
    a: "We disclose exactly what is sent before processing. You must provide explicit consent before any data is shared with third-party AI services. We never send data without your permission.",
  },
  {
    q: "How do you handle HIPAA?",
    a: "We implement administrative, technical, and physical safeguards aligned with HIPAA requirements, including encryption, access controls, audit logging, and Business Associate Agreements where applicable. Formal certification is on our compliance roadmap.",
  },
  {
    q: "What billing formats are supported?",
    a: "Acuvera supports PDF bills, EOBs, CMS-1500 and UB-04 forms, as well as structured EDI data. We're continually expanding format support.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-6">
        <AnimatedSection className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Frequently asked questions
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/40">
            Have a different question? <a href="mailto:hello@acuvera.co" className="text-[#4A90FF] hover:underline">Reach out</a>.
          </p>
        </AnimatedSection>

        <div className="mt-12 divide-y divide-white/[0.06]">
          {faqs.map((f, i) => (
            <AnimatedSection key={i} delay={i * 0.05}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between py-5 text-left transition"
                aria-expanded={open === i}
              >
                <span className="text-[15px] font-medium text-white pr-4">{f.q}</span>
                <ChevronDown
                  size={18}
                  className={`flex-shrink-0 text-white/40 transition-transform duration-200 ${
                    open === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <p className="pb-5 text-sm leading-relaxed text-white/45">{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
