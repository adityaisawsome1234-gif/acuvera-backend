"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, Search } from "lucide-react";
import { Claim, claims } from "@/lib/mockData";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";

const riskOptions = ["All", "High", "Medium", "Low"] as const;
const statusOptions = ["All", "Needs Action", "Pending", "Reviewed"] as const;

function riskClass(risk: Claim["riskLevel"]) {
  if (risk === "High") return "status-high";
  if (risk === "Medium") return "status-medium";
  return "status-low";
}

function statusVariant(status: Claim["status"]) {
  if (status === "Reviewed") return "success";
  if (status === "Needs Action") return "warning";
  return "neutral";
}

export function ClaimsTable() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [risk, setRisk] = useState<(typeof riskOptions)[number]>("All");
  const [status, setStatus] = useState<(typeof statusOptions)[number]>("All");

  const filtered = useMemo(() => {
    return claims.filter((claim) => {
      const matchesQuery =
        !query ||
        claim.id.toLowerCase().includes(query.toLowerCase()) ||
        claim.patientId.toLowerCase().includes(query.toLowerCase());
      const matchesRisk = risk === "All" || claim.riskLevel === risk;
      const matchesStatus = status === "All" || claim.status === status;
      return matchesQuery && matchesRisk && matchesStatus;
    });
  }, [query, risk, status]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex w-full flex-col gap-3 sm:flex-row">
          <div className="relative w-full sm:max-w-xs">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              className="pl-9"
              placeholder="Search by Claim ID or Patient ID"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <select
            className="h-11 rounded-xl border border-border bg-card px-3 text-sm text-foreground"
            value={risk}
            onChange={(event) => setRisk(event.target.value as typeof risk)}
          >
            {riskOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <select
            className="h-11 rounded-xl border border-border bg-card px-3 text-sm text-foreground"
            value={status}
            onChange={(event) => setStatus(event.target.value as typeof status)}
          >
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Claim ID</th>
              <th className="px-4 py-3">Patient</th>
              <th className="px-4 py-3">Payer</th>
              <th className="px-4 py-3">Risk Level</th>
              <th className="px-4 py-3">Errors</th>
              <th className="px-4 py-3">Est. Savings</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((claim) => {
              const errorTone =
                claim.errorCount > 2
                  ? "bg-destructive/10 text-destructive"
                  : claim.errorCount > 0
                    ? "bg-warning/10 text-warning"
                    : "bg-muted text-muted-foreground";

              return (
                <tr
                  key={claim.id}
                  className="table-row-hover border-t border-border"
                  onClick={() => router.push(`/claims/${claim.id}`)}
                >
                  <td className="px-4 py-4 font-medium">{claim.id}</td>
                  <td className="px-4 py-4 text-muted-foreground">{claim.patientId}</td>
                  <td className="px-4 py-4">{claim.payer}</td>
                  <td className="px-4 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${riskClass(claim.riskLevel)}`}>
                      {claim.riskLevel}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${errorTone}`}>
                      {claim.errorCount}
                    </span>
                  </td>
                  <td className="px-4 py-4 font-medium text-success">
                    {formatCurrency(claim.estimatedSavings)}
                  </td>
                  <td className="px-4 py-4">
                    <Badge variant={statusVariant(claim.status)}>{claim.status}</Badge>
                  </td>
                  <td className="px-4 py-4 text-right text-muted-foreground">
                    <ChevronRight size={16} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 ? (
          <div className="border-t border-border p-6 text-center text-sm text-muted-foreground">
            No claims found matching your filters.
          </div>
        ) : null}
      </div>
    </div>
  );
}
