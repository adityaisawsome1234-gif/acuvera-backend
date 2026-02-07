"use client";

import Link from "next/link";
import {
  AlertTriangle,
  DollarSign,
  FileSearch,
  ShieldAlert,
  Upload,
} from "lucide-react";
import { Protected } from "@/components/layout/protected";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { KPICard } from "@/components/dashboard/KPICard";
import { DenialRiskChart } from "@/components/dashboard/DenialRiskChart";
import { ErrorsByCategoryChart } from "@/components/dashboard/ErrorsByCategoryChart";
import { SavingsTrendChart } from "@/components/dashboard/SavingsTrendChart";
import { kpiData } from "@/lib/mockData";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  return (
    <Protected>
    <DashboardLayout
      title="Dashboard"
      subtitle="Clarity in every medical bill"
    >
      {/* Upload CTA */}
      <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-6">
        <div>
          <h3 className="text-lg font-semibold text-white">Analyze a medical bill</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Upload a PDF to get AI-powered billing error detection and savings recommendations.
          </p>
        </div>
        <Link href="/upload">
          <Button className="gap-2">
            <Upload size={16} />
            Upload Bill
          </Button>
        </Link>
      </div>

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
    </Protected>
  );
}
