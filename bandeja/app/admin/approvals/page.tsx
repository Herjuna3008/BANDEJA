import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ApprovalsClient } from "./approvals-client";

export default async function AdminApprovalsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const [pendingVenues, pendingCoaches] = await Promise.all([
    prisma.venue.findMany({
      where: { status: "PENDING" },
      include: { owner: { select: { name: true, email: true, image: true } } },
      orderBy: { createdAt: "asc" },
    }),
    prisma.coach.findMany({
      where: { status: "PENDING" },
      include: { user: { select: { name: true, email: true, image: true } } },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  return (
    <div>
      <h2 className="mb-6 font-display text-3xl uppercase tracking-[0.06em] text-neutral-100">
        Approval
      </h2>
      <ApprovalsClient pendingVenues={pendingVenues} pendingCoaches={pendingCoaches} />
    </div>
  );
}
