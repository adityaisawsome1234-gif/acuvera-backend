"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AnalyticsCharts } from "@/components/analytics/AnalyticsCharts";

export default function AnalyticsPage() {
  return (
    <DashboardLayout
      title="Analytics"
      subtitle="Trend insights across errors, savings, and accuracy"
    >
      <AnalyticsCharts />
    </DashboardLayout>
  );
}
