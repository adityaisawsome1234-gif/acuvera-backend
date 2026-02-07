"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Flag, FileDown, CheckCircle, Loader2 } from "lucide-react";
import { Protected } from "@/components/layout/protected";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ClaimDetail } from "@/components/claims/ClaimDetail";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { apiFetch } from "@/lib/api";
import { claims, Claim } from "@/lib/mockData";
import { formatCurrency } from "@/lib/utils";

type ApiBill = {
  id: number;
  file_name: string;
  status: string;
  total_amount?: number;
  uploaded_at?: string;
  analyzed_at?: string;
  line_items?: Array<{
    id: number;
    description: string;
    code?: string;
    quantity: number;
    unit_price: number;
    total_price: number;
  }>;
  findings?: Array<{
    id: number;
    type: string;
    severity: string;
    confidence: number;
    estimated_savings: number;
    explanation: string;
    recommended_action: string;
  }>;
};

function mapSeverity(s: string): "High" | "Medium" | "Low" {
  if (s === "CRITICAL" || s === "HIGH") return "High";
  if (s === "MEDIUM") return "Medium";
  return "Low";
}

function apiBillToClaim(bill: ApiBill): Claim {
  const riskLevel: "High" | "Medium" | "Low" = bill.findings?.some(
    (f) => f.severity === "CRITICAL" || f.severity === "HIGH"
  )
    ? "High"
    : bill.findings?.some((f) => f.severity === "MEDIUM")
      ? "Medium"
      : "Low";

  const totalSavings =
    bill.findings?.reduce((sum, f) => sum + f.estimated_savings, 0) ?? 0;

  return {
    id: String(bill.id),
    claimNumber: `BILL-${bill.id}`,
    patientName: "Patient",
    provider: "Provider",
    dateSubmitted: bill.uploaded_at ?? new Date().toISOString(),
    submissionDate: bill.uploaded_at ?? new Date().toISOString(),
    amount: bill.total_amount ?? 0,
    totalAmount: bill.total_amount ?? 0,
    status: bill.status === "COMPLETED"
      ? "Reviewed"
      : bill.status === "FAILED"
        ? "Needs Action"
        : "Pending",
    riskLevel,
    errorsFound: bill.findings?.length ?? 0,
    errorCount: bill.findings?.length ?? 0,
    estimatedSavings: totalSavings,
    category: "Medical Bill",
    patientId: `PAT-${bill.id}`,
    payer: "Insurance Provider",
    procedureCode: bill.line_items?.[0]?.code ?? "N/A",
    issues: (bill.findings ?? []).map((f) => ({
      id: String(f.id),
      errorType: f.type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      severity: mapSeverity(f.severity),
      confidenceScore: f.confidence,
      estimatedSavings: f.estimated_savings,
      explanation: f.explanation,
      recommendedAction: f.recommended_action,
    })),
  };
}

export default function ClaimDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [claim, setClaim] = useState<Claim | null>(null);
  const [loading, setLoading] = useState(true);
  const [polling, setPolling] = useState(false);

  useEffect(() => {
    async function loadClaim() {
      // Try API first (numeric IDs are real bills)
      const isNumeric = /^\d+$/.test(id);
      if (isNumeric) {
        try {
          const res = await apiFetch<{ success: boolean; data: ApiBill }>(
            `/bills/${id}`
          );
          const converted = apiBillToClaim(res.data);
          setClaim(converted);
          setLoading(false);

          // If still processing, poll every 5 seconds
          if (res.data.status === "PROCESSING" || res.data.status === "PENDING") {
            setPolling(true);
          } else {
            setPolling(false);
          }
          return;
        } catch {
          // Fall through to mock data
        }
      }

      // Fall back to mock data
      const mockClaim = claims.find((item) => item.id === id);
      setClaim(mockClaim ?? null);
      setLoading(false);
    }

    loadClaim();
  }, [id]);

  // Poll for analysis completion
  useEffect(() => {
    if (!polling) return;
    const interval = setInterval(async () => {
      try {
        const res = await apiFetch<{ success: boolean; data: ApiBill }>(
          `/bills/${id}`
        );
        const converted = apiBillToClaim(res.data);
        setClaim(converted);
        if (res.data.status !== "PROCESSING" && res.data.status !== "PENDING") {
          setPolling(false);
        }
      } catch {
        setPolling(false);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [polling, id]);

  return (
    <Protected>
      <DashboardLayout
        title="Claim Detail"
        subtitle={claim ? `Review AI findings for ${claim.id}` : "Loading..."}
        actions={
          <>
            <Button variant="ghost" asChild>
              <Link href="/claims">
                <ArrowLeft size={16} /> Back to Claims
              </Link>
            </Button>
            <Button variant="outline">
              <Flag size={16} /> Flag for Follow-up
            </Button>
            <Button variant="outline">
              <FileDown size={16} /> Export Notes
            </Button>
            <Button>
              <CheckCircle size={16} /> Mark as Reviewed
            </Button>
          </>
        }
      >
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-48" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
        ) : polling ? (
          <Card className="flex flex-col items-center justify-center py-16 text-center">
            <Loader2 size={48} className="mb-4 animate-spin text-primary" />
            <h3 className="text-lg font-semibold text-white">AI Analysis in Progress</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Our AI is analyzing your medical bill for errors and savings opportunities.
              <br />
              This usually takes 10-30 seconds. This page will update automatically.
            </p>
          </Card>
        ) : claim ? (
          <ClaimDetail claim={claim} />
        ) : (
          <Card className="py-16 text-center">
            <p className="text-muted-foreground">Claim not found.</p>
            <Link href="/claims" className="mt-4 inline-block text-primary hover:underline">
              Back to Claims Review
            </Link>
          </Card>
        )}
      </DashboardLayout>
    </Protected>
  );
}
