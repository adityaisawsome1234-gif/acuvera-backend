"use client";

import Link from "next/link";
import { ReactNode } from "react";

const navItems = [
  { href: "/org", label: "Org" },
  { href: "/documents", label: "Documents" },
  { href: "/findings", label: "Findings" },
  { href: "/cases", label: "Cases" },
  { href: "/reports", label: "Reports" },
  { href: "/settings", label: "Settings" },
  { href: "/audit-log", label: "Audit Log" },
];

type AppShellProps = {
  title: string;
  children: ReactNode;
};

export default function AppShell({ title, children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-semibold">
            Acuvera Enterprise
          </Link>
          <span className="text-sm text-muted-foreground">Signed in</span>
        </div>
      </header>
      <div className="mx-auto grid max-w-6xl gap-6 px-6 py-6 md:grid-cols-[220px_1fr]">
        <aside className="rounded-2xl border bg-card p-4">
          <nav className="space-y-2 text-sm">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-md px-3 py-2 transition hover:bg-muted"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="space-y-4">
          <h1 className="text-2xl font-semibold">{title}</h1>
          <div className="rounded-2xl border bg-card p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
