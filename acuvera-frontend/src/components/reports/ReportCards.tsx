"use client";

import { Download, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { reportData } from "@/lib/mockData";
import { formatCurrency, formatPercent } from "@/lib/utils";

export function ReportCards() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-end gap-3">
        <Button variant="outline">
          <Download size={16} /> Export PDF
        </Button>
        <Button variant="outline">
          <FileSpreadsheet size={16} /> Export CSV
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="space-y-2">
          <p className="text-sm text-muted-foreground">Total Revenue Protected</p>
          <p className="text-3xl font-bold text-success">
            {formatCurrency(reportData.totalSavings)}
          </p>
          <p className="text-sm text-muted-foreground">Across all reviewed claims</p>
        </Card>
        <Card className="space-y-2">
          <p className="text-sm text-muted-foreground">Denials Prevented</p>
          <p className="text-3xl font-bold">{reportData.denialsPrevented}</p>
          <p className="text-sm text-muted-foreground">High-risk claims corrected</p>
        </Card>
        <Card className="space-y-2">
          <p className="text-sm text-muted-foreground">ROI</p>
          <p className="text-3xl font-bold text-primary">{formatPercent(reportData.roi)}</p>
          <p className="text-sm text-muted-foreground">Return on investment</p>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="space-y-2">
          <p className="text-sm text-muted-foreground">Claims Processed</p>
          <p className="text-2xl font-semibold">{reportData.claimsProcessed}</p>
        </Card>
        <Card className="space-y-2">
          <p className="text-sm text-muted-foreground">Detection Accuracy</p>
          <p className="text-2xl font-semibold">{formatPercent(reportData.accuracyRate)}</p>
        </Card>
        <Card className="space-y-2">
          <p className="text-sm text-muted-foreground">Avg. Processing Time</p>
          <p className="text-2xl font-semibold">{reportData.avgProcessingTime} sec</p>
        </Card>
      </div>

      <Card className="bg-gradient-to-r from-primary/5 to-success/5">
        <p className="text-lg font-semibold">Success-Based Partnership</p>
        <p className="text-sm text-muted-foreground">
          Acuvera only charges a success fee when verified savings are realized. No upfront costs,
          no monthly fees.
        </p>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Revenue Impact Summary</p>
            <p className="text-lg font-semibold">Financial performance insights</p>
          </div>
          <div className="grid gap-4 text-sm text-muted-foreground">
            <div className="flex items-center justify-between">
              <span>Gross Savings</span>
              <span className="font-semibold text-foreground">
                {formatCurrency(reportData.grossSavings)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Claims Corrected</span>
              <span className="font-semibold text-foreground">{reportData.claimsCorrected}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Net Revenue Protected</span>
              <span className="font-semibold text-success">
                {formatCurrency(reportData.netRevenueProtected)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Avg. Savings / Claim</span>
              <span className="font-semibold text-foreground">
                {formatCurrency(reportData.avgSavingsPerClaim)}
              </span>
            </div>
          </div>
        </Card>

        <Card className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Operational Metrics</p>
            <p className="text-lg font-semibold">Performance and efficiency tracking</p>
          </div>
          <div className="grid gap-4 text-sm text-muted-foreground">
            <div className="flex items-center justify-between">
              <span>Total Claims Analyzed</span>
              <span className="font-semibold text-foreground">{reportData.claimsProcessed}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>AI Detection Accuracy</span>
              <span className="font-semibold text-foreground">
                {formatPercent(reportData.accuracyRate)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>False Positive Rate</span>
              <span className="font-semibold text-foreground">
                {formatPercent(reportData.falsePositiveRate)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Processing Speed</span>
              <span className="font-semibold text-foreground">
                {reportData.processingSpeed}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
