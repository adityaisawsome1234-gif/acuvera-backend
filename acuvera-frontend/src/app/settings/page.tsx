"use client";

import { useState } from "react";
import { Protected } from "@/components/layout/protected";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export default function SettingsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    highRiskAlerts: true,
    weeklyReport: true,
  });

  function handleSave() {
    toast.success("Settings saved.");
  }

  return (
    <Protected>
      <DashboardLayout
        title="Settings"
        subtitle="Account and notification preferences"
      >
        <div className="max-w-2xl space-y-6">
          {/* Account Info */}
          <Card className="space-y-5">
            <h2 className="text-sm font-semibold text-foreground">
              Account Information
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-[12px] text-muted-foreground">
                  Full Name
                </Label>
                <Input defaultValue={user?.full_name ?? ""} readOnly />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[12px] text-muted-foreground">
                  Email
                </Label>
                <Input defaultValue={user?.email ?? ""} readOnly />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[12px] text-muted-foreground">
                  Role
                </Label>
                <Input
                  defaultValue={
                    user?.role
                      ? user.role.charAt(0) + user.role.slice(1).toLowerCase()
                      : ""
                  }
                  readOnly
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[12px] text-muted-foreground">
                  Account ID
                </Label>
                <Input defaultValue={user?.id ? `#${user.id}` : ""} readOnly />
              </div>
            </div>
          </Card>

          {/* Notifications */}
          <Card className="space-y-5">
            <h2 className="text-sm font-semibold text-foreground">
              Notification Preferences
            </h2>
            <div className="space-y-3">
              {[
                {
                  key: "emailAlerts" as const,
                  label: "Email Alerts",
                  desc: "Receive email notifications for new analysis results",
                },
                {
                  key: "highRiskAlerts" as const,
                  label: "High-Risk Alerts",
                  desc: "Get notified immediately for high-severity findings",
                },
                {
                  key: "weeklyReport" as const,
                  label: "Weekly Report",
                  desc: "Receive a weekly summary of all analyzed bills",
                },
              ].map((item) => (
                <label
                  key={item.key}
                  className="flex items-center justify-between rounded-lg border border-border px-4 py-3 transition-colors duration-150 hover:bg-muted/30"
                >
                  <div>
                    <p className="text-[13px] font-medium text-foreground">
                      {item.label}
                    </p>
                    <p className="text-[12px] text-muted-foreground">
                      {item.desc}
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications[item.key]}
                    onChange={(e) =>
                      setNotifications((prev) => ({
                        ...prev,
                        [item.key]: e.target.checked,
                      }))
                    }
                    className="h-4 w-4 rounded border-border accent-primary"
                  />
                </label>
              ))}
            </div>
          </Card>

          {/* Partnership */}
          <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
            <p className="text-sm font-semibold text-foreground">
              Success-Based Partnership
            </p>
            <p className="mt-1 text-[13px] text-muted-foreground">
              Acuvera only charges a fee when verified savings are captured.
              No upfront costs. Your team controls every submission.
            </p>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </div>
      </DashboardLayout>
    </Protected>
  );
}
