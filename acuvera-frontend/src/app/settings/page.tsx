"use client";

import { Protected } from "@/components/layout/protected";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { SettingsForm } from "@/components/settings/SettingsForm";

export default function SettingsPage() {
  return (
    <Protected>
      <DashboardLayout title="Settings" subtitle="Organization, alerts, and billing preferences">
        <SettingsForm />
      </DashboardLayout>
    </Protected>
  );
}
