"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  DollarSign,
  FileSearch,
  FileText,
  LayoutDashboard,
  LogOut,
  ShieldAlert,
  TrendingUp,
  Upload,
  User,
  X,
  Eye,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
} from "recharts";

// ── Mock data ──────────────────────────────────────────────

const mockBills = [
  { id: 1, file_name: "ER_Visit_Memorial_Hospital.pdf", status: "COMPLETED", uploaded_at: "2026-01-28T14:30:00Z", findings_count: 4, estimated_savings: 1247.50, total_amount: 8934.00 },
  { id: 2, file_name: "Lab_Work_Quest_Diagnostics.pdf", status: "COMPLETED", uploaded_at: "2026-01-25T09:15:00Z", findings_count: 2, estimated_savings: 389.00, total_amount: 1245.00 },
  { id: 3, file_name: "Orthopedic_Consult_Feb.pdf", status: "COMPLETED", uploaded_at: "2026-01-22T16:45:00Z", findings_count: 3, estimated_savings: 876.25, total_amount: 3420.00 },
  { id: 4, file_name: "Annual_Physical_PrimaryCare.pdf", status: "COMPLETED", uploaded_at: "2026-01-18T11:00:00Z", findings_count: 1, estimated_savings: 125.00, total_amount: 450.00 },
  { id: 5, file_name: "Radiology_MRI_Spine.pdf", status: "COMPLETED", uploaded_at: "2026-01-15T08:30:00Z", findings_count: 5, estimated_savings: 2134.00, total_amount: 6780.00 },
  { id: 6, file_name: "Cardiology_Stress_Test.pdf", status: "COMPLETED", uploaded_at: "2026-01-10T13:20:00Z", findings_count: 2, estimated_savings: 567.00, total_amount: 2890.00 },
  { id: 7, file_name: "Dermatology_Biopsy.pdf", status: "PROCESSING", uploaded_at: "2026-01-29T10:00:00Z", findings_count: 0, estimated_savings: 0, total_amount: 1560.00 },
];

const monthlySavings = [
  { month: "Aug '25", savings: 2340, issues: 8 },
  { month: "Sep '25", savings: 3120, issues: 12 },
  { month: "Oct '25", savings: 4560, issues: 15 },
  { month: "Nov '25", savings: 3890, issues: 11 },
  { month: "Dec '25", savings: 5230, issues: 18 },
  { month: "Jan '26", savings: 5338, issues: 17 },
];

const issueTypes = [
  { name: "Duplicate Charges", value: 23, color: "#ef4444" },
  { name: "Upcoding", value: 18, color: "#f59e0b" },
  { name: "Missing Modifiers", value: 14, color: "#4A90FF" },
  { name: "Code Mismatch", value: 11, color: "#a78bfa" },
  { name: "Balance Billing", value: 8, color: "#10b981" },
];

const denialRisk = [
  { category: "Low Risk", count: 42, color: "#10b981" },
  { category: "Medium Risk", count: 18, color: "#f59e0b" },
  { category: "High Risk", count: 7, color: "#ef4444" },
];

const mockFindings = [
  { id: 1, type: "Duplicate Charge", severity: "HIGH", confidence: 0.96, estimated_savings: 487.50, explanation: "CPT 99213 (Office visit, established patient) appears twice on the same date of service for the same provider. Per CMS guidelines, only one E/M code per provider per date is billable unless modifier 25 is applied.", recommended_action: "Remove the duplicate CPT 99213 charge. If both visits were medically necessary, append modifier 25 to the second instance and ensure documentation supports it.", code: "CPT 99213" },
  { id: 2, type: "Upcoding", severity: "HIGH", confidence: 0.91, estimated_savings: 342.00, explanation: "CPT 99215 (Level 5 office visit) was billed, but documentation complexity suggests CPT 99214 (Level 4) is more appropriate. The medical decision-making documented is moderate, not high.", recommended_action: "Downcode to CPT 99214. Review provider documentation to ensure level of service matches code billed.", code: "CPT 99215 → 99214" },
  { id: 3, type: "Missing Modifier", severity: "MEDIUM", confidence: 0.88, estimated_savings: 293.00, explanation: "E/M code billed on the same day as a procedure without modifier 25. This is a common denial trigger — payers require modifier 25 to indicate a separately identifiable E/M service.", recommended_action: "Add modifier 25 to the E/M code to indicate the evaluation was separate from the procedure.", code: "Modifier 25" },
  { id: 4, type: "Balance Billing", severity: "MEDIUM", confidence: 0.85, estimated_savings: 125.00, explanation: "Patient was billed $125 above the allowed amount for an in-network provider. This may constitute balance billing, which is prohibited under the No Surprises Act for emergency and certain other services.", recommended_action: "Verify network status and adjust patient responsibility to match contracted allowed amount.", code: "Balance $125.00" },
];

const mockLineItems = [
  { code: "99213", description: "Office visit, established patient (Level 3)", qty: 1, price: 187.50 },
  { code: "99213", description: "Office visit, established patient (Level 3) — DUPLICATE", qty: 1, price: 187.50 },
  { code: "99215", description: "Office visit, established patient (Level 5)", qty: 1, price: 342.00 },
  { code: "36415", description: "Venipuncture for blood draw", qty: 1, price: 36.00 },
  { code: "80053", description: "Comprehensive metabolic panel", qty: 1, price: 148.00 },
  { code: "85025", description: "Complete blood count (CBC)", qty: 1, price: 42.00 },
  { code: "71046", description: "Chest X-ray, 2 views", qty: 1, price: 285.00 },
  { code: "93000", description: "Electrocardiogram (ECG), routine", qty: 1, price: 156.00 },
];

// ── Utility ────────────────────────────────────────────────

const fmt = (n: number) => "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2 });
const fmtDate = (s: string) => new Date(s).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

const chartColors = ["hsl(217 91% 60%)", "hsl(160 60% 45%)", "hsl(38 92% 55%)", "hsl(199 89% 48%)", "hsl(0 72% 60%)"];
const tooltipStyle = { background: "hsl(220 18% 9%)", borderRadius: "10px", borderColor: "hsl(220 14% 16%)", fontSize: "12px", color: "#fff" };

// ── Tabs ───────────────────────────────────────────────────

type Tab = "dashboard" | "claims" | "claim-detail" | "analytics";

const sidebarItems = [
  { name: "Dashboard", tab: "dashboard" as Tab, icon: LayoutDashboard },
  { name: "Claims Review", tab: "claims" as Tab, icon: FileSearch },
  { name: "Analytics", tab: "analytics" as Tab, icon: BarChart3 },
];

// ── Main Component ─────────────────────────────────────────

export default function DemoPage() {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [selectedBill, setSelectedBill] = useState<number | null>(null);

  function openClaim(id: number) {
    setSelectedBill(id);
    setTab("claim-detail");
  }

  const totalBills = mockBills.length;
  const totalFindings = mockBills.reduce((s, b) => s + b.findings_count, 0);
  const totalSavings = mockBills.reduce((s, b) => s + b.estimated_savings, 0);
  const completedBills = mockBills.filter((b) => b.status === "COMPLETED").length;
  const reviewRate = Math.round((completedBills / totalBills) * 100);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Demo banner */}
      <div className="fixed left-0 right-0 top-0 z-50 flex items-center justify-center gap-3 bg-[#2563EB] px-4 py-2 text-xs font-medium text-white">
        <Eye size={14} />
        You&apos;re viewing a demo with sample data — no real patient information is used.
        <Link href="/" className="ml-2 rounded-md bg-white/20 px-3 py-1 transition hover:bg-white/30">
          Back to Home
        </Link>
      </div>

      {/* Sidebar */}
      <aside className="fixed left-0 top-9 z-30 flex h-[calc(100vh-36px)] w-64 flex-col border-r border-border bg-sidebar-background">
        <div className="px-6 pb-4 pt-6">
          <div className="flex items-center gap-3">
            <img src="/acuvera-logo.png" alt="Acuvera" width={36} height={36} className="rounded-lg object-contain" />
            <div>
              <p className="text-[15px] font-semibold tracking-tight text-sidebar-accent-foreground">Acuvera</p>
              <p className="text-[11px] font-medium text-muted-foreground">Demo Mode</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-0.5 px-3 pt-2">
          <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Menu</p>
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = tab === item.tab || (tab === "claim-detail" && item.tab === "claims");
            return (
              <button
                key={item.tab}
                onClick={() => setTab(item.tab)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-all duration-150 ${
                  isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                {item.name}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-border p-3">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
              <User size={14} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium text-foreground">Demo User</p>
              <p className="truncate text-[11px] text-muted-foreground">demo@acuvera.co</p>
            </div>
          </div>
          <Link
            href="/register"
            className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-primary transition hover:bg-primary/10"
          >
            <ArrowRight size={14} />
            Create Real Account
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="ml-64 pt-9">
        {tab === "dashboard" && (
          <DemoDashboard
            totalBills={totalBills}
            totalFindings={totalFindings}
            totalSavings={totalSavings}
            reviewRate={reviewRate}
            onViewClaim={openClaim}
            onGoToClaims={() => setTab("claims")}
          />
        )}
        {tab === "claims" && <DemoClaims onViewClaim={openClaim} />}
        {tab === "claim-detail" && <DemoClaimDetail billId={selectedBill ?? 1} onBack={() => setTab("claims")} />}
        {tab === "analytics" && <DemoAnalytics />}
      </div>
    </div>
  );
}

// ── Dashboard Tab ──────────────────────────────────────────

function DemoDashboard({ totalBills, totalFindings, totalSavings, reviewRate, onViewClaim, onGoToClaims }: {
  totalBills: number; totalFindings: number; totalSavings: number; reviewRate: number;
  onViewClaim: (id: number) => void; onGoToClaims: () => void;
}) {
  return (
    <>
      <header className="sticky top-9 z-20 border-b border-border bg-background/80 px-8 py-5 backdrop-blur-xl">
        <h1 className="text-xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-0.5 text-[13px] text-muted-foreground">AI-powered medical billing intelligence</p>
      </header>
      <main className="space-y-6 px-8 py-6">
        {/* Upload CTA */}
        <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-foreground">Analyze a medical bill</h3>
              <p className="mt-1 max-w-lg text-[13px] text-muted-foreground">Upload a PDF and our AI will detect billing errors, overcharges, and savings opportunities in seconds.</p>
            </div>
            <Link href="/register" className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-primary/90">
              <Upload size={15} /> Upload Bill
            </Link>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid gap-4 lg:grid-cols-4">
          <KPI title="Bills Analyzed" value={totalBills.toLocaleString()} icon={<FileSearch size={16} />} />
          <KPI title="Issues Found" value={totalFindings.toLocaleString()} icon={<AlertTriangle size={16} />} />
          <KPI title="Potential Savings" value={fmt(totalSavings)} icon={<DollarSign size={16} />} />
          <KPI title="Review Rate" value={`${reviewRate}%`} icon={<ShieldAlert size={16} />} />
        </div>

        {/* Recent Bills */}
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Recent Bills</h3>
              <p className="text-[12px] text-muted-foreground">Latest analyzed medical bills</p>
            </div>
            <button onClick={onGoToClaims} className="flex items-center gap-1 text-[13px] text-muted-foreground transition hover:text-foreground">
              View all <ArrowRight size={14} />
            </button>
          </div>
          <div className="divide-y divide-border">
            {mockBills.slice(0, 5).map((bill) => (
              <button
                key={bill.id}
                onClick={() => onViewClaim(bill.id)}
                className="flex w-full items-center justify-between px-6 py-3.5 text-left transition-colors duration-150 hover:bg-muted/50"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-medium text-foreground">{bill.file_name}</p>
                  <p className="text-[12px] text-muted-foreground">{fmtDate(bill.uploaded_at)}</p>
                </div>
                <div className="flex items-center gap-4">
                  {bill.estimated_savings > 0 && <span className="text-[13px] font-medium text-success">{fmt(bill.estimated_savings)}</span>}
                  <StatusBadge status={bill.status} />
                </div>
              </button>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}

// ── Claims Tab ─────────────────────────────────────────────

function DemoClaims({ onViewClaim }: { onViewClaim: (id: number) => void }) {
  return (
    <>
      <header className="sticky top-9 z-20 border-b border-border bg-background/80 px-8 py-5 backdrop-blur-xl">
        <h1 className="text-xl font-semibold tracking-tight">Claims Review</h1>
        <p className="mt-0.5 text-[13px] text-muted-foreground">All analyzed bills and findings</p>
      </header>
      <main className="px-8 py-6">
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="grid grid-cols-[1fr_100px_100px_120px_90px] gap-4 border-b border-border px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            <span>File</span><span>Amount</span><span>Findings</span><span>Savings</span><span>Status</span>
          </div>
          {mockBills.map((bill) => (
            <button
              key={bill.id}
              onClick={() => onViewClaim(bill.id)}
              className="grid w-full grid-cols-[1fr_100px_100px_120px_90px] gap-4 border-b border-border px-6 py-3.5 text-left transition hover:bg-muted/50 last:border-0"
            >
              <div>
                <p className="truncate text-[13px] font-medium text-foreground">{bill.file_name}</p>
                <p className="text-[11px] text-muted-foreground">{fmtDate(bill.uploaded_at)}</p>
              </div>
              <span className="text-[13px] text-foreground">{fmt(bill.total_amount)}</span>
              <span className="text-[13px] text-foreground">{bill.findings_count}</span>
              <span className="text-[13px] font-medium text-success">{bill.estimated_savings > 0 ? fmt(bill.estimated_savings) : "—"}</span>
              <StatusBadge status={bill.status} />
            </button>
          ))}
        </div>
      </main>
    </>
  );
}

// ── Claim Detail Tab ───────────────────────────────────────

function DemoClaimDetail({ billId, onBack }: { billId: number; onBack: () => void }) {
  const bill = mockBills.find((b) => b.id === billId) ?? mockBills[0];

  return (
    <>
      <header className="sticky top-9 z-20 border-b border-border bg-background/80 px-8 py-5 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="rounded-lg p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground">
            <ArrowRight size={16} className="rotate-180" />
          </button>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">{bill.file_name}</h1>
            <p className="mt-0.5 text-[13px] text-muted-foreground">Uploaded {fmtDate(bill.uploaded_at)} &middot; {fmt(bill.total_amount)} total</p>
          </div>
        </div>
      </header>
      <main className="space-y-6 px-8 py-6">
        {/* Summary cards */}
        <div className="grid gap-4 sm:grid-cols-4">
          <KPI title="Total Amount" value={fmt(bill.total_amount)} icon={<DollarSign size={16} />} />
          <KPI title="Issues Found" value={String(mockFindings.length)} icon={<AlertTriangle size={16} />} />
          <KPI title="Potential Savings" value={fmt(mockFindings.reduce((s, f) => s + f.estimated_savings, 0))} icon={<TrendingUp size={16} />} />
          <KPI title="Risk Score" value="72 / 100" icon={<ShieldAlert size={16} />} />
        </div>

        {/* Findings */}
        <div className="rounded-2xl border border-border bg-card">
          <div className="border-b border-border px-6 py-4">
            <h3 className="text-sm font-semibold text-foreground">AI Findings</h3>
            <p className="text-[12px] text-muted-foreground">{mockFindings.length} issues detected with recommended actions</p>
          </div>
          <div className="divide-y divide-border">
            {mockFindings.map((f) => (
              <div key={f.id} className="px-6 py-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${
                      f.severity === "HIGH" ? "bg-destructive/15 text-destructive" : "bg-warning/15 text-warning"
                    }`}>
                      {f.severity === "HIGH" ? "H" : "M"}
                    </span>
                    <div>
                      <p className="text-[14px] font-semibold text-foreground">{f.type}</p>
                      <p className="text-[12px] text-muted-foreground">{f.code} &middot; {Math.round(f.confidence * 100)}% confidence</p>
                    </div>
                  </div>
                  <span className="text-[14px] font-semibold text-success">{fmt(f.estimated_savings)}</span>
                </div>
                <p className="text-[13px] leading-relaxed text-muted-foreground">{f.explanation}</p>
                <div className="flex items-start gap-2 rounded-xl bg-primary/5 p-3">
                  <CheckCircle2 size={14} className="mt-0.5 flex-shrink-0 text-primary" />
                  <p className="text-[12px] text-primary">{f.recommended_action}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Line Items */}
        <div className="rounded-2xl border border-border bg-card">
          <div className="border-b border-border px-6 py-4">
            <h3 className="text-sm font-semibold text-foreground">Line Items</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-border text-[11px] uppercase tracking-wider text-muted-foreground">
                  <th className="px-6 py-3 text-left font-semibold">Code</th>
                  <th className="px-6 py-3 text-left font-semibold">Description</th>
                  <th className="px-6 py-3 text-right font-semibold">Qty</th>
                  <th className="px-6 py-3 text-right font-semibold">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {mockLineItems.map((item, i) => (
                  <tr key={i} className={item.description.includes("DUPLICATE") ? "bg-destructive/5" : ""}>
                    <td className="px-6 py-3 font-mono text-[12px]">{item.code}</td>
                    <td className="px-6 py-3">
                      {item.description}
                      {item.description.includes("DUPLICATE") && (
                        <span className="ml-2 inline-block rounded bg-destructive/20 px-1.5 py-0.5 text-[10px] font-bold text-destructive">FLAGGED</span>
                      )}
                    </td>
                    <td className="px-6 py-3 text-right">{item.qty}</td>
                    <td className="px-6 py-3 text-right font-medium">{fmt(item.price)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-border font-semibold">
                  <td colSpan={3} className="px-6 py-3 text-right">Total</td>
                  <td className="px-6 py-3 text-right">{fmt(mockLineItems.reduce((s, i) => s + i.price * i.qty, 0))}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}

// ── Analytics Tab ──────────────────────────────────────────

function DemoAnalytics() {
  return (
    <>
      <header className="sticky top-9 z-20 border-b border-border bg-background/80 px-8 py-5 backdrop-blur-xl">
        <h1 className="text-xl font-semibold tracking-tight">Analytics</h1>
        <p className="mt-0.5 text-[13px] text-muted-foreground">Insights across analyzed bills</p>
      </header>
      <main className="space-y-6 px-8 py-6">
        {/* Summary */}
        <div className="grid gap-4 sm:grid-cols-4">
          <KPI title="Total Savings" value="$24,478" icon={<DollarSign size={16} />} />
          <KPI title="Bills Analyzed" value="67" icon={<FileSearch size={16} />} />
          <KPI title="Issues Caught" value="187" icon={<AlertTriangle size={16} />} />
          <KPI title="Avg Savings/Bill" value="$365" icon={<TrendingUp size={16} />} />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Savings Over Time */}
          <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Savings Over Time</h3>
              <p className="text-[12px] text-muted-foreground">Monthly savings from error detection</p>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlySavings}>
                  <defs>
                    <linearGradient id="savGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 16%)" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#64748b" }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#64748b" }} tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`} />
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  <Tooltip contentStyle={tooltipStyle} formatter={((v: any) => [`$${Number(v ?? 0).toLocaleString()}`, "Savings"]) as any} />
                  <Area type="monotone" dataKey="savings" stroke="#10b981" fill="url(#savGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Issues by Type */}
          <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Issues by Type</h3>
              <p className="text-[12px] text-muted-foreground">Distribution of detected billing errors</p>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={issueTypes} cx="50%" cy="50%" innerRadius={60} outerRadius={95} paddingAngle={3} dataKey="value">
                    {issueTypes.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  <Tooltip contentStyle={tooltipStyle} formatter={((v: any, name: any) => [v ?? 0, name ?? ""]) as any} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {issueTypes.map((t) => (
                <div key={t.name} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: t.color }} />
                  {t.name} ({t.value})
                </div>
              ))}
            </div>
          </div>

          {/* Denial Risk Distribution */}
          <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Denial Risk Distribution</h3>
              <p className="text-[12px] text-muted-foreground">Pre-submit risk scoring of analyzed claims</p>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={denialRisk} layout="vertical" margin={{ left: 10, right: 12 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 16%)" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#64748b" }} />
                  <YAxis dataKey="category" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#64748b" }} width={100} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                    {denialRisk.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Monthly Trend */}
          <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Issues Over Time</h3>
              <p className="text-[12px] text-muted-foreground">Monthly count of flagged billing errors</p>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlySavings}>
                  <defs>
                    <linearGradient id="issGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4A90FF" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#4A90FF" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 16%)" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#64748b" }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#64748b" }} />
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  <Tooltip contentStyle={tooltipStyle} formatter={((v: any) => [v ?? 0, "Issues"]) as any} />
                  <Area type="monotone" dataKey="issues" stroke="#4A90FF" fill="url(#issGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

// ── Shared Components ──────────────────────────────────────

function KPI({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="kpi-card">
      <div className="flex items-start justify-between">
        <div className="space-y-1.5">
          <p className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold tracking-tight text-foreground">{value}</p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">{icon}</div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles = status === "COMPLETED"
    ? "bg-success/10 text-success"
    : status === "PROCESSING"
      ? "bg-warning/10 text-warning"
      : "bg-muted text-muted-foreground";
  const label = status === "COMPLETED" ? "Analyzed" : status === "PROCESSING" ? "Processing" : "Pending";
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${styles}`}>
      {label}
    </span>
  );
}
