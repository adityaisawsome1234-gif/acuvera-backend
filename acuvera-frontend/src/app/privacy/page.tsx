"use client";

import Link from "next/link";
import { Shield, ArrowLeft } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl items-center gap-4 px-6 py-5">
          <Link
            href="/"
            className="flex items-center gap-2 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft size={14} />
            Back
          </Link>
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Shield size={16} className="text-white" />
            </div>
            <span className="text-[15px] font-semibold tracking-tight">
              Acuvera
            </span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Last updated: January 30, 2026
        </p>

        <div className="mt-10 space-y-10 text-[14px] leading-relaxed text-muted-foreground">
          {/* 1 */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              1. Introduction
            </h2>
            <p>
              Acuvera (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;)
              provides an AI-powered medical billing analysis platform that
              helps patients and healthcare providers detect billing errors,
              overcharges, and compliance issues. This Privacy Policy explains
              how we collect, use, disclose, and safeguard your information
              when you use our website, mobile application, and related
              services (collectively, the &quot;Service&quot;).
            </p>
            <p className="mt-3">
              By accessing or using the Service, you agree to this Privacy
              Policy. If you do not agree, please do not use the Service.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              2. Information We Collect
            </h2>

            <h3 className="mb-2 mt-4 text-[15px] font-medium text-foreground">
              2.1 Information You Provide
            </h3>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>
                <strong className="text-foreground">Account data:</strong> name,
                email address, password, and role (patient, provider, or
                administrator).
              </li>
              <li>
                <strong className="text-foreground">
                  Uploaded billing documents:
                </strong>{" "}
                medical bills, Explanation of Benefits (EOBs), itemized
                statements, and related healthcare billing files you choose to
                upload for analysis.
              </li>
              <li>
                <strong className="text-foreground">Support inquiries:</strong>{" "}
                information you provide when contacting us for support.
              </li>
            </ul>

            <h3 className="mb-2 mt-4 text-[15px] font-medium text-foreground">
              2.2 Information Collected Automatically
            </h3>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>
                <strong className="text-foreground">Usage data:</strong> pages
                visited, features used, timestamps, and interaction patterns.
              </li>
              <li>
                <strong className="text-foreground">Device information:</strong>{" "}
                browser type, operating system, device identifiers, and screen
                resolution.
              </li>
              <li>
                <strong className="text-foreground">Log data:</strong> IP
                address, access times, and referring URLs.
              </li>
            </ul>

            <h3 className="mb-2 mt-4 text-[15px] font-medium text-foreground">
              2.3 Information from Third Parties
            </h3>
            <p>
              We may receive information from authentication providers if you
              choose to sign in through a third-party service (e.g., Apple
              Sign-In, Google).
            </p>
          </section>

          {/* 3 */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              3. How We Use Your Information
            </h2>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>
                To provide, operate, and improve the Service, including AI-powered
                billing analysis.
              </li>
              <li>To create and manage your account.</li>
              <li>
                To process and analyze uploaded billing documents for errors,
                overcharges, and compliance issues.
              </li>
              <li>
                To communicate with you about your account, updates, and support
                requests.
              </li>
              <li>
                To monitor and analyze usage trends to improve user experience.
              </li>
              <li>
                To detect, prevent, and address security issues and fraud.
              </li>
              <li>To comply with legal obligations.</li>
            </ul>
          </section>

          {/* 4 */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              4. Protected Health Information (PHI) &amp; HIPAA
            </h2>
            <p>
              Uploaded medical billing documents may contain Protected Health
              Information (PHI) as defined by the Health Insurance Portability
              and Accountability Act (HIPAA). We take the following measures to
              protect PHI:
            </p>
            <ul className="mt-3 list-disc space-y-1.5 pl-5">
              <li>
                All data is encrypted in transit (TLS 1.2+) and at rest (AES-256).
              </li>
              <li>
                Access to PHI is strictly limited to authorized personnel and
                automated systems required for analysis.
              </li>
              <li>
                We do not sell, rent, or share PHI with third parties for
                marketing purposes.
              </li>
              <li>
                Uploaded documents are processed solely for the purpose of
                billing analysis and are not used to train AI models.
              </li>
              <li>
                We maintain administrative, technical, and physical safeguards
                consistent with HIPAA requirements.
              </li>
              <li>
                We will enter into Business Associate Agreements (BAAs) with
                covered entities as required by HIPAA.
              </li>
            </ul>
          </section>

          {/* 5 */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              5. Data Sharing &amp; Disclosure
            </h2>
            <p>We may share your information only in the following cases:</p>
            <ul className="mt-3 list-disc space-y-1.5 pl-5">
              <li>
                <strong className="text-foreground">Service providers:</strong>{" "}
                trusted third-party vendors who assist in operating the Service
                (e.g., cloud hosting, AI processing), bound by confidentiality
                agreements.
              </li>
              <li>
                <strong className="text-foreground">Legal compliance:</strong>{" "}
                when required by law, regulation, legal process, or governmental
                request.
              </li>
              <li>
                <strong className="text-foreground">Business transfers:</strong>{" "}
                in connection with a merger, acquisition, or sale of assets,
                with continued protection of your data.
              </li>
              <li>
                <strong className="text-foreground">With your consent:</strong>{" "}
                when you explicitly authorize sharing.
              </li>
            </ul>
            <p className="mt-3">
              We do <strong className="text-foreground">not</strong> sell your
              personal information or health data to third parties.
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              6. Data Retention
            </h2>
            <p>
              We retain your account information for as long as your account is
              active. Uploaded billing documents and analysis results are
              retained for a reasonable period to provide the Service and may be
              deleted upon your request. When data is no longer needed, it is
              securely deleted or anonymized.
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              7. Your Rights
            </h2>
            <p>
              Depending on your jurisdiction, you may have the following rights:
            </p>
            <ul className="mt-3 list-disc space-y-1.5 pl-5">
              <li>
                <strong className="text-foreground">Access:</strong> request a
                copy of the personal data we hold about you.
              </li>
              <li>
                <strong className="text-foreground">Correction:</strong> request
                correction of inaccurate or incomplete data.
              </li>
              <li>
                <strong className="text-foreground">Deletion:</strong> request
                deletion of your personal data and uploaded documents.
              </li>
              <li>
                <strong className="text-foreground">Data portability:</strong>{" "}
                receive your data in a structured, machine-readable format.
              </li>
              <li>
                <strong className="text-foreground">Opt-out:</strong> opt out of
                non-essential communications at any time.
              </li>
              <li>
                <strong className="text-foreground">Withdraw consent:</strong>{" "}
                where processing is based on consent, withdraw it at any time.
              </li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, contact us at{" "}
              <a
                href="mailto:privacy@acuvera.co"
                className="font-medium text-primary hover:underline"
              >
                privacy@acuvera.co
              </a>
              .
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              8. Security
            </h2>
            <p>
              We implement industry-standard security measures, including
              encryption, access controls, secure infrastructure, and regular
              security assessments. While no system is 100% secure, we are
              committed to protecting your data to the highest practical
              standard.
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              9. Children&apos;s Privacy
            </h2>
            <p>
              The Service is not intended for individuals under 18 years of age.
              We do not knowingly collect personal information from children. If
              we become aware that we have collected data from a child, we will
              take steps to delete it promptly.
            </p>
          </section>

          {/* 10 */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              10. Third-Party Services
            </h2>
            <p>
              The Service may contain links to third-party websites or services.
              We are not responsible for the privacy practices of those third
              parties. We encourage you to review their privacy policies.
            </p>
          </section>

          {/* 11 */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              11. Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. When we do,
              we will revise the &quot;Last updated&quot; date at the top. We
              encourage you to review this policy periodically. Continued use
              of the Service after changes constitutes acceptance of the
              updated policy.
            </p>
          </section>

          {/* 12 */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              12. Contact Us
            </h2>
            <p>
              If you have questions or concerns about this Privacy Policy or
              our data practices, please contact us:
            </p>
            <div className="mt-3 rounded-xl border border-border bg-card p-4 text-[13px]">
              <p className="font-medium text-foreground">Acuvera</p>
              <p className="mt-1">
                Email:{" "}
                <a
                  href="mailto:privacy@acuvera.co"
                  className="text-primary hover:underline"
                >
                  privacy@acuvera.co
                </a>
              </p>
              <p>
                Support:{" "}
                <a
                  href="mailto:support@acuvera.co"
                  className="text-primary hover:underline"
                >
                  support@acuvera.co
                </a>
              </p>
              <p>
                Website:{" "}
                <a
                  href="https://acuvera.co"
                  className="text-primary hover:underline"
                >
                  https://acuvera.co
                </a>
              </p>
            </div>
          </section>
        </div>

        {/* Footer links */}
        <div className="mt-12 flex items-center gap-4 border-t border-border pt-6 text-[12px] text-muted-foreground">
          <Link href="/support" className="hover:text-foreground hover:underline">
            Support Policy
          </Link>
          <span>&middot;</span>
          <Link href="/" className="hover:text-foreground hover:underline">
            Back to Dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}
