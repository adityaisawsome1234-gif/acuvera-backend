export type StandardResponse<T> = {
  success: boolean;
  data: T;
};

export type BillDetail = {
  id: number;
  file_name: string;
  status: string;
  total_amount?: number;
  description?: string;
  created_at: string;
  updated_at: string;
  line_items?: LineItem[];
  findings?: Finding[];
};

export type LineItem = {
  id: number;
  description: string;
  code?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
};

export type Finding = {
  id: number;
  finding_type: string;
  severity: string;
  description: string;
  recommendation?: string;
  potential_savings?: number;
};

export type ProviderDashboard = {
  organization_name?: string;
  total_bills: number;
  total_findings: number;
  total_savings: number;
  recent_bills: BillDetail[];
};

export type ProviderStats = {
  claims_reviewed: number;
  errors_caught: number;
  estimated_savings_total: number;
  bills_by_status: Record<string, number>;
  findings_by_type: Record<string, number>;
  savings_over_time: { month: string; savings: number }[];
  monthly_savings: { month: string; savings: number }[];
};
