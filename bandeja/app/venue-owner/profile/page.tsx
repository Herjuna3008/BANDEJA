import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { VenueProfileClient } from "./venue-profile-client";

export default async function VenueOwnerProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const venue = await prisma.venue.findFirst({ where: { ownerId: session.user.id } });
  if (!venue) return <div className="text-neutral-500 p-12 text-center">Venue tidak ditemukan.</div>;

  return (
    <div>
      <h2 className="mb-6 font-display text-3xl uppercase tracking-[0.06em] text-neutral-100">
        Profil Venue
      </h2>
      <VenueProfileClient venue={venue} />
    </div>
  );
}
