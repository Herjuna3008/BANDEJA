import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { VenuesTable } from "./venues-table";

export default async function AdminVenuesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const venues = await prisma.venue.findMany({
    include: {
      owner: { select: { name: true, email: true } },
      courts: { select: { id: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h2 className="mb-6 font-display text-3xl uppercase tracking-[0.06em] text-neutral-100">
        Kelola Venue ({venues.length})
      </h2>
      <VenuesTable venues={venues} />
    </div>
  );
}
