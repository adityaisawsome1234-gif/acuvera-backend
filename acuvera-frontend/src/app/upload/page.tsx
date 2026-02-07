"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, FileText, CheckCircle2 } from "lucide-react";
import { Protected } from "@/components/layout/protected";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
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
  const [dragOver, setDragOver] = useState(false);

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

      toast.success("Bill uploaded! AI analysis has started.");
      router.push(`/claims/${res.data.id}`);
    } catch (err: any) {
      toast.error(err?.message ?? "Upload failed");
    } finally {
      setLoading(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) setFile(dropped);
  }

  return (
    <Protected>
      <DashboardLayout
        title="Upload Bill"
        subtitle="Upload a medical bill for AI-powered analysis"
      >
        <div className="mx-auto max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload size={20} />
                Upload a medical bill
              </CardTitle>
              <CardDescription>
                Upload a PDF file and our AI will analyze it for billing errors, overcharges, and savings opportunities.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleUpload} className="space-y-6 p-6 pt-0">
              {/* Drag and drop zone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 text-center transition ${
                  dragOver
                    ? "border-primary bg-primary/5"
                    : file
                    ? "border-green-500/50 bg-green-500/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                {file ? (
                  <>
                    <CheckCircle2 size={40} className="mb-3 text-green-400" />
                    <p className="text-sm font-medium text-white">{file.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <button
                      type="button"
                      onClick={() => setFile(null)}
                      className="mt-3 text-xs text-red-400 hover:text-red-300"
                    >
                      Remove file
                    </button>
                  </>
                ) : (
                  <>
                    <FileText size={40} className="mb-3 text-muted-foreground" />
                    <p className="text-sm font-medium text-white">
                      Drag and drop your file here
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      or click below to browse
                    </p>
                  </>
                )}
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  className="mt-4 text-sm text-slate-300"
                />
              </div>

              <div className="space-y-2">
                <Label>Description (optional)</Label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[100px] w-full rounded-2xl border border-border bg-secondary/70 p-3 text-sm text-white placeholder:text-muted-foreground"
                  placeholder="Add a note about this bill..."
                />
              </div>

              <Button type="submit" size="lg" className="w-full gap-2" disabled={loading || !file}>
                {loading ? (
                  <>Uploading &amp; analyzing...</>
                ) : (
                  <>
                    <Upload size={16} />
                    Upload &amp; Analyze
                  </>
                )}
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                Supported formats: PDF, PNG, JPG. Max file size: 10MB.
              </p>
            </form>
          </Card>
        </div>
      </DashboardLayout>
    </Protected>
  );
}
