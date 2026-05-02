import AppShell from "@/components/layout/AppShell";
import { apiFetch } from "@/lib/api";

type DashboardPageProps = {
  params: { orgId: string };
};

export default async function DashboardPage({ params }: DashboardPageProps) {
  const stats = await apiFetch(`/api/v1/orgs/${params.orgId}/stats`).catch(() => ({
    documents_total: 0,
    documents_processing: 0,
    findings_total: 0,
    cases_total: 0,
  }));
  return (
    <AppShell title={`Dashboard · ${params.orgId}`}>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="kpi-card">
          <p className="text-sm text-muted-foreground">Open documents</p>
          <p className="text-2xl font-semibold">{stats.documents_total}</p>
        </div>
        <div className="kpi-card">
          <p className="text-sm text-muted-foreground">High-risk findings</p>
          <p className="text-2xl font-semibold text-destructive">
            {stats.findings_total}
          </p>
        </div>
        <div className="kpi-card">
          <p className="text-sm text-muted-foreground">Cases in review</p>
          <p className="text-2xl font-semibold">{stats.cases_total}</p>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">
        This dashboard is populated from the audit pipeline and reflects the
        latest processed documents.
      </p>
    </AppShell>
  );
}
