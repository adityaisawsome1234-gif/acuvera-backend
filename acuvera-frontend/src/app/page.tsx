"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { warmBackend } from "@/lib/warmup";

import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { ProblemSolution } from "@/components/landing/ProblemSolution";
import { ProductPillars } from "@/components/landing/ProductPillars";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Security } from "@/components/landing/Security";
import { Pricing } from "@/components/landing/Pricing";
import { Outcomes } from "@/components/landing/Outcomes";
import { FAQ } from "@/components/landing/FAQ";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Footer } from "@/components/landing/Footer";
import { DemoModal } from "@/components/landing/DemoModal";

export default function LandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [demoOpen, setDemoOpen] = useState(false);

  useEffect(() => {
    if (!loading && user) router.replace("/dashboard");
  }, [user, loading, router]);

  if (loading || user) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: "#0F1117" }}>
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/30 border-t-white" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F1117] text-white">
      <Navbar onDemo={() => { warmBackend(); setDemoOpen(true); }} />
      <Hero onDemo={() => { warmBackend(); setDemoOpen(true); }} />
      <ProblemSolution />
      <ProductPillars />
      <HowItWorks />
      <Security />
      <Outcomes />
      <Pricing onDemo={() => setDemoOpen(true)} />
      <FAQ />
      <FinalCTA onDemo={() => setDemoOpen(true)} />
      <Footer />
      <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
    </div>
  );
}
