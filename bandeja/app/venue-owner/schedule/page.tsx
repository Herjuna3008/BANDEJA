import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

export default async function VenueOwnerSchedulePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const venue = await prisma.venue.findFirst({ where: { ownerId: session.user.id } });
  if (!venue) return <div className="text-neutral-500 p-12 text-center">Venue tidak ditemukan.</div>;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  const bookings = await prisma.booking.findMany({
    where: {
      court: { venueId: venue.id },
      date: { gte: today, lt: nextWeek },
      status: { not: "CANCELLED" },
    },
    include: {
      court: true,
      user: { select: { name: true } },
    },
    orderBy: [{ date: "asc" }, { startTime: "asc" }],
  });

  const grouped = bookings.reduce(
    (acc, b) => {
      const key = format(new Date(b.date), "yyyy-MM-dd");
      (acc[key] ??= []).push(b);
      return acc;
    },
    {} as Record<string, typeof bookings>,
  );

  return (
    <div>
      <h2 className="mb-6 font-display text-3xl uppercase tracking-[0.06em] text-neutral-100">
        Jadwal 7 Hari ke Depan
      </h2>

      {Object.keys(grouped).length === 0 ? (
        <Card className="p-12 text-center text-neutral-500">
          Belum ada booking dalam 7 hari ke depan.
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([dateKey, dayBookings]) => (
            <div key={dateKey}>
              <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-lime-300">
                {format(new Date(dateKey), "EEEE, d MMMM yyyy", { locale: id })}
              </p>
              <div className="grid gap-2">
                {dayBookings.map((b) => (
                  <div
                    key={b.id}
                    className="flex items-center justify-between rounded-[4px] border border-neutral-800 px-4 py-3"
                  >
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-sm text-lime-300">{b.startTime}</span>
                      <div>
                        <p className="font-medium text-neutral-200">{b.court.name}</p>
                        <p className="text-xs text-neutral-500">{b.user.name} · {b.duration}j</p>
                      </div>
                    </div>
                    <span className="font-display text-lg text-neutral-300">
                      {formatCurrency(b.totalPrice)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
