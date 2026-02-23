"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle } from "lucide-react";

type Props = { open: boolean; onClose: () => void };

export function DemoModal({ open, onClose }: Props) {
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const firstInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setSubmitted(false);
      setErrors({});
      setTimeout(() => firstInput.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
    return e;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length) { setErrors(v); return; }
    // Stub: replace with real API call
    console.log("Demo request:", form);
    setSubmitted(true);
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full max-w-lg rounded-2xl border border-white/10 bg-[#0F1117] p-8 shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Request a demo"
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-white/40 transition hover:bg-white/10 hover:text-white"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            {submitted ? (
              <div className="flex flex-col items-center py-8 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20">
                  <CheckCircle size={28} className="text-emerald-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">Thanks! We&apos;ll be in touch.</h3>
                <p className="mt-2 text-sm text-white/50">
                  A member of our team will reach out within 24 hours.
                </p>
                <button
                  onClick={onClose}
                  className="mt-6 rounded-xl bg-white/10 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-white/15"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-semibold text-white">Request a Demo</h3>
                <p className="mt-1 text-sm text-white/50">
                  See how Acuvera fits into your billing workflow.
                </p>
                <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
                  <Field
                    ref={firstInput}
                    label="Name"
                    value={form.name}
                    error={errors.name}
                    onChange={(v) => setForm((p) => ({ ...p, name: v }))}
                    placeholder="Jamie Doe"
                  />
                  <Field
                    label="Work email"
                    type="email"
                    value={form.email}
                    error={errors.email}
                    onChange={(v) => setForm((p) => ({ ...p, email: v }))}
                    placeholder="jamie@clinic.com"
                  />
                  <Field
                    label="Company / Role"
                    value={form.company}
                    onChange={(v) => setForm((p) => ({ ...p, company: v }))}
                    placeholder="Acme Health — Revenue Cycle Manager"
                  />
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-white/60">Message (optional)</label>
                    <textarea
                      value={form.message}
                      onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                      rows={3}
                      className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-[#4A90FF]/50 focus:ring-1 focus:ring-[#4A90FF]/30"
                      placeholder="Tell us about your billing workflow..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-[#2563EB] py-3 text-sm font-semibold text-white transition hover:bg-[#1d4ed8] focus-visible:ring-2 focus-visible:ring-[#4A90FF]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F1117]"
                  >
                    Request Demo
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

import { forwardRef } from "react";

type FieldProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  placeholder?: string;
};

const Field = forwardRef<HTMLInputElement, FieldProps>(
  ({ label, value, onChange, error, type = "text", placeholder }, ref) => (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-white/60">{label}</label>
      <input
        ref={ref}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-xl border bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none transition focus:ring-1 ${
          error
            ? "border-red-500/60 focus:border-red-500/80 focus:ring-red-500/30"
            : "border-white/10 focus:border-[#4A90FF]/50 focus:ring-[#4A90FF]/30"
        }`}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
);
Field.displayName = "Field";
