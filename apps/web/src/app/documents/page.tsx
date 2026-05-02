"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import posthog from "posthog-js";
import AppShell from "@/components/layout/AppShell";

type DocumentItem = {
  id: string;
  name: string;
  status: string;
  uploaded_at: string;
  case_id?: string;
};

type CaseItem = {
  id: string;
  title: string;
};

type UploadState = {
  name: string;
  progress: number;
  status: "pending" | "uploading" | "done" | "error";
};

export default function DocumentsPage() {
  const { data: session } = useSession();
  const orgId = session?.orgs?.[0]?.id;
  const token = session?.accessToken;

  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [uploads, setUploads] = useState<Record<string, UploadState>>({});
  const [caseId, setCaseId] = useState("");
  const [caseTitle, setCaseTitle] = useState("");

  const canUpload = Boolean(orgId && token);

  const fetchData = async () => {
    if (!orgId || !token) return;
    const [docsRes, casesRes] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/orgs/${orgId}/documents`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/orgs/${orgId}/cases`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);
    if (docsRes.ok) {
      setDocuments(await docsRes.json());
    }
    if (casesRes.ok) {
      setCases(await casesRes.json());
    }
  };

  useEffect(() => {
    fetchData();
  }, [orgId, token]);

  const handleFiles = (files: FileList | null) => {
    if (!files || !orgId || !token) return;
    Array.from(files).forEach((file) => uploadFile(file));
  };

  const uploadFile = (file: File) => {
    if (!orgId || !token) return;
    const id = `${file.name}-${Date.now()}`;
    setUploads((prev) => ({
      ...prev,
      [id]: { name: file.name, progress: 0, status: "pending" },
    }));

    const data = new FormData();
    data.append("file", file);
    if (caseId) {
      data.append("case_id", caseId);
    } else if (caseTitle) {
      data.append("case_title", caseTitle);
    }

    const xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/orgs/${orgId}/documents/upload`
    );
    xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable) return;
      const progress = Math.round((event.loaded / event.total) * 100);
      setUploads((prev) => ({
        ...prev,
        [id]: { ...prev[id], progress, status: "uploading" },
      }));
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        posthog.capture("document_uploaded", { file_type: file.type || "unknown" });
        setUploads((prev) => ({
          ...prev,
          [id]: { ...prev[id], progress: 100, status: "done" },
        }));
        fetchData();
      } else {
        setUploads((prev) => ({
          ...prev,
          [id]: { ...prev[id], status: "error" },
        }));
      }
    };
    xhr.onerror = () => {
      setUploads((prev) => ({
        ...prev,
        [id]: { ...prev[id], status: "error" },
      }));
    };
    xhr.send(data);
  };

  const uploadItems = useMemo(() => Object.values(uploads), [uploads]);

  return (
    <AppShell title="Documents">
      <p className="text-sm text-muted-foreground">
        Track documents uploaded for extraction and audit.
      </p>
      <div className="mt-6 space-y-6">
        <div className="rounded-xl border bg-muted/40 p-4">
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <input
              type="file"
              multiple
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={(event) => handleFiles(event.target.files)}
              disabled={!canUpload}
            />
            <select
              className="rounded-md border bg-background px-3 py-2"
              value={caseId}
              onChange={(event) => setCaseId(event.target.value)}
            >
              <option value="">Create new case</option>
              {cases.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
            {!caseId ? (
              <input
                placeholder="New case title"
                className="rounded-md border bg-background px-3 py-2"
                value={caseTitle}
                onChange={(event) => setCaseTitle(event.target.value)}
              />
            ) : null}
          </div>
          <div
            className="mt-4 flex h-28 items-center justify-center rounded-lg border-2 border-dashed text-sm text-muted-foreground"
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              handleFiles(event.dataTransfer.files);
            }}
          >
            Drag and drop files here
          </div>
          {uploadItems.length ? (
            <div className="mt-4 space-y-2 text-xs text-muted-foreground">
              {uploadItems.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <span>{item.name}</span>
                  <span>{item.status === "error" ? "Failed" : `${item.progress}%`}</span>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm">
          <input
            placeholder="Search documents"
            className="w-full rounded-md border bg-background px-3 py-2 md:w-64"
          />
          <select className="rounded-md border bg-background px-3 py-2">
            <option>All status</option>
            <option>Uploaded</option>
            <option>Processing</option>
            <option>Completed</option>
            <option>Failed</option>
          </select>
          <button className="rounded-md border bg-background px-3 py-2">
            Bulk actions
          </button>
        </div>
        <div className="overflow-hidden rounded-xl border">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Document</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Uploaded</th>
                <th className="px-4 py-3">Case</th>
              </tr>
            </thead>
            <tbody>
              {documents.length ? (
                documents.map((doc) => (
                  <tr key={doc.id} className="table-row-hover">
                    <td className="px-4 py-3">{doc.name}</td>
                    <td className="px-4 py-3">{doc.status}</td>
                    <td className="px-4 py-3">
                      {new Date(doc.uploaded_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">{doc.case_id ?? "--"}</td>
                  </tr>
                ))
              ) : (
                <tr className="table-row-hover">
                  <td className="px-4 py-3">No documents yet</td>
                  <td className="px-4 py-3 text-muted-foreground">--</td>
                  <td className="px-4 py-3 text-muted-foreground">--</td>
                  <td className="px-4 py-3 text-muted-foreground">--</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
