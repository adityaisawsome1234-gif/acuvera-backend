import Link from "next/link";
import { Button } from "@/components/ui/button";

export function TopNav() {
  return (
    <nav className="flex items-center justify-between py-6">
      <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-white">
        <img
          src="/acuvera-logo.png"
          alt="Acuvera"
          width={36}
          height={36}
          className="rounded-lg object-contain"
        />
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
