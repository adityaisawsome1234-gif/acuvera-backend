import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
      <h1 className="text-3xl font-semibold">Page not found</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        The page you are looking for does not exist. Head back to your dashboard to continue
        reviewing claims.
      </p>
      <Button asChild>
        <Link href="/">Return to Dashboard</Link>
      </Button>
    </div>
  );
}
