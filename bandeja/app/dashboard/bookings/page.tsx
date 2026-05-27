import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BookingCard } from "@/components/booking/BookingCard";

export default async function DashboardBookingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const bookings = await prisma.booking.findMany({
    where: { userId: session.user.id },
    include: { court: { include: { venue: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h2 className="mb-6 font-display text-3xl uppercase tracking-[0.06em] text-neutral-100">
        Booking Lapangan
      </h2>

      {bookings.length === 0 ? (
        <div className="rounded-[4px] border border-neutral-800 p-12 text-center text-neutral-500">
          Belum ada booking. <a href="/venues" className="text-lime-300 hover:underline">Book lapangan sekarang →</a>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {bookings.map((b) => (
            <BookingCard
              key={b.id}
              bookingCode={b.bookingCode}
              courtName={b.court.name}
              venueName={b.court.venue.name}
              date={b.date}
              startTime={b.startTime}
              duration={b.duration}
              totalPrice={b.totalPrice}
              status={b.status}
              paymentMethod={b.paymentMethod}
            />
          ))}
        </div>
      )}
    </div>
  );
}
