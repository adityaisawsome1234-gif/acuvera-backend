"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";

type ProtectedProps = {
  children: React.ReactNode;
  roles?: Array<"PATIENT" | "PROVIDER" | "ADMIN">;
};

export function Protected({ children, roles }: ProtectedProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
    if (!loading && user && roles && !roles.includes(user.role as "PATIENT" | "PROVIDER" | "ADMIN")) {
      router.replace("/unauthorized");
    }
  }, [loading, user, roles, router]);

  if (loading || !user) {
    return (
      <div className="p-8">
        <Skeleton className="h-10 w-1/3" />
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
