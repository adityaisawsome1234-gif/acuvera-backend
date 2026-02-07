// ── KPI data ────────────────────────────────────────────
export const kpiData = {
  claimsReviewed: 1_284,
  claimsReviewedTrend: 12.5,
  errorsCaught: 327,
  errorsCaughtTrend: -8.3,
  revenueSaved: 142_500,
  revenueSavedTrend: 23.1,
  denialRisk: 18.2,
  denialRiskTrend: -3.7,
};

// ── Claim type & sample list ────────────────────────────
export type ClaimIssue = {
  id: string;
  errorType: string;
  severity: "High" | "Medium" | "Low";
  confidenceScore: number;
  estimatedSavings: number;
  explanation: string;
  recommendedAction: string;
};

export type Claim = {
  id: string;
  claimNumber: string;
  patientName: string;
  provider: string;
  dateSubmitted: string;
  submissionDate: string;
  amount: number;
  totalAmount: number;
  status: "Needs Action" | "Pending" | "Reviewed";
  riskLevel: "High" | "Medium" | "Low";
  errorsFound: number;
  errorCount: number;
  estimatedSavings: number;
  category: string;
  patientId: string;
  payer: string;
  procedureCode: string;
  issues: ClaimIssue[];
};

export const claims: Claim[] = [
  {
    id: "1",
    claimNumber: "CLM-2024-001",
    patientName: "John Smith",
    provider: "Metro Hospital",
    dateSubmitted: "2024-12-15",
    submissionDate: "2024-12-15",
    amount: 15_200,
    totalAmount: 15_200,
    status: "Needs Action",
    riskLevel: "High",
    errorsFound: 3,
    errorCount: 3,
    estimatedSavings: 4_200,
    category: "Inpatient",
    patientId: "PT-10042",
    payer: "Blue Cross",
    procedureCode: "99213",
    issues: [
      { id: "i1", errorType: "Upcoding", severity: "High", confidenceScore: 0.94, estimatedSavings: 2_400, explanation: "CPT code 99215 billed for a level-3 visit.", recommendedAction: "Downcode to 99213." },
      { id: "i2", errorType: "Duplicate charge", severity: "Medium", confidenceScore: 0.87, estimatedSavings: 1_200, explanation: "Lab panel billed twice on same date.", recommendedAction: "Remove duplicate line." },
      { id: "i3", errorType: "Missing modifier", severity: "Low", confidenceScore: 0.78, estimatedSavings: 600, explanation: "Modifier 25 missing on E/M code.", recommendedAction: "Add modifier 25." },
    ],
  },
  {
    id: "2",
    claimNumber: "CLM-2024-002",
    patientName: "Sarah Johnson",
    provider: "City Clinic",
    dateSubmitted: "2024-12-14",
    submissionDate: "2024-12-14",
    amount: 4_800,
    totalAmount: 4_800,
    status: "Pending",
    riskLevel: "Medium",
    errorsFound: 1,
    errorCount: 1,
    estimatedSavings: 800,
    category: "Outpatient",
    patientId: "PT-10078",
    payer: "Aetna",
    procedureCode: "99214",
    issues: [
      { id: "i4", errorType: "Unbundling", severity: "Medium", confidenceScore: 0.82, estimatedSavings: 800, explanation: "Component codes billed separately instead of bundled.", recommendedAction: "Use comprehensive code." },
    ],
  },
  {
    id: "3",
    claimNumber: "CLM-2024-003",
    patientName: "Michael Lee",
    provider: "Valley Medical",
    dateSubmitted: "2024-12-13",
    submissionDate: "2024-12-13",
    amount: 22_750,
    totalAmount: 22_750,
    status: "Reviewed",
    riskLevel: "Low",
    errorsFound: 0,
    errorCount: 0,
    estimatedSavings: 0,
    category: "Emergency",
    patientId: "PT-10112",
    payer: "UnitedHealth",
    procedureCode: "99285",
    issues: [],
  },
  {
    id: "4",
    claimNumber: "CLM-2024-004",
    patientName: "Emily Davis",
    provider: "Metro Hospital",
    dateSubmitted: "2024-12-12",
    submissionDate: "2024-12-12",
    amount: 9_300,
    totalAmount: 9_300,
    status: "Needs Action",
    riskLevel: "High",
    errorsFound: 2,
    errorCount: 2,
    estimatedSavings: 3_100,
    category: "Inpatient",
    patientId: "PT-10205",
    payer: "Cigna",
    procedureCode: "99223",
    issues: [
      { id: "i5", errorType: "Wrong DX code", severity: "High", confidenceScore: 0.91, estimatedSavings: 2_100, explanation: "Primary diagnosis doesn't match procedure.", recommendedAction: "Update to correct ICD-10 code." },
      { id: "i6", errorType: "Duplicate charge", severity: "Medium", confidenceScore: 0.85, estimatedSavings: 1_000, explanation: "Same imaging study charged twice.", recommendedAction: "Remove duplicate line item." },
    ],
  },
  {
    id: "5",
    claimNumber: "CLM-2024-005",
    patientName: "Robert Chen",
    provider: "Sunrise Health",
    dateSubmitted: "2024-12-11",
    submissionDate: "2024-12-11",
    amount: 3_150,
    totalAmount: 3_150,
    status: "Reviewed",
    riskLevel: "Low",
    errorsFound: 0,
    errorCount: 0,
    estimatedSavings: 0,
    category: "Outpatient",
    patientId: "PT-10301",
    payer: "Medicare",
    procedureCode: "99212",
    issues: [],
  },
];

// ── Chart data ──────────────────────────────────────────
export const denialRiskData = [
  { name: "Coding errors", value: 35 },
  { name: "Missing auth", value: 25 },
  { name: "Duplicate claims", value: 20 },
  { name: "Late filing", value: 12 },
  { name: "Other", value: 8 },
];

export const errorsByCategoryData = [
  { category: "Upcoding", count: 45, color: "hsl(var(--chart-1))" },
  { category: "Unbundling", count: 32, color: "hsl(var(--chart-2))" },
  { category: "Duplicate", count: 28, color: "hsl(var(--chart-3))" },
  { category: "Missing modifier", count: 22, color: "hsl(var(--chart-4))" },
  { category: "Wrong DX", count: 18, color: "hsl(var(--chart-5))" },
  { category: "Other", count: 12, color: "hsl(var(--muted-foreground))" },
];

export const savingsTrendData = [
  { month: "Jul", savings: 18_000 },
  { month: "Aug", savings: 22_000 },
  { month: "Sep", savings: 19_500 },
  { month: "Oct", savings: 28_000 },
  { month: "Nov", savings: 32_000 },
  { month: "Dec", savings: 42_500 },
];

export const accuracyTrendData = [
  { month: "Jul", accuracy: 92 },
  { month: "Aug", accuracy: 93.5 },
  { month: "Sep", accuracy: 94.1 },
  { month: "Oct", accuracy: 95.2 },
  { month: "Nov", accuracy: 96 },
  { month: "Dec", accuracy: 96.8 },
];

export const errorTrendsData = [
  { month: "Jul", errors: 52 },
  { month: "Aug", errors: 48 },
  { month: "Sep", errors: 45 },
  { month: "Oct", errors: 38 },
  { month: "Nov", errors: 34 },
  { month: "Dec", errors: 27 },
];

// ── Reports ─────────────────────────────────────────────
export const reportData = {
  totalSavings: 142_500,
  denialsPrevented: 48,
  roi: 820,
  claimsProcessed: 1_284,
  accuracyRate: 96.8,
  avgProcessingTime: 3.2,
  grossSavings: 168_000,
  claimsCorrected: 327,
  netRevenueProtected: 142_500,
  avgSavingsPerClaim: 435,
  falsePositiveRate: 3.2,
  processingSpeed: "< 4 sec",
};

// ── Settings ────────────────────────────────────────────
export const organizationSettings = {
  name: "Acuvera Health",
  contactEmail: "admin@acuvera.co",
  billingAlertThreshold: 10_000,
  npi: "1234567890",
  address: "123 Health St, Suite 100",
  city: "New York",
  state: "NY",
  zip: "10001",
  billingContact: "Jane Doe",
  billingEmail: "billing@acuvera.co",
};

export const notificationSettings = {
  emailAlerts: true,
  slackIntegration: false,
  weeklyDigest: true,
  highRiskAlerts: true,
  dailyDigest: false,
  weeklyReport: true,
  alertThreshold: "Medium" as string,
};
