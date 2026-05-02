import AppShell from "@/components/layout/AppShell";

export default function CasesPage() {
  return (
    <AppShell title="Cases">
      <p className="text-sm text-muted-foreground">
        Track audit cases, assignments, and remediation steps.
      </p>
      <div className="mt-6 space-y-4">
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <input
            placeholder="Search cases"
            className="w-full rounded-md border bg-background px-3 py-2 md:w-64"
          />
          <select className="rounded-md border bg-background px-3 py-2">
            <option>All status</option>
            <option>Open</option>
            <option>In review</option>
            <option>Closed</option>
          </select>
          <button className="rounded-md border bg-background px-3 py-2">
            Bulk actions
          </button>
        </div>
        <div className="overflow-hidden rounded-xl border">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Case</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Owner</th>
                <th className="px-4 py-3">Updated</th>
              </tr>
            </thead>
            <tbody>
              <tr className="table-row-hover">
                <td className="px-4 py-3">No cases yet</td>
                <td className="px-4 py-3 text-muted-foreground">--</td>
                <td className="px-4 py-3 text-muted-foreground">--</td>
                <td className="px-4 py-3 text-muted-foreground">--</td>
              </tr>
              <tr className="table-row-hover">
                <td className="px-4 py-3" colSpan={4}>
                  <div className="h-8 w-full rounded bg-muted/60" />
                </td>
              </tr>
              <tr className="table-row-hover">
                <td className="px-4 py-3" colSpan={4}>
                  <div className="h-8 w-full rounded bg-muted/60" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground">
          Cases are created from high-risk findings.
        </p>
      </div>
    </AppShell>
  );
}
