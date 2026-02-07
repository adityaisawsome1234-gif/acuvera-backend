"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Protected } from "@/components/layout/protected";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import { StandardResponse, BillDetail } from "@/lib/types";
import { toast } from "sonner";

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      toast.error("Please choose a file to upload.");
      return;
    }
    setLoading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      if (description) {
        form.append("description", description);
      }

      const res = await apiFetch<StandardResponse<BillDetail>>("/bills/upload", {
        method: "POST",
        body: form,
      });

      toast.success("Bill uploaded successfully.");
      router.push(`/bills/${res.data.id}`);
    } catch (err: any) {
      toast.error(err?.message ?? "Upload failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Protected>
      <DashboardShell>
        <Card>
          <CardHeader>
            <CardTitle>Upload a medical bill</CardTitle>
            <CardDescription>PDF or image files supported.</CardDescription>
          </CardHeader>
          <form onSubmit={handleUpload} className="space-y-4">
            <div className="space-y-2">
              <Label>Bill file</Label>
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="w-full rounded-2xl border border-border bg-secondary/70 p-3 text-sm text-slate-300"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Description (optional)</Label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[120px] w-full rounded-2xl border border-border bg-secondary/70 p-3 text-sm text-white"
                placeholder="Add a note for your team..."
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? "Uploading..." : "Upload bill"}
            </Button>
          </form>
        </Card>
      </DashboardShell>
    </Protected>
  );
}
