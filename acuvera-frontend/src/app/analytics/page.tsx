"use client";

import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BarChart3 } from "lucide-react";
import { Protected } from "@/components/layout/protected";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { apiFetch } from "@/lib/api";
import { BillListItem, StandardResponse } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

const chartColors = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

const tooltipStyle = {
  background: "hsl(var(--card))",
  borderRadius: "10px",
  borderColor: "hsl(var(--border))",
  fontSize: "12px",
};

export default function AnalyticsPage() {
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

  // Compute analytics from real data
  const completedBills = bills.filter((b) => b.status === "COMPLETED");
  const totalSavings = completedBills.reduce(
    (s, b) => s + b.estimated_savings,
    0
  );
  const totalFindings = completedBills.reduce(
    (s, b) => s + b.findings_count,
    0
  );

  // Group bills by month for chart
  const monthlyData = (() => {
    const months: Record<string, { month: string; savings: number; issues: number }> = {};
    completedBills.forEach((b) => {
      const d = b.uploaded_at ? new Date(b.uploaded_at) : new Date();
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const label = d.toLocaleDateString("en-US", {
        month: "short",
        year: "2-digit",
      });
      if (!months[key]) months[key] = { month: label, savings: 0, issues: 0 };
      months[key].savings += b.estimated_savings;
      months[key].issues += b.findings_count;
    });
    return Object.values(months).slice(-6);
  })();

  // Issues breakdown (simple)
  const issueBreakdown = [
    { category: "Total Issues", count: totalFindings, color: chartColors[0] },
    {
      category: "With Savings",
      count: completedBills.filter((b) => b.estimated_savings > 0).length,
      color: chartColors[1],
    },
    {
      category: "Clean Bills",
      count: completedBills.filter((b) => b.findings_count === 0).length,
      color: chartColors[2],
    },
  ];

  const hasData = completedBills.length > 0;

  return (
    <Protected>
      <DashboardLayout
        title="Analytics"
        subtitle="Insights across your analyzed bills"
      >
        {loading ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-80 animate-pulse rounded-xl border border-border bg-card"
              />
            ))}
          </div>
        ) : !hasData ? (
          <Card className="flex flex-col items-center py-16 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
              <BarChart3 size={24} className="text-muted-foreground" />
            </div>
            <h3 className="text-base font-semibold text-foreground">
              No analytics data yet
            </h3>
            <p className="mt-1 max-w-sm text-[13px] text-muted-foreground">
              Upload and analyze medical bills to see trends, savings patterns,
              and issue breakdowns here.
            </p>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid gap-4 sm:grid-cols-3">
              <Card>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Total Savings Identified
                </p>
                <p className="mt-2 text-2xl font-bold text-success">
                  {formatCurrency(totalSavings)}
                </p>
              </Card>
              <Card>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Bills Analyzed
                </p>
                <p className="mt-2 text-2xl font-bold text-foreground">
                  {completedBills.length}
                </p>
              </Card>
              <Card>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Total Issues Found
                </p>
                <p className="mt-2 text-2xl font-bold text-foreground">
                  {totalFindings}
                </p>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Savings Over Time */}
              {monthlyData.length > 0 && (
                <Card className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">
                      Savings Over Time
                    </h3>
                    <p className="text-[12px] text-muted-foreground">
                      Monthly savings from analyzed bills
                    </p>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={monthlyData}>
                        <defs>
                          <linearGradient
                            id="savGrad"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor={chartColors[1]}
                              stopOpacity={0.3}
                            />
                            <stop
                              offset="100%"
                              stopColor={chartColors[1]}
                              stopOpacity={0.05}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="hsl(var(--border))"
                        />
                        <XAxis
                          dataKey="month"
                          tickLine={false}
                          axisLine={false}
                          tick={{ fontSize: 11 }}
                        />
                        <YAxis
                          tickLine={false}
                          axisLine={false}
                          tick={{ fontSize: 11 }}
                          tickFormatter={(v) => formatCurrency(v)}
                        />
                        <Tooltip
                          contentStyle={tooltipStyle}
                          formatter={(v: number | undefined) => [
                            formatCurrency(v ?? 0),
                            "Savings",
                          ]}
                        />
                        <Area
                          type="monotone"
                          dataKey="savings"
                          stroke={chartColors[1]}
                          fill="url(#savGrad)"
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              )}

              {/* Issue Breakdown */}
              <Card className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    Bill Breakdown
                  </h3>
                  <p className="text-[12px] text-muted-foreground">
                    Overview of analysis results
                  </p>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={issueBreakdown}
                      layout="vertical"
                      margin={{ left: 10, right: 12 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="hsl(var(--border))"
                      />
                      <XAxis
                        type="number"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11 }}
                      />
                      <YAxis
                        dataKey="category"
                        type="category"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11 }}
                        width={100}
                      />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                        {issueBreakdown.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          </div>
        )}
      </DashboardLayout>
    </Protected>
  );
}
