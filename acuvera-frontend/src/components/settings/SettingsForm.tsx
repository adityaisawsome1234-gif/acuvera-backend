"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { notificationSettings, organizationSettings } from "@/lib/mockData";

export function SettingsForm() {
  const [notifications, setNotifications] = useState(notificationSettings);
  const [alertThreshold, setAlertThreshold] = useState(notificationSettings.alertThreshold);

  return (
    <div className="space-y-6">
      <Card className="space-y-6">
        <h2 className="text-lg font-semibold">Organization Information</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Organization Name</Label>
            <Input defaultValue={organizationSettings.name} />
          </div>
          <div className="space-y-2">
            <Label>NPI Number</Label>
            <Input defaultValue={organizationSettings.npi} />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Address</Label>
          <Textarea defaultValue={organizationSettings.address} />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label>City</Label>
            <Input defaultValue={organizationSettings.city} />
          </div>
          <div className="space-y-2">
            <Label>State</Label>
            <Input defaultValue={organizationSettings.state} />
          </div>
          <div className="space-y-2">
            <Label>ZIP</Label>
            <Input defaultValue={organizationSettings.zip} />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Billing Contact</Label>
            <Input defaultValue={organizationSettings.billingContact} />
          </div>
          <div className="space-y-2">
            <Label>Billing Email</Label>
            <Input defaultValue={organizationSettings.billingEmail} />
          </div>
        </div>
      </Card>

      <Card className="space-y-6">
        <h2 className="text-lg font-semibold">Notification Preferences</h2>
        <div className="space-y-4">
          {[
            { key: "emailAlerts", label: "Email Alerts" },
            { key: "highRiskAlerts", label: "High-Risk Claim Alerts" },
            { key: "dailyDigest", label: "Daily Digest" },
            { key: "weeklyReport", label: "Weekly Report" },
          ].map((item) => (
            <label key={item.key} className="flex items-center justify-between">
              <span className="text-sm">{item.label}</span>
              <input
                type="checkbox"
                checked={notifications[item.key as keyof typeof notifications] as boolean}
                onChange={(event) =>
                  setNotifications((prev) => ({
                    ...prev,
                    [item.key]: event.target.checked,
                  }))
                }
                className="h-5 w-5 rounded border border-border accent-primary"
              />
            </label>
          ))}
          <div className="space-y-2">
            <Label>Alert Threshold</Label>
            <select
              className="h-11 w-full rounded-xl border border-border bg-card px-3 text-sm text-foreground"
              value={alertThreshold}
              onChange={(event) => setAlertThreshold(event.target.value)}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High Only</option>
            </select>
          </div>
        </div>
      </Card>

      <Card className="space-y-4 bg-gradient-to-r from-primary/5 to-success/5">
        <h2 className="text-lg font-semibold">Success-Fee Partnership</h2>
        <div className="grid gap-3 text-sm text-muted-foreground md:grid-cols-2">
          <div>
            <p className="text-xs uppercase text-muted-foreground">Billing Model</p>
            <p className="font-semibold text-foreground">Success-Based Fee</p>
          </div>
          <div>
            <p className="text-xs uppercase text-muted-foreground">Fee Structure</p>
            <p className="font-semibold text-foreground">Percentage of Realized Savings</p>
          </div>
          <div>
            <p className="text-xs uppercase text-muted-foreground">Partnership Status</p>
            <p className="font-semibold text-success">Active</p>
          </div>
          <div>
            <p className="text-xs uppercase text-muted-foreground">Next Invoice</p>
            <p className="font-semibold text-foreground">End of Quarter</p>
          </div>
        </div>
        <div className="rounded-xl bg-muted p-4 text-sm text-muted-foreground">
          Acuvera invoices only after savings are verified. Your success team will confirm every
          claim adjustment before submission.
        </div>
      </Card>

      <div className="flex justify-end">
        <Button>Save Changes</Button>
      </div>
    </div>
  );
}
