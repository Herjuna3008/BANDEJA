import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { StatsCard } from "@/components/admin/StatsCard";
import { formatCurrency } from "@/lib/utils";

export default async function CoachDashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const coach = await prisma.coach.findFirst({ where: { userId: session.user.id } });
  if (!coach) return <div className="text-neutral-500 p-12 text-center">Coach record tidak ditemukan.</div>;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [upcomingSessions, totalClients, totalRevenue] = await Promise.all([
    prisma.coachBooking.count({
      where: {
        coachId: coach.id,
        date: { gte: today },
        status: { not: "CANCELLED" },
      },
    }),
    prisma.coachBooking
      .findMany({ where: { coachId: coach.id }, select: { userId: true }, distinct: ["userId"] })
      .then((r) => r.length),
    prisma.coachBooking.aggregate({
      _sum: { totalPrice: true },
      where: { coachId: coach.id, status: { not: "CANCELLED" } },
    }),
  ]);

  return (
    <div>
      <h2 className="mb-6 font-display text-3xl uppercase tracking-[0.06em] text-neutral-100">
        Coach Dashboard
      </h2>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatsCard title="Upcoming Sessions" value={upcomingSessions} icon="calendar-days" accent />
        <StatsCard title="Total Client" value={totalClients} icon="users" />
        <StatsCard
          title="Total Earning"
          value={formatCurrency(totalRevenue._sum.totalPrice ?? 0)}
          icon="trending-up"
        />
      </div>
    </div>
  );
}
