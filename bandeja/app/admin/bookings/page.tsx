import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BookingsTable } from "./bookings-table";

export default async function AdminBookingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const [courtBookings, coachBookings] = await Promise.all([
    prisma.booking.findMany({
      include: {
        user: { select: { name: true } },
        court: { include: { venue: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
    prisma.coachBooking.findMany({
      include: {
        user: { select: { name: true } },
        coach: { include: { user: { select: { name: true } } } },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
  ]);

  return (
    <div>
      <h2 className="mb-6 font-display text-3xl uppercase tracking-[0.06em] text-neutral-100">
        Kelola Booking
      </h2>
      <BookingsTable courtBookings={courtBookings} coachBookings={coachBookings} />
    </div>
  );
}
