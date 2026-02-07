import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";

export function TopNav() {
  return (
    <nav className="flex items-center justify-between py-6">
      <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-white">
        <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-primary text-white">
          <ShieldCheck size={18} />
        </div>
        Acuvera
      </Link>
      <div className="flex items-center gap-3">
        <Link href="/login">
          <Button variant="ghost">Sign In</Button>
        </Link>
        <Link href="/register">
          <Button>Get Started</Button>
        </Link>
      </div>
    </nav>
  );
}
