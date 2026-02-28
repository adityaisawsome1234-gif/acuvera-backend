"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import Link from "next/link";

type Props = { onDemo: () => void };

export function Hero({ onDemo }: Props) {
  return (
    <section id="main-content" className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      {/* Background gradient orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#2563EB]/20 blur-[120px]" />
        <div className="absolute -right-40 top-20 h-[400px] w-[400px] rounded-full bg-[#4A90FF]/10 blur-[100px]" />
      </div>

      <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-16 px-6 lg:flex-row lg:items-center lg:gap-20">
        {/* Copy */}
        <div className="flex-1 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="inline-block rounded-full border border-[#4A90FF]/30 bg-[#4A90FF]/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-[#4A90FF]">
              Clarity in Every Medical Bill
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            AI-Powered Medical{" "}
            <span className="bg-gradient-to-r from-[#4A90FF] to-[#2563EB] bg-clip-text text-transparent">
              Billing Intelligence
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-white/50 lg:text-xl"
          >
            Detect billing errors, reduce claim denials, and restore trust in healthcare
            payments — before submission.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start"
          >
            <button
              onClick={onDemo}
              className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#2563EB]/25 transition hover:bg-[#1d4ed8] hover:shadow-[#2563EB]/35 focus-visible:ring-2 focus-visible:ring-[#4A90FF]/50"
            >
              Request Demo <ArrowRight size={16} />
            </button>
            <Link
              href="/demo"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/5"
            >
              <Play size={14} /> Try Live Demo
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-4 text-xs text-white/30"
          >
            No PHI needed for demo &middot; Free to try
          </motion.p>
        </div>

        {/* Abstract bill scanner illustration */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex-1"
        >
          <BillScannerSVG />
        </motion.div>
      </div>

      {/* Social proof strip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="mx-auto mt-20 max-w-3xl border-t border-white/[0.06] pt-8 text-center"
      >
        <p className="text-xs font-medium tracking-widest text-white/30 uppercase">
          Built for Providers &bull; Patients &bull; Revenue Cycle Teams
        </p>
      </motion.div>
    </section>
  );
}

function BillScannerSVG() {
  return (
    <div className="relative mx-auto w-full max-w-md">
      {/* Stacked cards */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative"
      >
        {/* Back card */}
        <div className="absolute left-4 top-4 h-72 w-full rounded-2xl border border-white/[0.06] bg-white/[0.02]" />
        {/* Middle card */}
        <div className="absolute left-2 top-2 h-72 w-full rounded-2xl border border-white/[0.08] bg-white/[0.03]" />
        {/* Front card */}
        <div className="relative h-72 w-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-3 w-20 rounded-full bg-white/10" />
              <div className="h-3 w-12 rounded-full bg-[#4A90FF]/30" />
            </div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-2.5 w-8 rounded bg-white/10" />
                <div className={`h-2.5 rounded ${i === 2 ? "w-32 bg-[#4A90FF]/40" : "w-24 bg-white/[0.06]"}`} />
                <div className="ml-auto h-2.5 w-14 rounded bg-white/[0.06]" />
                {i === 2 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1, type: "spring" }}
                    className="h-5 w-5 rounded-full bg-amber-500/20 flex items-center justify-center"
                  >
                    <span className="text-[8px] text-amber-400">!</span>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
          {/* Scanner sweep */}
          <motion.div
            animate={{ y: [0, 200, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
            className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#4A90FF] to-transparent"
            style={{ top: "30%" }}
          />
        </div>
      </motion.div>
    </div>
  );
}
