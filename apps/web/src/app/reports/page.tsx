import AppShell from "@/components/layout/AppShell";

export default function ReportsPage() {
  return (
    <AppShell title="Reports">
      <p className="text-sm text-muted-foreground">
        Generate executive summaries, savings trends, and compliance reports.
      </p>
      <div className="mt-6 space-y-4">
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <input
            placeholder="Search reports"
            className="w-full rounded-md border bg-background px-3 py-2 md:w-64"
          />
          <button className="rounded-md border bg-background px-3 py-2">
            Export
          </button>
        </div>
        <div className="overflow-hidden rounded-xl border">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Report</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3">Owner</th>
              </tr>
            </thead>
            <tbody>
              <tr className="table-row-hover">
                <td className="px-4 py-3">No reports generated</td>
                <td className="px-4 py-3 text-muted-foreground">--</td>
                <td className="px-4 py-3 text-muted-foreground">--</td>
              </tr>
              <tr className="table-row-hover">
                <td className="px-4 py-3" colSpan={3}>
                  <div className="h-8 w-full rounded bg-muted/60" />
                </td>
              </tr>
              <tr className="table-row-hover">
                <td className="px-4 py-3" colSpan={3}>
                  <div className="h-8 w-full rounded bg-muted/60" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground">
          Reports become available after scheduled analysis jobs.
        </p>
      </div>
    </AppShell>
  );
}
