"use client";

import { Protected } from "@/components/layout/protected";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AnalyticsCharts } from "@/components/analytics/AnalyticsCharts";

export default function AnalyticsPage() {
  return (
    <Protected>
      <DashboardLayout
        title="Analytics"
        subtitle="Trend insights across errors, savings, and accuracy"
      >
        <AnalyticsCharts />
      </DashboardLayout>
    </Protected>
  );
}
