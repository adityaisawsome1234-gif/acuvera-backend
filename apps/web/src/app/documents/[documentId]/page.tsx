"use client";

import { useState } from "react";
import AppShell from "@/components/layout/AppShell";

const tabs = ["Findings", "Extraction JSON", "Activity"] as const;

type DocumentDetailProps = {
  params: { documentId: string };
};

export default function DocumentDetailPage({ params }: DocumentDetailProps) {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Findings");

  return (
    <AppShell title={`Document · ${params.documentId}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">
            Status: <span className="status-medium rounded-full px-2 py-1">Processing</span>
          </p>
          <p className="text-xs text-muted-foreground">Uploaded 2 hours ago</p>
        </div>
        <button className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground">
          Process document
        </button>
      </div>
      <div className="mt-6 flex flex-wrap gap-2 text-sm">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-md px-3 py-2 ${
              activeTab === tab ? "bg-muted" : "border"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="mt-4 rounded-xl border bg-muted/40 p-4 text-sm">
        {activeTab === "Findings" && (
          <div className="space-y-3">
            <p className="text-muted-foreground">No findings available yet.</p>
            <div className="h-8 w-full rounded bg-muted/60" />
            <div className="h-8 w-full rounded bg-muted/60" />
          </div>
        )}
        {activeTab === "Extraction JSON" && (
          <pre className="whitespace-pre-wrap text-xs text-muted-foreground">
            {`{
  "patient_name": "Jane Doe",
  "total_amount": 3120.5,
  "confidence": 0.91
}`}
          </pre>
        )}
        {activeTab === "Activity" && (
          <ul className="space-y-2 text-muted-foreground">
            <li>Queued for processing.</li>
            <li>Extraction started.</li>
            <li>Audit findings generated.</li>
          </ul>
        )}
      </div>
    </AppShell>
  );
}
