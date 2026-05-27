import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatCurrency } from "@/lib/utils";

export default async function CoachSchedulePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const coach = await prisma.coach.findFirst({ where: { userId: session.user.id } });
  if (!coach) return <div className="text-neutral-500 p-12 text-center">Coach record tidak ditemukan.</div>;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const bookings = await prisma.coachBooking.findMany({
    where: {
      coachId: coach.id,
      date: { gte: today },
    },
    include: {
      user: { select: { name: true, email: true, image: true } },
    },
    orderBy: [{ date: "asc" }, { time: "asc" }],
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
        Jadwal Saya
      </h2>

      {bookings.length === 0 ? (
        <Card className="p-12 text-center text-neutral-500">Belum ada sesi mendatang.</Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([dateKey, dayBookings]) => (
            <div key={dateKey}>
              <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-lime-300">
                {format(new Date(dateKey), "EEEE, d MMMM yyyy", { locale: id })}
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {dayBookings.map((b) => (
                  <Card key={b.id} className="p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-mono text-lg text-lime-300">{b.time}</span>
                      <StatusBadge status={b.status} />
                    </div>
                    <div className="flex items-center gap-3">
                      {b.user.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={b.user.image} alt="" className="h-8 w-8 rounded-full" />
                      ) : null}
                      <div>
                        <p className="font-medium text-neutral-200">{b.user.name}</p>
                        <p className="text-xs text-neutral-500">{b.sessions} sesi · {formatCurrency(b.totalPrice)}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
