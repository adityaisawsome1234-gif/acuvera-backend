"use client";

import AppShell from "@/components/layout/AppShell";

type CaseDetailProps = {
  params: { caseId: string };
};

export default function CaseDetailPage({ params }: CaseDetailProps) {
  return (
    <AppShell title={`Case · ${params.caseId}`}>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2 rounded-xl border bg-muted/40 p-4 text-sm">
          <p className="font-semibold">Status</p>
          <select className="w-full rounded-md border bg-background px-3 py-2">
            <option>Open</option>
            <option>In review</option>
            <option>Closed</option>
          </select>
        </div>
        <div className="space-y-2 rounded-xl border bg-muted/40 p-4 text-sm">
          <p className="font-semibold">Assignee</p>
          <input
            placeholder="Assign to user"
            className="w-full rounded-md border bg-background px-3 py-2"
          />
        </div>
        <div className="space-y-2 rounded-xl border bg-muted/40 p-4 text-sm">
          <p className="font-semibold">Priority</p>
          <select className="w-full rounded-md border bg-background px-3 py-2">
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>
      </div>
      <div className="mt-6 space-y-3">
        <h2 className="text-lg font-semibold">Comments</h2>
        <div className="space-y-2 rounded-xl border bg-muted/40 p-4 text-sm">
          <p className="text-muted-foreground">No comments yet.</p>
          <div className="h-8 w-full rounded bg-muted/60" />
        </div>
        <div className="flex flex-col gap-2">
          <textarea
            rows={3}
            placeholder="Add a comment for the activity log"
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          />
          <button className="self-start rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground">
            Add comment
          </button>
        </div>
      </div>
    </AppShell>
  );
}
