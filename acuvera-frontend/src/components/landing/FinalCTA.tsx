"use client";

import { ArrowRight } from "lucide-react";
import { AnimatedSection } from "./AnimatedSection";

type Props = { onDemo: () => void };

export function FinalCTA({ onDemo }: Props) {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="absolute inset-0 bg-gradient-to-t from-[#2563EB]/[0.06] to-transparent" />
      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <AnimatedSection>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Revenue integrity should be{" "}
            <span className="bg-gradient-to-r from-[#4A90FF] to-[#2563EB] bg-clip-text text-transparent">
              automatic
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/40">
            Schedule a demo and see how Acuvera fits into your revenue cycle — in under 15 minutes.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <button
              onClick={onDemo}
              className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-[#2563EB]/25 transition hover:bg-[#1d4ed8] hover:shadow-[#2563EB]/35"
            >
              Schedule a Demo <ArrowRight size={16} />
            </button>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
