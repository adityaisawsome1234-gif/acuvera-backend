"use client";

import { Protected } from "@/components/layout/protected";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ReportCards } from "@/components/reports/ReportCards";

export default function ReportsPage() {
  return (
    <Protected>
      <DashboardLayout title="Reports" subtitle="Exportable performance summaries">
        <ReportCards />
      </DashboardLayout>
    </Protected>
  );
}
