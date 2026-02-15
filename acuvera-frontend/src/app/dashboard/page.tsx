"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  DollarSign,
  FileSearch,
  ShieldAlert,
  Upload,
} from "lucide-react";
import { Protected } from "@/components/layout/protected";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { KPICard } from "@/components/dashboard/KPICard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { apiFetch } from "@/lib/api";
import { BillListItem, StandardResponse } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  const [bills, setBills] = useState<BillListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await apiFetch<StandardResponse<BillListItem[]>>("/bills/");
        setBills(res.data ?? []);
      } catch {
        setBills([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Compute KPIs from real data
  const totalBills = bills.length;
  const totalFindings = bills.reduce((s, b) => s + b.findings_count, 0);
  const totalSavings = bills.reduce((s, b) => s + b.estimated_savings, 0);
  const completedBills = bills.filter((b) => b.status === "COMPLETED").length;
  const reviewRate = totalBills > 0 ? (completedBills / totalBills) * 100 : 0;

  const recentBills = [...bills]
    .sort(
      (a, b) =>
        new Date(b.uploaded_at ?? 0).getTime() -
        new Date(a.uploaded_at ?? 0).getTime()
    )
    .slice(0, 5);

  return (
    <Protected>
      <DashboardLayout
        title="Dashboard"
        subtitle="AI-powered medical billing intelligence"
      >
        {/* Upload CTA */}
        <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-foreground">
                Analyze a medical bill
              </h3>
              <p className="mt-1 max-w-lg text-[13px] text-muted-foreground">
                Upload a PDF and our AI will detect billing errors, overcharges,
                and savings opportunities in seconds.
              </p>
            </div>
            <Link href="/upload">
              <Button className="gap-2">
                <Upload size={15} />
                Upload Bill
              </Button>
            </Link>
          </div>
        </div>

        {/* KPIs */}
        {loading ? (
          <div className="grid gap-4 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-[130px] animate-pulse rounded-2xl border border-border bg-card"
              />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-4">
            <KPICard
              title="Bills Analyzed"
              value={totalBills.toLocaleString()}
              icon={<FileSearch size={16} />}
            />
            <KPICard
              title="Issues Found"
              value={totalFindings.toLocaleString()}
              icon={<AlertTriangle size={16} />}
            />
            <KPICard
              title="Potential Savings"
              value={formatCurrency(totalSavings)}
              icon={<DollarSign size={16} />}
            />
            <KPICard
              title="Review Rate"
              value={`${reviewRate.toFixed(0)}%`}
              icon={<ShieldAlert size={16} />}
            />
          </div>
        )}

        {/* Recent Bills or Empty State */}
        {!loading && bills.length === 0 ? (
          <Card className="flex flex-col items-center py-16 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
              <FileSearch size={24} className="text-muted-foreground" />
            </div>
            <h3 className="text-base font-semibold text-foreground">
              No bills analyzed yet
            </h3>
            <p className="mt-1 max-w-sm text-[13px] text-muted-foreground">
              Upload your first medical bill to see AI-powered analysis,
              error detection, and savings recommendations here.
            </p>
            <Link href="/upload" className="mt-6">
              <Button className="gap-2">
                <Upload size={15} />
                Upload your first bill
              </Button>
            </Link>
          </Card>
        ) : !loading && bills.length > 0 ? (
          <Card className="overflow-hidden p-0">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  Recent Bills
                </h3>
                <p className="text-[12px] text-muted-foreground">
                  Your latest uploaded medical bills
                </p>
              </div>
              <Link href="/claims">
                <Button variant="ghost" className="gap-1 text-[13px]">
                  View all <ArrowRight size={14} />
                </Button>
              </Link>
            </div>
            <div className="divide-y divide-border">
              {recentBills.map((bill) => (
                <Link
                  key={bill.id}
                  href={`/claims/${bill.id}`}
                  className="flex items-center justify-between px-6 py-3.5 transition-colors duration-150 hover:bg-muted/50"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium text-foreground">
                      {bill.file_name}
                    </p>
                    <p className="text-[12px] text-muted-foreground">
                      {bill.uploaded_at
                        ? formatDate(bill.uploaded_at)
                        : "Recently uploaded"}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    {bill.findings_count > 0 && (
                      <span className="text-[13px] font-medium text-success">
                        {formatCurrency(bill.estimated_savings)}
                      </span>
                    )}
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
                        ? "Analyzed"
                        : bill.status === "PROCESSING"
                          ? "Processing"
                          : bill.status === "FAILED"
                            ? "Failed"
                            : "Pending"}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          </Card>
        ) : null}
      </DashboardLayout>
    </Protected>
  );
}
