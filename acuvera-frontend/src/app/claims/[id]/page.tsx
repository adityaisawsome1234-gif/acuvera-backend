import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Flag, FileDown, CheckCircle } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ClaimDetail } from "@/components/claims/ClaimDetail";
import { Button } from "@/components/ui/button";
import { claims } from "@/lib/mockData";

interface ClaimDetailPageProps {
  params: { id: string };
}

export default function ClaimDetailPage({ params }: ClaimDetailPageProps) {
  const claim = claims.find((item) => item.id === params.id);

  if (!claim) {
    notFound();
  }

  return (
    <DashboardLayout
      title="Claim Detail"
      subtitle={`Review AI findings for ${claim.id}`}
      actions={
        <>
          <Button variant="ghost" asChild>
            <Link href="/claims">
              <ArrowLeft size={16} /> Back to Claims
            </Link>
          </Button>
          <Button variant="outline">
            <Flag size={16} /> Flag for Follow-up
          </Button>
          <Button variant="outline">
            <FileDown size={16} /> Export Notes
          </Button>
          <Button>
            <CheckCircle size={16} /> Mark as Reviewed
          </Button>
        </>
      }
    >
      <ClaimDetail claim={claim} />
    </DashboardLayout>
  );
}
