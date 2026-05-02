import AppShell from "@/components/layout/AppShell";

export default function AuditLogPage() {
  return (
    <AppShell title="Audit Log">
      <p className="text-sm text-muted-foreground">
        Monitor activity, processing events, and compliance actions.
      </p>
      <div className="mt-4 rounded-xl border bg-muted p-4 text-sm">
        <p>No audit activity yet.</p>
        <p className="text-muted-foreground">
          Processing jobs and user actions will appear here.
        </p>
      </div>
    </AppShell>
  );
}
