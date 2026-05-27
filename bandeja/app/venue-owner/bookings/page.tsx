import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { VenueBookingsClient } from "./venue-bookings-client";

export default async function VenueOwnerBookingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const venue = await prisma.venue.findFirst({ where: { ownerId: session.user.id } });
  if (!venue) return (
    <div className="text-neutral-500 p-12 text-center">Venue tidak ditemukan.</div>
  );

  const bookings = await prisma.booking.findMany({
    where: { court: { venueId: venue.id } },
    include: {
      user: { select: { name: true, email: true } },
      court: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h2 className="mb-6 font-display text-3xl uppercase tracking-[0.06em] text-neutral-100">
        Booking Masuk
      </h2>
      <VenueBookingsClient bookings={bookings} />
    </div>
  );
}
