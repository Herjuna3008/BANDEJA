import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CourtsClient } from "./courts-client";

export default async function VenueOwnerCourtsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const venue = await prisma.venue.findFirst({
    where: { ownerId: session.user.id },
    include: { courts: { orderBy: { createdAt: "asc" } } },
  });

  if (!venue) {
    return (
      <div className="rounded-[4px] border border-neutral-800 p-12 text-center text-neutral-500">
        Venue tidak ditemukan.
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-6 font-display text-3xl uppercase tracking-[0.06em] text-neutral-100">
        Kelola Lapangan
      </h2>
      <CourtsClient courts={venue.courts} />
    </div>
  );
}
