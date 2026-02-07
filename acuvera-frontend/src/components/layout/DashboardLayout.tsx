import { ReactNode } from "react";
import { Sidebar } from "@/components/layout/Sidebar";

interface DashboardLayoutProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}

export function DashboardLayout({
  title,
  subtitle,
  actions,
  children,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar />
      <div className="ml-64">
        <header className="sticky top-0 z-10 border-b border-border bg-background/90 px-8 py-6 backdrop-blur">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold">{title}</h1>
              {subtitle ? (
                <p className="text-sm text-muted-foreground">{subtitle}</p>
              ) : null}
            </div>
            {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
          </div>
        </header>
        <main className="space-y-6 px-8 py-6">{children}</main>
      </div>
    </div>
  );
}
