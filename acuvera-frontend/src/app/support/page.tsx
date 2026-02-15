"use client";

import Link from "next/link";
import { Shield, ArrowLeft, Mail, Clock, MessageCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function SupportPolicyPage() {
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
        <h1 className="text-3xl font-bold tracking-tight">Support Policy</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Last updated: January 30, 2026
        </p>

        {/* Contact Cards */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Card className="flex flex-col items-center p-5 text-center">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Mail size={18} className="text-primary" />
            </div>
            <p className="text-[13px] font-semibold text-foreground">Email</p>
            <a
              href="mailto:support@acuvera.co"
              className="mt-1 text-[12px] text-primary hover:underline"
            >
              support@acuvera.co
            </a>
          </Card>
          <Card className="flex flex-col items-center p-5 text-center">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-success/10">
              <Clock size={18} className="text-success" />
            </div>
            <p className="text-[13px] font-semibold text-foreground">
              Response Time
            </p>
            <p className="mt-1 text-[12px] text-muted-foreground">
              Within 24 hours
            </p>
          </Card>
          <Card className="flex flex-col items-center p-5 text-center">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-warning/10">
              <MessageCircle size={18} className="text-warning" />
            </div>
            <p className="text-[13px] font-semibold text-foreground">
              Hours
            </p>
            <p className="mt-1 text-[12px] text-muted-foreground">
              Mon&ndash;Fri, 9am&ndash;6pm ET
            </p>
          </Card>
        </div>

        <div className="mt-10 space-y-10 text-[14px] leading-relaxed text-muted-foreground">
          {/* 1 */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              1. Overview
            </h2>
            <p>
              Acuvera is committed to providing reliable, responsive support
              for all users of our AI-powered medical billing analysis
              platform. This Support Policy outlines how you can get help,
              what to expect, and how we handle support requests.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              2. How to Contact Support
            </h2>
            <p>You can reach our support team through the following channels:</p>
            <ul className="mt-3 list-disc space-y-1.5 pl-5">
              <li>
                <strong className="text-foreground">Email:</strong>{" "}
                <a
                  href="mailto:support@acuvera.co"
                  className="text-primary hover:underline"
                >
                  support@acuvera.co
                </a>
              </li>
              <li>
                <strong className="text-foreground">In-app:</strong> Use the
                Settings page within the Acuvera application.
              </li>
            </ul>
            <p className="mt-3">
              When submitting a support request, please include:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Your account email address</li>
              <li>A clear description of the issue or question</li>
              <li>
                Screenshots or error messages, if applicable
              </li>
              <li>The device and browser/app version you are using</li>
            </ul>
          </section>

          {/* 3 */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              3. Response Times
            </h2>
            <p>
              We strive to respond to all support requests promptly. Our
              target response times are:
            </p>
            <div className="mt-4 overflow-hidden rounded-xl border border-border">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    <th className="px-4 py-2.5">Priority</th>
                    <th className="px-4 py-2.5">Description</th>
                    <th className="px-4 py-2.5">Response Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="px-4 py-3 font-medium text-destructive">
                      Critical
                    </td>
                    <td className="px-4 py-3">
                      Service outage, data loss, or security incident
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground">
                      Within 4 hours
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-warning">High</td>
                    <td className="px-4 py-3">
                      Feature not working, upload failures, incorrect analysis
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground">
                      Within 12 hours
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-primary">
                      Normal
                    </td>
                    <td className="px-4 py-3">
                      General questions, account changes, feature requests
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground">
                      Within 24 hours
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-muted-foreground">
                      Low
                    </td>
                    <td className="px-4 py-3">
                      Feedback, suggestions, non-urgent inquiries
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground">
                      Within 48 hours
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-[12px]">
              Response times are for business hours (Monday&ndash;Friday,
              9:00 AM&ndash;6:00 PM ET). Requests received outside business
              hours will be addressed the next business day.
            </p>
          </section>

          {/* 4 */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              4. What We Support
            </h2>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>Account creation, login, and password issues</li>
              <li>Uploading and processing medical billing documents</li>
              <li>Understanding AI analysis results and findings</li>
              <li>Billing and subscription inquiries</li>
              <li>Data export, deletion, and privacy requests</li>
              <li>Bug reports and technical issues</li>
              <li>Feature requests and feedback</li>
            </ul>
          </section>

          {/* 5 */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              5. What We Do Not Support
            </h2>
            <p>
              Acuvera is a billing analysis tool and does not provide:
            </p>
            <ul className="mt-3 list-disc space-y-1.5 pl-5">
              <li>Medical advice or clinical recommendations</li>
              <li>Legal advice or representation</li>
              <li>
                Direct communication with insurance companies or healthcare
                providers on your behalf
              </li>
              <li>
                Guaranteed outcomes regarding billing disputes or savings
              </li>
            </ul>
            <p className="mt-3">
              Our analysis is informational and should be reviewed by a
              qualified professional before taking action.
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              6. Account &amp; Data Requests
            </h2>
            <p>
              You may request the following at any time by emailing{" "}
              <a
                href="mailto:support@acuvera.co"
                className="text-primary hover:underline"
              >
                support@acuvera.co
              </a>
              :
            </p>
            <ul className="mt-3 list-disc space-y-1.5 pl-5">
              <li>
                <strong className="text-foreground">Data export:</strong> a copy
                of all your data in a portable format.
              </li>
              <li>
                <strong className="text-foreground">Account deletion:</strong>{" "}
                permanent deletion of your account and all associated data.
              </li>
              <li>
                <strong className="text-foreground">Data correction:</strong>{" "}
                correction of inaccurate personal information.
              </li>
            </ul>
            <p className="mt-3">
              We will process data requests within 30 days, in compliance
              with applicable privacy laws.
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              7. Service Availability
            </h2>
            <p>
              We aim to maintain 99.9% uptime for the Acuvera platform. In
              the event of scheduled maintenance, we will provide advance
              notice when possible. Unplanned outages will be communicated
              via email and resolved as quickly as possible.
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              8. Updates to This Policy
            </h2>
            <p>
              We may update this Support Policy from time to time. Changes
              will be reflected by the &quot;Last updated&quot; date at the
              top of this page. Continued use of the Service constitutes
              acceptance of the updated policy.
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              9. Contact
            </h2>
            <div className="rounded-xl border border-border bg-card p-4 text-[13px]">
              <p className="font-medium text-foreground">Acuvera Support</p>
              <p className="mt-1">
                Email:{" "}
                <a
                  href="mailto:support@acuvera.co"
                  className="text-primary hover:underline"
                >
                  support@acuvera.co
                </a>
              </p>
              <p>
                Privacy inquiries:{" "}
                <a
                  href="mailto:privacy@acuvera.co"
                  className="text-primary hover:underline"
                >
                  privacy@acuvera.co
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
          <Link href="/privacy" className="hover:text-foreground hover:underline">
            Privacy Policy
          </Link>
          <span>&middot;</span>
          <Link href="/dashboard" className="hover:text-foreground hover:underline">
            Back to Dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}
