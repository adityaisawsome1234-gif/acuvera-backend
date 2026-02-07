"use client";

import { useEffect, useState } from "react";
import { Protected } from "@/components/layout/protected";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { apiFetch } from "@/lib/api";
import { ProviderDashboard, ProviderStats, StandardResponse } from "@/lib/types";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function ProviderPage() {
  const [dashboard, setDashboard] = useState<ProviderDashboard | null>(null);
  const [stats, setStats] = useState<ProviderStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const dashRes = await apiFetch<StandardResponse<ProviderDashboard>>(
          "/provider/orgs/dashboard"
        );
        const statsRes = await apiFetch<StandardResponse<ProviderStats>>(
          "/provider/orgs/stats"
        );
        setDashboard(dashRes.data);
        setStats(statsRes.data);
      } catch {
        setDashboard(null);
        setStats(null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <Protected roles={["PROVIDER", "ADMIN"]}>
      <DashboardShell>
        <div>
          <h1 className="text-2xl font-semibold text-white">Provider dashboard</h1>
          <p className="text-slate-300">Performance insights for your organization.</p>
        </div>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-3">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardDescription>Claims reviewed</CardDescription>
                <CardTitle>{stats?.claims_reviewed ?? 0}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Errors caught</CardDescription>
                <CardTitle>{stats?.errors_caught ?? 0}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Total savings</CardDescription>
                <CardTitle>${stats?.estimated_savings_total?.toFixed(2) ?? "0.00"}</CardTitle>
              </CardHeader>
            </Card>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Savings over time</CardTitle>
            <CardDescription>Monthly impact for your organization.</CardDescription>
          </CardHeader>
          {stats?.savings_over_time?.length ? (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.savings_over_time}>
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ background: "#0b1220", border: "1px solid #1e293b" }} />
                  <Bar dataKey="savings" fill="#FF6A00" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-slate-400">No savings data yet.</p>
          )}
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Organization snapshot</CardTitle>
            <CardDescription>
              {dashboard?.organization_name ?? "Your organization"} recent activity.
            </CardDescription>
          </CardHeader>
          {dashboard?.recent_bills?.length ? (
            <div className="space-y-2 text-sm text-slate-300">
              {dashboard.recent_bills.slice(0, 5).map((bill, idx) => (
                <div
                  key={`recent-${idx}`}
                  className="rounded-xl border border-border bg-secondary/60 p-3"
                >
                  {JSON.stringify(bill)}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400">No recent bills to show.</p>
          )}
        </Card>
      </DashboardShell>
    </Protected>
  );
}
