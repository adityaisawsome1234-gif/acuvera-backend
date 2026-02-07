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
  Shield,
  Upload,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { clearAuth, getUser } from "@/lib/auth";

const navItems = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
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
    <aside className="fixed left-0 top-0 flex h-screen w-64 flex-col bg-sidebar-background text-sidebar-accent-foreground">
      <div className="px-6 pb-6 pt-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Shield size={20} />
          </div>
          <div>
            <p className="text-lg font-semibold">Acuvera</p>
            <p className="text-xs text-sidebar-accent-foreground/70">
              Billing Intelligence
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.path === "/" ? pathname === "/" : pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-accent-foreground/70 hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon size={18} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User info + sign out */}
      <div className="border-t border-sidebar-accent/30 px-4 py-4">
        {user ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3 px-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-accent text-sm font-medium">
                <User size={14} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{user.full_name}</p>
                <p className="truncate text-xs text-sidebar-accent-foreground/70">{user.email}</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-sidebar-accent-foreground/70 transition hover:bg-red-500/10 hover:text-red-400"
            >
              <LogOut size={18} />
              Sign out
            </button>
          </div>
        ) : null}
      </div>

      <div className="px-6 pb-6 text-xs text-sidebar-accent-foreground/70">
        <p className="mt-2">&copy; 2026 Acuvera</p>
      </div>
    </aside>
  );
}
