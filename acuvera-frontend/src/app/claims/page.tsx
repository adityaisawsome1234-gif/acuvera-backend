"use client";

import Link from "next/link";
import { Upload } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ClaimsTable } from "@/components/claims/ClaimsTable";
import { Button } from "@/components/ui/button";

export default function ClaimsReviewPage() {
  return (
    <DashboardLayout
      title="Claims Review"
      subtitle="Filter, prioritize, and action high-risk claims"
    >
      <div className="flex justify-end">
        <Link href="/upload">
          <Button className="gap-2">
            <Upload size={16} />
            Upload New Bill
          </Button>
        </Link>
      </div>
      <ClaimsTable />
    </DashboardLayout>
  );
}
