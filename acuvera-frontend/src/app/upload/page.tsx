"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { Protected } from "@/components/layout/protected";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import { StandardResponse, BillDetail } from "@/lib/types";
import { toast } from "sonner";

const MAX_SIZE_MB = 10;

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  function validateFile(f: File): boolean {
    const validTypes = [
      "application/pdf",
      "image/png",
      "image/jpeg",
      "image/jpg",
    ];
    if (!validTypes.includes(f.type)) {
      toast.error("Please upload a PDF, PNG, or JPG file.");
      return false;
    }
    if (f.size > MAX_SIZE_MB * 1024 * 1024) {
      toast.error(`File size must be under ${MAX_SIZE_MB}MB.`);
      return false;
    }
    return true;
  }

  function handleFileSelect(f: File | null) {
    if (f && validateFile(f)) {
      setFile(f);
    }
  }

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
      if (description.trim()) {
        form.append("description", description.trim());
      }

      const res = await apiFetch<StandardResponse<BillDetail>>(
        "/bills/upload",
        {
          method: "POST",
          body: form,
        }
      );

      toast.success("Bill uploaded! AI analysis has started.");
      router.push(`/claims/${res.data.id}`);
    } catch (err: any) {
      toast.error(err?.message ?? "Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) handleFileSelect(dropped);
  }

  return (
    <Protected>
      <DashboardLayout
        title="Upload Bill"
        subtitle="Upload a medical bill for AI-powered analysis"
      >
        <div className="mx-auto max-w-xl">
          <Card className="p-0">
            <div className="border-b border-border px-6 py-5">
              <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
                <Upload size={18} className="text-primary" />
                Upload a medical bill
              </h2>
              <p className="mt-1 text-[13px] text-muted-foreground">
                Upload a PDF and our AI will detect errors, overcharges, and
                savings opportunities.
              </p>
            </div>

            <form onSubmit={handleUpload} className="space-y-5 p-6">
              {/* Drop zone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() =>
                  document.getElementById("file-input")?.click()
                }
                className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 text-center transition-all duration-200 ${
                  dragOver
                    ? "border-primary bg-primary/5"
                    : file
                      ? "border-success/40 bg-success/5"
                      : "border-border hover:border-primary/40 hover:bg-muted/30"
                }`}
              >
                {file ? (
                  <>
                    <CheckCircle2
                      size={36}
                      className="mb-3 text-success"
                    />
                    <p className="text-[13px] font-medium text-foreground">
                      {file.name}
                    </p>
                    <p className="mt-0.5 text-[12px] text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                      }}
                      className="mt-3 text-[12px] font-medium text-destructive hover:underline"
                    >
                      Remove file
                    </button>
                  </>
                ) : (
                  <>
                    <FileText
                      size={36}
                      className="mb-3 text-muted-foreground"
                    />
                    <p className="text-[13px] font-medium text-foreground">
                      Drag and drop your file here
                    </p>
                    <p className="mt-0.5 text-[12px] text-muted-foreground">
                      or click to browse
                    </p>
                    <p className="mt-3 text-[11px] text-muted-foreground">
                      PDF, PNG, JPG up to {MAX_SIZE_MB}MB
                    </p>
                  </>
                )}
                <input
                  id="file-input"
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={(e) =>
                    handleFileSelect(e.target.files?.[0] ?? null)
                  }
                  className="hidden"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-foreground">
                  Notes{" "}
                  <span className="text-muted-foreground">(optional)</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[80px] w-full resize-none rounded-xl border border-border bg-background p-3 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/60"
                  placeholder="Add a note about this bill..."
                />
              </div>

              {/* Submit */}
              <Button
                type="submit"
                size="lg"
                className="w-full gap-2"
                disabled={loading || !file}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Uploading &amp; analyzing...
                  </span>
                ) : (
                  <>
                    <Upload size={15} />
                    Upload &amp; Analyze
                  </>
                )}
              </Button>

              {/* Info banner */}
              <div className="flex items-start gap-3 rounded-xl bg-muted/50 p-4">
                <AlertCircle
                  size={16}
                  className="mt-0.5 shrink-0 text-muted-foreground"
                />
                <p className="text-[12px] leading-relaxed text-muted-foreground">
                  Your file is processed securely. AI analysis typically
                  completes in 10-30 seconds. You&apos;ll be redirected to
                  the results page automatically.
                </p>
              </div>
            </form>
          </Card>
        </div>
      </DashboardLayout>
    </Protected>
  );
}
