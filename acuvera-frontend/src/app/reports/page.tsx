"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ReportCards } from "@/components/reports/ReportCards";

export default function ReportsPage() {
  return (
    <DashboardLayout title="Reports" subtitle="Exportable performance summaries">
      <ReportCards />
    </DashboardLayout>
  );
}
