import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10">
        <ShieldAlert size={24} className="text-destructive" />
      </div>
      <div>
        <h1 className="text-xl font-semibold text-foreground">
          Access restricted
        </h1>
        <p className="mt-1 max-w-md text-[13px] text-muted-foreground">
          You don&apos;t have permission to view this page. Contact your
          administrator if you believe this is a mistake.
        </p>
      </div>
      <div className="flex gap-3">
        <Button asChild>
          <Link href="/">Go to Dashboard</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/login">Sign in</Link>
        </Button>
      </div>
    </div>
  );
}
