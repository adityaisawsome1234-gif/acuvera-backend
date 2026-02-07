"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, FileSearch, Search, Upload } from "lucide-react";
import { Protected } from "@/components/layout/protected";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { apiFetch } from "@/lib/api";
import { BillListItem, StandardResponse } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";

function statusBadge(status: string) {
  switch (status) {
    case "COMPLETED":
      return <Badge variant="success">Analyzed</Badge>;
    case "PROCESSING":
      return <Badge variant="neutral">Processing</Badge>;
    case "FAILED":
      return <Badge variant="destructive">Failed</Badge>;
    default:
      return <Badge variant="neutral">Pending</Badge>;
  }
}

function severityLabel(count: number) {
  if (count >= 3) return { label: "High", cls: "status-high" };
  if (count >= 1) return { label: "Medium", cls: "status-medium" };
  return { label: "Low", cls: "status-low" };
}

export default function ClaimsReviewPage() {
  const router = useRouter();
  const [bills, setBills] = useState<BillListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

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

  const filtered = useMemo(() => {
    return bills.filter((b) => {
      const q = query.toLowerCase();
      const matchesQuery =
        !q ||
        b.file_name.toLowerCase().includes(q) ||
        String(b.id).includes(q);
      const matchesStatus =
        statusFilter === "All" || b.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [bills, query, statusFilter]);

  return (
    <Protected>
      <DashboardLayout
        title="Claims Review"
        subtitle="Review AI analysis results for uploaded bills"
        actions={
          <Link href="/upload">
            <Button className="gap-2">
              <Upload size={15} />
              Upload Bill
            </Button>
          </Link>
        }
      >
        {/* Filters */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full sm:max-w-xs">
            <Search
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              className="pl-9"
              placeholder="Search by name or ID..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <select
            className="h-11 rounded-xl border border-border bg-card px-3 text-[13px] text-foreground"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="COMPLETED">Analyzed</option>
            <option value="PROCESSING">Processing</option>
            <option value="PENDING">Pending</option>
            <option value="FAILED">Failed</option>
          </select>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-16 animate-pulse rounded-xl border border-border bg-card"
              />
            ))}
          </div>
        ) : bills.length === 0 ? (
          <Card className="flex flex-col items-center py-16 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
              <FileSearch size={24} className="text-muted-foreground" />
            </div>
            <h3 className="text-base font-semibold text-foreground">
              No bills yet
            </h3>
            <p className="mt-1 max-w-sm text-[13px] text-muted-foreground">
              Upload a medical bill to get started with AI-powered analysis.
            </p>
            <Link href="/upload" className="mt-6">
              <Button className="gap-2">
                <Upload size={15} />
                Upload your first bill
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  <th className="px-4 py-3">File</th>
                  <th className="px-4 py-3">Uploaded</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Issues</th>
                  <th className="px-4 py-3">Savings</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((bill) => {
                  const sev = severityLabel(bill.findings_count);
                  return (
                    <tr
                      key={bill.id}
                      className="table-row-hover"
                      onClick={() => router.push(`/claims/${bill.id}`)}
                    >
                      <td className="px-4 py-3.5">
                        <span className="font-medium text-foreground">
                          {bill.file_name}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-muted-foreground">
                        {bill.uploaded_at
                          ? formatDate(bill.uploaded_at)
                          : "—"}
                      </td>
                      <td className="px-4 py-3.5 font-medium">
                        {bill.total_amount
                          ? formatCurrency(bill.total_amount)
                          : "—"}
                      </td>
                      <td className="px-4 py-3.5">
                        {bill.findings_count > 0 ? (
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${sev.cls}`}
                          >
                            {bill.findings_count} {sev.label}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        {bill.estimated_savings > 0 ? (
                          <span className="font-medium text-success">
                            {formatCurrency(bill.estimated_savings)}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        {statusBadge(bill.status)}
                      </td>
                      <td className="px-4 py-3.5 text-right text-muted-foreground">
                        <ChevronRight size={14} />
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-8 text-center text-[13px] text-muted-foreground"
                    >
                      No bills match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </DashboardLayout>
    </Protected>
  );
}
