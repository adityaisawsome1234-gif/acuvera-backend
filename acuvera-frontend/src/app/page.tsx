"use client";

import {
  AlertTriangle,
  DollarSign,
  FileSearch,
  ShieldAlert,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { KPICard } from "@/components/dashboard/KPICard";
import { DenialRiskChart } from "@/components/dashboard/DenialRiskChart";
import { ErrorsByCategoryChart } from "@/components/dashboard/ErrorsByCategoryChart";
import { SavingsTrendChart } from "@/components/dashboard/SavingsTrendChart";
import { kpiData } from "@/lib/mockData";
import { formatCurrency, formatPercent } from "@/lib/utils";

export default function DashboardPage() {
  return (
    <DashboardLayout
      title="Dashboard"
      subtitle="Clarity in every medical bill"
    >
      <div className="grid gap-6 lg:grid-cols-4">
        <KPICard
          title="Claims Reviewed"
          value={kpiData.claimsReviewed.toLocaleString()}
          trend={kpiData.claimsReviewedTrend}
          icon={<FileSearch size={18} />}
        />
        <KPICard
          title="Errors Caught"
          value={kpiData.errorsCaught.toLocaleString()}
          trend={kpiData.errorsCaughtTrend}
          icon={<AlertTriangle size={18} />}
        />
        <KPICard
          title="Revenue Protected"
          value={formatCurrency(kpiData.revenueSaved)}
          trend={kpiData.revenueSavedTrend}
          icon={<DollarSign size={18} />}
        />
        <KPICard
          title="Denial Risk"
          value={formatPercent(kpiData.denialRisk)}
          trend={kpiData.denialRiskTrend}
          icon={<ShieldAlert size={18} />}
          invertTrend
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <DenialRiskChart />
        <ErrorsByCategoryChart />
      </div>

      <SavingsTrendChart />
    </DashboardLayout>
  );
}
