"use client";

import { useEffect, useState } from "react";
import { FileText } from "lucide-react";
import { Protected } from "@/components/layout/protected";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { apiFetch } from "@/lib/api";
import { BillListItem, StandardResponse } from "@/lib/types";
import { formatCurrency, formatPercent } from "@/lib/utils";

export default function ReportsPage() {
  const [bills, setBills] = useState<BillListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await apiFetch<StandardResponse<BillListItem[]>>(
          "/bills/"
        );
        setBills(res.data ?? []);
      } catch {
        setBills([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const completed = bills.filter((b) => b.status === "COMPLETED");
  const totalSavings = completed.reduce(
    (s, b) => s + b.estimated_savings,
    0
  );
  const totalFindings = completed.reduce(
    (s, b) => s + b.findings_count,
    0
  );
  const billsWithIssues = completed.filter((b) => b.findings_count > 0).length;
  const avgSavings =
    billsWithIssues > 0 ? totalSavings / billsWithIssues : 0;
  const detectionRate =
    completed.length > 0
      ? (billsWithIssues / completed.length) * 100
      : 0;
  const hasData = completed.length > 0;

  return (
    <Protected>
      <DashboardLayout
        title="Reports"
        subtitle="Performance summary and financial impact"
      >
        {loading ? (
          <div className="grid gap-4 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-28 animate-pulse rounded-xl border border-border bg-card"
              />
            ))}
          </div>
        ) : !hasData ? (
          <Card className="flex flex-col items-center py-16 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
              <FileText size={24} className="text-muted-foreground" />
            </div>
            <h3 className="text-base font-semibold text-foreground">
              No report data yet
            </h3>
            <p className="mt-1 max-w-sm text-[13px] text-muted-foreground">
              Upload and analyze medical bills to generate performance
              reports here.
            </p>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Top-level metrics */}
            <div className="grid gap-4 lg:grid-cols-3">
              <Card>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Total Savings Identified
                </p>
                <p className="mt-2 text-3xl font-bold text-success">
                  {formatCurrency(totalSavings)}
                </p>
                <p className="mt-1 text-[12px] text-muted-foreground">
                  Across {completed.length} analyzed bills
                </p>
              </Card>
              <Card>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Issues Detected
                </p>
                <p className="mt-2 text-3xl font-bold text-foreground">
                  {totalFindings}
                </p>
                <p className="mt-1 text-[12px] text-muted-foreground">
                  {billsWithIssues} bills with issues
                </p>
              </Card>
              <Card>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Detection Rate
                </p>
                <p className="mt-2 text-3xl font-bold text-primary">
                  {formatPercent(detectionRate)}
                </p>
                <p className="mt-1 text-[12px] text-muted-foreground">
                  Bills with at least one issue
                </p>
              </Card>
            </div>

            {/* Detailed breakdown */}
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="space-y-4">
                <div>
                  <p className="text-[12px] text-muted-foreground">
                    Financial Impact
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    Revenue protection summary
                  </p>
                </div>
                <div className="space-y-3 text-[13px]">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Total Bills Analyzed
                    </span>
                    <span className="font-medium text-foreground">
                      {completed.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Bills with Issues
                    </span>
                    <span className="font-medium text-foreground">
                      {billsWithIssues}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Avg. Savings per Bill
                    </span>
                    <span className="font-medium text-foreground">
                      {formatCurrency(avgSavings)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t border-border pt-3">
                    <span className="text-muted-foreground">
                      Total Potential Savings
                    </span>
                    <span className="font-semibold text-success">
                      {formatCurrency(totalSavings)}
                    </span>
                  </div>
                </div>
              </Card>

              <Card className="space-y-4">
                <div>
                  <p className="text-[12px] text-muted-foreground">
                    Operational Metrics
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    Processing and quality metrics
                  </p>
                </div>
                <div className="space-y-3 text-[13px]">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Total Bills Uploaded
                    </span>
                    <span className="font-medium text-foreground">
                      {bills.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Successfully Analyzed
                    </span>
                    <span className="font-medium text-foreground">
                      {completed.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Pending / Processing
                    </span>
                    <span className="font-medium text-foreground">
                      {
                        bills.filter(
                          (b) =>
                            b.status === "PROCESSING" ||
                            b.status === "PENDING"
                        ).length
                      }
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Failed</span>
                    <span className="font-medium text-foreground">
                      {bills.filter((b) => b.status === "FAILED").length}
                    </span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Partnership info */}
            <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
              <p className="text-sm font-semibold text-foreground">
                Success-Based Partnership
              </p>
              <p className="mt-1 text-[13px] text-muted-foreground">
                Acuvera only charges a fee when verified savings are realized.
                No upfront costs, no monthly fees. Your team stays in control
                of every submission.
              </p>
            </Card>
          </div>
        )}
      </DashboardLayout>
    </Protected>
  );
}
