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
  patient_id?: number;
  organization_id?: number;
  created_at?: string;
  uploaded_at?: string;
  analyzed_at?: string;
  updated_at?: string;
  line_items?: LineItem[];
  findings?: Finding[];
};

export type BillListItem = {
  id: number;
  patient_id?: number;
  organization_id?: number;
  file_name: string;
  file_type?: string;
  total_amount?: number;
  status: string;
  uploaded_at?: string;
  analyzed_at?: string;
  findings_count: number;
  estimated_savings: number;
};

export type LineItem = {
  id: number;
  bill_id?: number;
  description: string;
  code?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at?: string;
};

export type Finding = {
  id: number;
  bill_id?: number;
  type: string;
  severity: string;
  confidence: number;
  estimated_savings: number;
  explanation: string;
  recommended_action: string;
  line_item_id?: number;
  created_at?: string;
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
