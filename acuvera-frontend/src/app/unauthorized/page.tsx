import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen px-6 py-16">
      <div className="mx-auto max-w-lg rounded-2xl border border-border bg-secondary/70 p-8 text-center">
        <h1 className="text-2xl font-semibold text-white">Access restricted</h1>
        <p className="mt-3 text-slate-300">
          You don’t have permission to view this page. If you think this is a mistake,
          contact your administrator.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/dashboard">
            <Button>Go to dashboard</Button>
          </Link>
          <Link href="/">
            <Button variant="outline">Back to home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
