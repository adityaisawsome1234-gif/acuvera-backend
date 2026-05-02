"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import AppShell from "@/components/layout/AppShell";

export default function OrgPage() {
  const { data: session } = useSession();
  const orgs = session?.orgs ?? [];

  return (
    <AppShell title="Organization">
      <p className="text-sm text-muted-foreground">
        Select an organization to view dashboards, documents, and findings.
      </p>
      <div className="mt-4 space-y-3">
        {orgs.length ? (
          orgs.map((org) => (
            <div key={org.id} className="rounded-xl border bg-muted p-4 text-sm">
              <p>{org.name}</p>
              <p className="text-muted-foreground">Org ID: {org.id}</p>
              <Link
                className="mt-3 inline-flex rounded-md bg-primary px-3 py-2 text-xs text-primary-foreground"
                href={`/org/${org.id}/dashboard`}
              >
                Go to Dashboard
              </Link>
            </div>
          ))
        ) : (
          <div className="rounded-xl border bg-muted p-4 text-sm">
            <p>No organizations available.</p>
            <p className="text-muted-foreground">
              Contact your admin or create a new account.
            </p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
