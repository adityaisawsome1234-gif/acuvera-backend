"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Activity,
  FileText,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  Upload,
  Users,
} from "lucide-react";
import { clearAuth, getUser } from "@/lib/auth";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/bills", label: "Bills", icon: FileText },
  { href: "/upload", label: "Upload", icon: Upload },
  { href: "/provider", label: "Provider", icon: Activity, roles: ["PROVIDER", "ADMIN"] },
  { href: "/admin", label: "Admin", icon: ShieldCheck, roles: ["ADMIN"] },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const user = getUser();

  return (
    <div className="min-h-screen px-6 pb-16">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between py-6">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-white">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-primary text-white">
              <Users size={16} />
            </div>
            Acuvera
          </Link>
          <div className="flex items-center gap-4 text-sm text-slate-300">
            <span>{user?.email}</span>
            <Button
              variant="ghost"
              onClick={() => {
                clearAuth();
                window.location.href = "/login";
              }}
            >
              <LogOut size={16} />
              Sign out
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
          <aside className="space-y-2 rounded-2xl border border-border bg-secondary/70 p-4">
            {navItems
              .filter((item) => !item.roles || item.roles.includes(user?.role ?? "PATIENT"))
              .map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition",
                    active
                      ? "bg-primary text-white"
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <Icon size={16} />
                  {item.label}
                </Link>
              );
            })}
          </aside>
          <main className="space-y-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
