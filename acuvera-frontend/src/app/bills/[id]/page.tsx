import { redirect } from "next/navigation";

interface BillDetailRedirectProps {
  params: { id: string };
}

export default function BillDetailRedirect({ params }: BillDetailRedirectProps) {
  redirect(`/claims/${params.id}`);
}
