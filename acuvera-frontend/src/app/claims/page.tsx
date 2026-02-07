"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ClaimsTable } from "@/components/claims/ClaimsTable";

export default function ClaimsReviewPage() {
  return (
    <DashboardLayout
      title="Claims Review"
      subtitle="Filter, prioritize, and action high-risk claims"
    >
      <ClaimsTable />
    </DashboardLayout>
  );
}
