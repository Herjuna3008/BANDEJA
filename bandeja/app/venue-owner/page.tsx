import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { StatsCard } from "@/components/admin/StatsCard";
import { formatCurrency } from "@/lib/utils";

export default async function VenueOwnerPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const venue = await prisma.venue.findFirst({
    where: { ownerId: session.user.id },
    include: { courts: true },
  });

  if (!venue) {
    return (
      <div className="rounded-[4px] border border-neutral-800 p-12 text-center text-neutral-500">
        Venue belum ditemukan. Pastikan sudah di-approve oleh admin.
      </div>
    );
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [bookingsToday, bookingsMonth, totalRevenue] = await Promise.all([
    prisma.booking.count({
      where: {
        court: { venueId: venue.id },
        date: { gte: today },
        status: { not: "CANCELLED" },
      },
    }),
    prisma.booking.count({
      where: {
        court: { venueId: venue.id },
        date: {
          gte: new Date(today.getFullYear(), today.getMonth(), 1),
          lt: new Date(today.getFullYear(), today.getMonth() + 1, 1),
        },
        status: { not: "CANCELLED" },
      },
    }),
    prisma.booking.aggregate({
      _sum: { totalPrice: true },
      where: {
        court: { venueId: venue.id },
        status: { not: "CANCELLED" },
      },
    }),
  ]);

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display text-3xl uppercase tracking-[0.06em] text-neutral-100">
          {venue.name}
        </h2>
        <p className="mt-1 text-sm text-neutral-500">{venue.area} — {venue.district}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Court" value={venue.courts.length} icon="building" accent />
        <StatsCard title="Booking Hari Ini" value={bookingsToday} icon="calendar-days" />
        <StatsCard title="Booking Bulan Ini" value={bookingsMonth} icon="users" />
        <StatsCard
          title="Total Revenue"
          value={formatCurrency(totalRevenue._sum.totalPrice ?? 0)}
          icon="trending-up"
        />
      </div>

      <div className="mt-8">
        <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.16em] text-neutral-500">
          // Status Court
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {venue.courts.map((court) => (
            <div
              key={court.id}
              className="rounded-[4px] border border-neutral-800 p-4"
            >
              <p className="font-bold text-neutral-100">{court.name}</p>
              <p className="text-xs text-neutral-600">{court.surface}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="font-display text-lg text-lime-300">
                  {formatCurrency(court.pricePerHour)}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 font-mono text-[10px] uppercase ${
                    court.status === "AVAILABLE"
                      ? "bg-lime-300/15 text-lime-300"
                      : "bg-orange-500/15 text-orange-400"
                  }`}
                >
                  {court.status === "AVAILABLE" ? "Tersedia" : "Maintenance"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
