export type DocumentStatus = "uploaded" | "processing" | "completed" | "failed";
export type FindingSeverity = "low" | "medium" | "high" | "critical";
export type FindingCategory =
  | "coding"
  | "coverage"
  | "billing"
  | "policy"
  | "clinical"
  | "duplicate"
  | "compliance"
  | "other";
export type CaseStatus = "open" | "in_review" | "closed";
export type CasePriority = "low" | "medium" | "high";

export type OrganizationSummary = {
  id: string;
  name: string;
};

export type DocumentSummary = {
  id: string;
  orgId: string;
  name: string;
  status: DocumentStatus;
  uploadedAt: string;
};

export type AuditFinding = {
  id: string;
  documentId: string;
  category: FindingCategory;
  severity: FindingSeverity;
  summary: string;
  detail?: string;
  createdAt: string;
};

export type CaseSummary = {
  id: string;
  orgId: string;
  status: CaseStatus;
  priority: CasePriority;
  title: string;
  assigneeId?: string;
  createdAt: string;
};

export type ReportSummary = {
  id: string;
  orgId: string;
  name: string;
  createdAt: string;
};
