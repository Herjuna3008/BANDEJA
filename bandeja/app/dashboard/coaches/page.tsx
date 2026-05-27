import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Calendar, Clock, Dumbbell } from "lucide-react";

export default async function DashboardCoachesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const bookings = await prisma.coachBooking.findMany({
    where: { userId: session.user.id },
    include: { coach: { include: { user: { select: { name: true, image: true } } } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h2 className="mb-6 font-display text-3xl uppercase tracking-[0.06em] text-neutral-100">
        Booking Pelatih
      </h2>

      {bookings.length === 0 ? (
        <div className="rounded-[4px] border border-neutral-800 p-12 text-center text-neutral-500">
          Belum ada booking pelatih.{" "}
          <a href="/coaches" className="text-lime-300 hover:underline">
            Cari pelatih →
          </a>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {bookings.map((b) => (
            <Card key={b.id} className="p-5">
              <div className="mb-3 flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-500">
                    {b.bookingCode}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    {b.coach.user.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={b.coach.user.image}
                        alt=""
                        className="h-6 w-6 rounded-full"
                      />
                    ) : (
                      <Dumbbell className="h-4 w-4 text-lime-300" />
                    )}
                    <p className="font-bold text-neutral-100">{b.coach.user.name}</p>
                  </div>
                  <p className="mt-0.5 text-xs text-neutral-500">{b.coach.specialty}</p>
                </div>
                <StatusBadge status={b.status} />
              </div>

              <div className="mb-4 space-y-1.5 text-sm text-neutral-500">
                <p className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 text-lime-300" />
                  {format(new Date(b.date), "d MMMM yyyy", { locale: id })}
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-lime-300" />
                  {b.time} · {b.sessions} sesi
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-neutral-800 pt-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-neutral-600">
                  {b.paymentMethod}
                </span>
                <span className="font-display text-xl text-lime-300">
                  {formatCurrency(b.totalPrice)}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
