"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { label: "Product", href: "#product" },
  { label: "How it Works", href: "#how-it-works" },
  { label: "Security", href: "#security" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQs", href: "#faq" },
];

type Props = { onDemo: () => void };

export function Navbar({ onDemo }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only fixed left-4 top-4 z-[200] rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-medium text-white"
      >
        Skip to content
      </a>

      <header
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "border-b border-white/[0.06] bg-[#0F1117]/90 backdrop-blur-xl shadow-lg shadow-black/10"
            : "bg-transparent"
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4" aria-label="Main navigation">
          <Link href="/" className="flex items-center gap-2.5">
            <img src="/acuvera-logo.png" alt="" width={32} height={32} className="rounded-lg" />
            <span className="text-lg font-semibold tracking-tight text-white">Acuvera</span>
          </Link>

          {/* Desktop */}
          <div className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="rounded-lg px-3 py-2 text-[13px] font-medium text-white/60 transition hover:bg-white/5 hover:text-white"
              >
                {l.label}
              </a>
            ))}
          </div>
          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/login"
              className="rounded-lg px-4 py-2 text-[13px] font-medium text-white/70 transition hover:text-white"
            >
              Sign in
            </Link>
            <button
              onClick={onDemo}
              className="rounded-xl bg-[#2563EB] px-5 py-2.5 text-[13px] font-semibold text-white transition hover:bg-[#1d4ed8] focus-visible:ring-2 focus-visible:ring-[#4A90FF]/50"
            >
              Request Demo
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            className="rounded-lg p-2 text-white/60 transition hover:bg-white/10 md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden border-t border-white/[0.06] bg-[#0F1117]/95 backdrop-blur-xl md:hidden"
            >
              <div className="space-y-1 px-6 py-4">
                {links.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-lg px-3 py-2.5 text-sm text-white/70 transition hover:bg-white/5 hover:text-white"
                  >
                    {l.label}
                  </a>
                ))}
                <div className="flex flex-col gap-2 pt-3">
                  <Link href="/login" className="rounded-lg px-3 py-2.5 text-sm text-white/70">
                    Sign in
                  </Link>
                  <button
                    onClick={() => { setMobileOpen(false); onDemo(); }}
                    className="rounded-xl bg-[#2563EB] py-2.5 text-sm font-semibold text-white"
                  >
                    Request Demo
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
