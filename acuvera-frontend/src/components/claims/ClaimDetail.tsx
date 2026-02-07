"use client";

import { AlertCircle, AlertTriangle, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Claim } from "@/lib/mockData";
import { formatCurrency, formatDate } from "@/lib/utils";

const severityStyles = {
  High: "border-destructive/60",
  Medium: "border-warning/60",
  Low: "border-success/60",
};

const severityIcon = {
  High: AlertTriangle,
  Medium: AlertCircle,
  Low: Info,
};

export function ClaimDetail({ claim }: { claim: Claim }) {
  const riskClass =
    claim.riskLevel === "High"
      ? "status-high"
      : claim.riskLevel === "Medium"
        ? "status-medium"
        : "status-low";

  return (
    <div className="space-y-6">
      <Card className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Claim ID</p>
            <p className="text-2xl font-semibold">{claim.id}</p>
            <p className="text-sm text-muted-foreground">
              Submitted {formatDate(claim.submissionDate)}
            </p>
          </div>
        <Badge className={`rounded-full px-4 py-2 text-sm font-semibold ${riskClass}`}>
            {claim.riskLevel} Risk
          </Badge>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <div>
            <p className="text-xs text-muted-foreground">Patient ID</p>
            <p className="font-medium">{claim.patientId}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Payer</p>
            <p className="font-medium">{claim.payer}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Procedure Code</p>
            <p className="font-medium">{claim.procedureCode}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total Amount</p>
            <p className="font-medium">{formatCurrency(claim.totalAmount)}</p>
          </div>
        </div>

        <div className="border-t border-border pt-4">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Estimated Revenue Protection</p>
              <p className="text-3xl font-bold text-success">
                {formatCurrency(claim.estimatedSavings)}
              </p>
            </div>
            <div className="text-sm text-muted-foreground">
              Issues Detected: <span className="font-semibold text-foreground">{claim.errorCount}</span>
            </div>
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">AI-Flagged Issues</h2>
        {claim.issues.length === 0 ? (
          <Card className="text-sm text-muted-foreground">
            No issues detected for this claim.
          </Card>
        ) : (
          claim.issues.map((issue) => {
            const Icon = severityIcon[issue.severity];
            const issueSeverityClass =
              issue.severity === "High"
                ? "status-high"
                : issue.severity === "Medium"
                  ? "status-medium"
                  : "status-low";
            return (
              <Card
                key={issue.id}
                className={`border-l-4 ${severityStyles[issue.severity]}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Icon size={18} className="text-muted-foreground" />
                      <h3 className="font-semibold">{issue.errorType}</h3>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span className={`rounded-full px-3 py-1 ${issueSeverityClass}`}>
                        {issue.severity} Severity
                      </span>
                      <span>
                        Confidence: {(issue.confidenceScore * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                  <div className="text-right text-sm text-success">
                    <p className="text-xs text-muted-foreground">Est. Savings</p>
                    <p className="text-lg font-semibold">
                      {formatCurrency(issue.estimatedSavings)}
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">{issue.explanation}</p>
                <div className="mt-4 rounded-xl bg-muted p-4 text-sm">
                  <p className="text-xs font-semibold uppercase text-muted-foreground">
                    Recommended Action
                  </p>
                  <p className="mt-1 text-sm">{issue.recommendedAction}</p>
                </div>
              </Card>
            );
          })
        )}
      </div>

      <Card className="bg-gradient-to-r from-primary/5 to-success/5 text-sm text-muted-foreground">
        <p className="font-semibold text-foreground">Success-Based Partnership</p>
        <p>
          Acuvera only earns a fee when verified savings are captured. Your team stays in control
          of every submission.
        </p>
      </Card>
    </div>
  );
}
