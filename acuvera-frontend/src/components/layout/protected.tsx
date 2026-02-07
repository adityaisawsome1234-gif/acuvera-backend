"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

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
    if (
      !loading &&
      user &&
      roles &&
      !roles.includes(user.role as "PATIENT" | "PROVIDER" | "ADMIN")
    ) {
      router.replace("/unauthorized");
    }
  }, [loading, user, roles, router]);

  // If loading and no cached user, show minimal loading (not a full skeleton flash)
  if (loading && !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}
