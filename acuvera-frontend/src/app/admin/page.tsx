"use client";

import { useState } from "react";
import { Protected } from "@/components/layout/protected";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";

export default function AdminPage() {
  const [loading, setLoading] = useState(false);

  async function seedDemo() {
    setLoading(true);
    try {
      const res = await apiFetch<{ success: boolean; data: any }>(
        "/admin/seed-demo",
        { method: "POST" }
      );
      toast.success(res?.data?.message ?? "Demo data seeded.");
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to seed demo data");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Protected roles={["ADMIN"]}>
      <DashboardLayout title="Admin" subtitle="System administration tools">
        <Card className="max-w-lg space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Seed Demo Data
            </h3>
            <p className="mt-1 text-[13px] text-muted-foreground">
              Populate the database with sample bills, findings, and
              organizations for testing.
            </p>
          </div>
          <Button onClick={seedDemo} disabled={loading}>
            {loading ? "Seeding..." : "Seed Demo Data"}
          </Button>
        </Card>
      </DashboardLayout>
    </Protected>
  );
}
