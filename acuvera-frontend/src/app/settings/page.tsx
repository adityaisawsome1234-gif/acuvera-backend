"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { SettingsForm } from "@/components/settings/SettingsForm";

export default function SettingsPage() {
  return (
    <DashboardLayout title="Settings" subtitle="Organization, alerts, and billing preferences">
      <SettingsForm />
    </DashboardLayout>
  );
}
