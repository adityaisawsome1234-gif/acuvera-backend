"use client";

import { useState } from "react";
import { Protected } from "@/components/layout/protected";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";

export default function AdminPage() {
  const [loading, setLoading] = useState(false);

  async function seedDemo() {
    setLoading(true);
    try {
      const res = await apiFetch<{ success: boolean; data: any }>("/admin/seed-demo", {
        method: "POST",
      });
      toast.success(res?.data?.message ?? "Demo data seeded.");
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to seed demo data");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Protected roles={["ADMIN"]}>
      <DashboardShell>
        <Card>
          <CardHeader>
            <CardTitle>Admin tools</CardTitle>
            <CardDescription>Seed demo content for testing.</CardDescription>
          </CardHeader>
          <Button onClick={seedDemo} disabled={loading}>
            {loading ? "Seeding..." : "Seed Demo Data"}
          </Button>
        </Card>
      </DashboardShell>
    </Protected>
  );
}
