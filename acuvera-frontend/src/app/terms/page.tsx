import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | Acuvera",
  description: "Acuvera terms of service and conditions of use.",
};

const sections = [
  {
    title: "1. Acceptance of Terms",
    body: "By accessing or using Acuvera's services, you agree to be bound by these Terms of Service. If you do not agree, you may not use our services.",
  },
  {
    title: "2. Description of Service",
    body: "Acuvera provides AI-powered medical billing analysis tools designed to help identify potential errors, explain charges, and suggest corrective actions. Acuvera is not a medical provider, legal advisor, or insurance company. Our analysis is informational and does not constitute medical, legal, or financial advice.",
  },
  {
    title: "3. User Accounts",
    body: "You are responsible for maintaining the confidentiality of your account credentials and for all activity under your account. You must provide accurate, current information during registration and update it as needed.",
  },
  {
    title: "4. Acceptable Use",
    body: "You agree not to misuse the service, including attempting unauthorized access, reverse-engineering, or using the platform for fraudulent purposes. You will not upload content that violates applicable laws or regulations.",
  },
  {
    title: "5. Data & Privacy",
    body: "Your use of Acuvera is also governed by our Privacy Policy. By using the service, you consent to the collection and use of data as described therein. We process data only as needed to provide the service.",
  },
  {
    title: "6. Intellectual Property",
    body: "All content, trademarks, and technology within Acuvera are owned by or licensed to Acuvera. You retain ownership of data you upload. By uploading, you grant Acuvera a limited license to process that data solely to provide the service.",
  },
  {
    title: "7. Limitation of Liability",
    body: "Acuvera is provided \"as is\" without warranties of any kind. We are not liable for indirect, incidental, or consequential damages arising from use of the service. Our total liability is limited to the amount you paid for the service in the 12 months preceding the claim.",
  },
  {
    title: "8. Termination",
    body: "Either party may terminate the agreement at any time. Upon termination, your right to use the service ceases immediately. We may retain certain data as required by law or legitimate business purposes.",
  },
  {
    title: "9. Changes to Terms",
    body: "We may update these terms from time to time. We will notify users of material changes via email or in-app notification. Continued use after changes constitutes acceptance.",
  },
  {
    title: "10. Contact",
    body: "Questions about these terms? Contact us at legal@acuvera.co.",
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0F1117] text-white">
      <nav className="border-b border-white/[0.06] px-6 py-4">
        <Link href="/" className="flex items-center gap-2.5">
          <img src="/acuvera-logo.png" alt="" width={28} height={28} className="rounded-lg" />
          <span className="text-lg font-semibold tracking-tight">Acuvera</span>
        </Link>
      </nav>

      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-bold tracking-tight">Terms of Service</h1>
        <p className="mt-2 text-sm text-white/40">Last updated: January 2026</p>

        <div className="mt-12 space-y-10">
          {sections.map((s) => (
            <section key={s.title}>
              <h2 className="text-lg font-semibold text-white">{s.title}</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-white/50">{s.body}</p>
            </section>
          ))}
        </div>

        <div className="mt-16 border-t border-white/[0.06] pt-8">
          <Link href="/" className="text-sm text-[#4A90FF] hover:underline">&larr; Back to home</Link>
        </div>
      </main>
    </div>
  );
}
