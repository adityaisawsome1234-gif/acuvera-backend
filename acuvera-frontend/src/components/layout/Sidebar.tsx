"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  FileSearch,
  FileText,
  LayoutDashboard,
  LogOut,
  Settings,
  Upload,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { clearAuth, getUser } from "@/lib/auth";

const navItems = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Upload Bill", path: "/upload", icon: Upload },
  { name: "Claims Review", path: "/claims", icon: FileSearch },
  { name: "Analytics", path: "/analytics", icon: BarChart3 },
  { name: "Reports", path: "/reports", icon: FileText },
  { name: "Settings", path: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const user = getUser();

  function handleSignOut() {
    clearAuth();
    window.location.href = "/login";
  }

  return (
    <aside className="fixed left-0 top-0 z-30 flex h-screen w-64 flex-col border-r border-border bg-sidebar-background">
      {/* Logo */}
      <Link href="/dashboard" className="px-6 pb-4 pt-7">
        <div className="flex items-center gap-3">
          <img
            src="/acuvera-logo.png"
            alt="Acuvera"
            width={36}
            height={36}
            className="rounded-lg object-contain"
          />
          <div>
            <p className="text-[15px] font-semibold tracking-tight text-sidebar-accent-foreground">
              Acuvera
            </p>
            <p className="text-[11px] font-medium text-muted-foreground">
              Billing Intelligence
            </p>
          </div>
        </div>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5 px-3 pt-2">
        <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Menu
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path || pathname.startsWith(item.path + "/");
          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-all duration-150",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="border-t border-border p-3">
        {user ? (
          <div className="space-y-1">
            <div className="flex items-center gap-3 rounded-lg px-3 py-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                <User size={14} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium text-foreground">
                  {user.full_name}
                </p>
                <p className="truncate text-[11px] text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-muted-foreground transition-colors duration-150 hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut size={14} />
              Sign out
            </button>
          </div>
        ) : null}

        {/* Policy links */}
        <div className="mt-2 flex items-center gap-3 px-3 py-1">
          <Link
            href="/privacy"
            className="text-[11px] text-muted-foreground transition-colors hover:text-foreground hover:underline"
          >
            Privacy
          </Link>
          <span className="text-[10px] text-muted-foreground/50">&middot;</span>
          <Link
            href="/support"
            className="text-[11px] text-muted-foreground transition-colors hover:text-foreground hover:underline"
          >
            Support
          </Link>
        </div>
      </div>
    </aside>
  );
}
