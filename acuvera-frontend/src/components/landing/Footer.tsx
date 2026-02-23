import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 sm:flex-row">
        <div className="flex items-center gap-2.5">
          <img src="/acuvera-logo.png" alt="" width={28} height={28} className="rounded-lg" />
          <span className="text-sm font-semibold text-white/60">Acuvera</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/40">
          <Link href="/privacy" className="transition hover:text-white">Privacy</Link>
          <Link href="/terms" className="transition hover:text-white">Terms</Link>
          <a href="#security" className="transition hover:text-white">Security</a>
          <a href="mailto:hello@acuvera.co" className="transition hover:text-white">Contact</a>
        </div>

        <p className="text-xs text-white/25">
          &copy; {new Date().getFullYear()} Acuvera. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
