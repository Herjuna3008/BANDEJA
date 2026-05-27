import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CoachesTable } from "./coaches-table";

export default async function AdminCoachesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const coaches = await prisma.coach.findMany({
    include: { user: { select: { name: true, email: true, image: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h2 className="mb-6 font-display text-3xl uppercase tracking-[0.06em] text-neutral-100">
        Kelola Coach ({coaches.length})
      </h2>
      <CoachesTable coaches={coaches} />
    </div>
  );
}
