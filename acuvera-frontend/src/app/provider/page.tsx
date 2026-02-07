"use client";

import { useEffect, useState } from "react";
import { Protected } from "@/components/layout/protected";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { apiFetch } from "@/lib/api";
import { ProviderDashboard, ProviderStats, StandardResponse } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export default function ProviderPage() {
  const [stats, setStats] = useState<ProviderStats | null>(null);
  const [dashboard, setDashboard] = useState<ProviderDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [dashRes, statsRes] = await Promise.allSettled([
          apiFetch<StandardResponse<ProviderDashboard>>(
            "/provider/orgs/dashboard"
          ),
          apiFetch<StandardResponse<ProviderStats>>("/provider/orgs/stats"),
        ]);
        if (dashRes.status === "fulfilled") setDashboard(dashRes.value.data);
        if (statsRes.status === "fulfilled") setStats(statsRes.value.data);
      } catch {
        /* noop */
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <Protected roles={["PROVIDER", "ADMIN"]}>
      <DashboardLayout
        title="Provider Dashboard"
        subtitle={
          dashboard?.organization_name ?? "Organization performance insights"
        }
      >
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-24 animate-pulse rounded-xl border border-border bg-card"
              />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Claims Reviewed
              </p>
              <p className="mt-2 text-2xl font-bold text-foreground">
                {stats?.claims_reviewed ?? 0}
              </p>
            </Card>
            <Card>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Errors Caught
              </p>
              <p className="mt-2 text-2xl font-bold text-foreground">
                {stats?.errors_caught ?? 0}
              </p>
            </Card>
            <Card>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Total Savings
              </p>
              <p className="mt-2 text-2xl font-bold text-success">
                {formatCurrency(stats?.estimated_savings_total ?? 0)}
              </p>
            </Card>
          </div>
        )}
      </DashboardLayout>
    </Protected>
  );
}
