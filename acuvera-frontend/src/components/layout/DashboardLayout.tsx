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
        <header className="sticky top-0 z-20 border-b border-border bg-background/80 px-8 py-5 backdrop-blur-xl">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
              {subtitle ? (
                <p className="mt-0.5 text-[13px] text-muted-foreground">
                  {subtitle}
                </p>
              ) : null}
            </div>
            {actions ? (
              <div className="flex flex-wrap items-center gap-2">{actions}</div>
            ) : null}
          </div>
        </header>
        <main className="space-y-6 px-8 py-6">{children}</main>
      </div>
    </div>
  );
}
