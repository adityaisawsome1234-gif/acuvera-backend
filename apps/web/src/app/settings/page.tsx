"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import AppShell from "@/components/layout/AppShell";

type OrgInfo = { id: string; name: string; join_code?: string };

export default function SettingsPage() {
  const { data: session } = useSession();
  const orgId = session?.orgs?.[0]?.id;
  const token = session?.accessToken;
  const [org, setOrg] = useState<OrgInfo | null>(null);
  const [retentionDays, setRetentionDays] = useState(365);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!orgId || !token) return;
    const fetchSettings = async () => {
      const [orgRes, retentionRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/orgs`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/orgs/${orgId}/retention`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      if (orgRes.ok) {
        const orgs = await orgRes.json();
        const current = orgs.find((o: OrgInfo) => o.id === orgId);
        setOrg(current);
      }
      if (retentionRes.ok) {
        const data = await retentionRes.json();
        setRetentionDays(data.document_retention_days);
      }
    };
    fetchSettings();
  }, [orgId, token]);

  const handleSave = async () => {
    if (!orgId || !token) return;
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/orgs/${orgId}/retention`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ document_retention_days: retentionDays }),
      }
    );
    setStatus(response.ok ? "Saved retention settings." : "Failed to save.");
  };

  return (
    <AppShell title="Settings">
      <p className="text-sm text-muted-foreground">
        Configure retention policies, user roles, and integrations.
      </p>
      <div className="mt-6 space-y-4 rounded-xl border bg-muted/40 p-4 text-sm">
        <div>
          <p className="font-semibold">Organization</p>
          <p className="text-muted-foreground">{org?.name ?? "Unknown org"}</p>
          {org?.join_code ? (
            <p className="text-xs text-muted-foreground">
              Join code: {org.join_code}
            </p>
          ) : null}
        </div>
        <div>
          <label className="block text-sm">
            Document retention (days)
            <input
              type="number"
              min={30}
              value={retentionDays}
              onChange={(event) => setRetentionDays(Number(event.target.value))}
              className="mt-1 w-40 rounded-md border bg-background px-3 py-2"
            />
          </label>
          <button
            onClick={handleSave}
            className="mt-3 rounded-md bg-primary px-4 py-2 text-xs text-primary-foreground"
          >
            Save settings
          </button>
          {status ? <p className="mt-2 text-xs text-muted-foreground">{status}</p> : null}
        </div>
      </div>
    </AppShell>
  );
}
