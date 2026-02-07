"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle,
  FileDown,
  Loader2,
  AlertTriangle,
  AlertCircle,
  Info,
} from "lucide-react";
import { Protected } from "@/components/layout/protected";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { apiFetch } from "@/lib/api";
import { BillDetail, Finding, StandardResponse } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";

function severityBadge(severity: string) {
  switch (severity) {
    case "CRITICAL":
    case "HIGH":
      return (
        <span className="rounded-full bg-destructive/10 px-2.5 py-0.5 text-[11px] font-semibold text-destructive">
          High
        </span>
      );
    case "MEDIUM":
      return (
        <span className="rounded-full bg-warning/10 px-2.5 py-0.5 text-[11px] font-semibold text-warning">
          Medium
        </span>
      );
    default:
      return (
        <span className="rounded-full bg-success/10 px-2.5 py-0.5 text-[11px] font-semibold text-success">
          Low
        </span>
      );
  }
}

function severityIcon(severity: string) {
  switch (severity) {
    case "CRITICAL":
    case "HIGH":
      return <AlertTriangle size={16} className="text-destructive" />;
    case "MEDIUM":
      return <AlertCircle size={16} className="text-warning" />;
    default:
      return <Info size={16} className="text-success" />;
  }
}

export default function ClaimDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [bill, setBill] = useState<BillDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [polling, setPolling] = useState(false);

  useEffect(() => {
    async function loadBill() {
      try {
        const res = await apiFetch<StandardResponse<BillDetail>>(
          `/bills/${id}`
        );
        setBill(res.data);
        setLoading(false);
        if (
          res.data.status === "PROCESSING" ||
          res.data.status === "PENDING"
        ) {
          setPolling(true);
        } else {
          setPolling(false);
        }
      } catch {
        setBill(null);
        setLoading(false);
      }
    }
    loadBill();
  }, [id]);

  // Poll for completion
  useEffect(() => {
    if (!polling) return;
    const interval = setInterval(async () => {
      try {
        const res = await apiFetch<StandardResponse<BillDetail>>(
          `/bills/${id}`
        );
        setBill(res.data);
        if (
          res.data.status !== "PROCESSING" &&
          res.data.status !== "PENDING"
        ) {
          setPolling(false);
        }
      } catch {
        setPolling(false);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [polling, id]);

  const findings = bill?.findings ?? [];
  const totalSavings = findings.reduce(
    (s, f) => s + (f.estimated_savings ?? 0),
    0
  );

  return (
    <Protected>
      <DashboardLayout
        title={bill?.file_name ?? "Bill Details"}
        subtitle={
          bill?.uploaded_at
            ? `Uploaded ${formatDate(bill.uploaded_at)}`
            : "Loading..."
        }
        actions={
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/claims">
                <ArrowLeft size={15} /> Back
              </Link>
            </Button>
            {bill?.status === "COMPLETED" && (
              <Button variant="outline" className="gap-1.5">
                <FileDown size={14} /> Export
              </Button>
            )}
          </div>
        }
      >
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-32 animate-pulse rounded-xl border border-border bg-card"
              />
            ))}
          </div>
        ) : polling ? (
          <Card className="flex flex-col items-center py-20 text-center">
            <Loader2
              size={40}
              className="mb-4 animate-spin text-primary"
            />
            <h3 className="text-base font-semibold text-foreground">
              AI Analysis in Progress
            </h3>
            <p className="mt-2 max-w-sm text-[13px] text-muted-foreground">
              Our AI is analyzing your medical bill for errors and savings.
              This usually takes 10-30 seconds. The page will update
              automatically.
            </p>
          </Card>
        ) : !bill ? (
          <Card className="flex flex-col items-center py-16 text-center">
            <p className="text-muted-foreground">Bill not found.</p>
            <Link
              href="/claims"
              className="mt-4 text-[13px] text-primary hover:underline"
            >
              Back to Claims Review
            </Link>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Summary Card */}
            <Card className="space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground">
                    Bill #{bill.id}
                  </p>
                  <p className="mt-1 text-lg font-semibold text-foreground">
                    {bill.file_name}
                  </p>
                </div>
                <Badge
                  variant={
                    bill.status === "COMPLETED"
                      ? "success"
                      : bill.status === "FAILED"
                        ? "destructive"
                        : "neutral"
                  }
                >
                  {bill.status === "COMPLETED"
                    ? "Analysis Complete"
                    : bill.status}
                </Badge>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg bg-muted/50 p-4">
                  <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    Total Amount
                  </p>
                  <p className="mt-1 text-xl font-bold text-foreground">
                    {bill.total_amount
                      ? formatCurrency(bill.total_amount)
                      : "—"}
                  </p>
                </div>
                <div className="rounded-lg bg-muted/50 p-4">
                  <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    Issues Found
                  </p>
                  <p className="mt-1 text-xl font-bold text-foreground">
                    {findings.length}
                  </p>
                </div>
                <div className="rounded-lg bg-success/5 p-4">
                  <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    Potential Savings
                  </p>
                  <p className="mt-1 text-xl font-bold text-success">
                    {formatCurrency(totalSavings)}
                  </p>
                </div>
              </div>
            </Card>

            {/* Line Items */}
            {bill.line_items && bill.line_items.length > 0 && (
              <Card className="overflow-hidden p-0">
                <div className="border-b border-border px-6 py-4">
                  <h3 className="text-sm font-semibold text-foreground">
                    Line Items
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-[13px]">
                    <thead>
                      <tr className="border-b border-border bg-muted/40 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        <th className="px-4 py-2.5">Description</th>
                        <th className="px-4 py-2.5">Code</th>
                        <th className="px-4 py-2.5 text-right">Qty</th>
                        <th className="px-4 py-2.5 text-right">
                          Unit Price
                        </th>
                        <th className="px-4 py-2.5 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {bill.line_items.map((item) => (
                        <tr key={item.id}>
                          <td className="px-4 py-3 text-foreground">
                            {item.description}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {item.code ?? "—"}
                          </td>
                          <td className="px-4 py-3 text-right text-muted-foreground">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-3 text-right text-muted-foreground">
                            {formatCurrency(item.unit_price)}
                          </td>
                          <td className="px-4 py-3 text-right font-medium text-foreground">
                            {formatCurrency(item.total_price)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}

            {/* Findings */}
            <div>
              <h3 className="mb-3 text-sm font-semibold text-foreground">
                AI Findings
                {findings.length > 0 && (
                  <span className="ml-2 text-muted-foreground">
                    ({findings.length})
                  </span>
                )}
              </h3>
              {findings.length === 0 ? (
                <Card className="flex flex-col items-center py-10 text-center">
                  <CheckCircle
                    size={32}
                    className="mb-3 text-success"
                  />
                  <p className="text-[13px] font-medium text-foreground">
                    No issues detected
                  </p>
                  <p className="mt-1 text-[12px] text-muted-foreground">
                    This bill appears to be clean.
                  </p>
                </Card>
              ) : (
                <div className="space-y-3">
                  {findings.map((finding) => (
                    <FindingCard key={finding.id} finding={finding} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </DashboardLayout>
    </Protected>
  );
}

function FindingCard({ finding }: { finding: Finding }) {
  const label = finding.type
    .replace(/_/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <Card className="space-y-3 border-l-4 border-l-transparent">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          {severityIcon(finding.severity)}
          <div>
            <h4 className="text-[13px] font-semibold text-foreground">
              {label}
            </h4>
            <div className="mt-1 flex items-center gap-2">
              {severityBadge(finding.severity)}
              <span className="text-[11px] text-muted-foreground">
                {(finding.confidence * 100).toFixed(0)}% confidence
              </span>
            </div>
          </div>
        </div>
        {finding.estimated_savings > 0 && (
          <div className="text-right">
            <p className="text-[11px] text-muted-foreground">Savings</p>
            <p className="text-sm font-semibold text-success">
              {formatCurrency(finding.estimated_savings)}
            </p>
          </div>
        )}
      </div>
      <p className="text-[13px] leading-relaxed text-muted-foreground">
        {finding.explanation}
      </p>
      {finding.recommended_action && (
        <div className="rounded-lg bg-muted/50 p-3">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Recommended Action
          </p>
          <p className="mt-1 text-[13px] text-foreground">
            {finding.recommended_action}
          </p>
        </div>
      )}
    </Card>
  );
}
