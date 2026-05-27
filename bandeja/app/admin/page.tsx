import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { StatsCard } from "@/components/admin/StatsCard";

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const [totalUsers, totalVenues, totalCoaches, totalBookings, totalCoachBookings, pendingVenues, pendingCoaches] =
    await Promise.all([
      prisma.user.count(),
      prisma.venue.count({ where: { status: "APPROVED" } }),
      prisma.coach.count({ where: { status: "APPROVED" } }),
      prisma.booking.count(),
      prisma.coachBooking.count(),
      prisma.venue.count({ where: { status: "PENDING" } }),
      prisma.coach.count({ where: { status: "PENDING" } }),
    ]);

  const pendingTotal = pendingVenues + pendingCoaches;

  return (
    <div>
      <h2 className="mb-6 font-display text-3xl uppercase tracking-[0.06em] text-neutral-100">
        Admin Overview
      </h2>

      {pendingTotal > 0 && (
        <div className="mb-6 rounded-[4px] border border-yellow-400/30 bg-yellow-400/5 px-4 py-3">
          <p className="text-sm text-yellow-400">
            {pendingTotal} pendaftaran menunggu approval →{" "}
            <a href="/admin/approvals" className="underline hover:no-underline">
              Lihat sekarang
            </a>
          </p>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCard title="Total User" value={totalUsers} icon="users" accent />
        <StatsCard title="Venue Aktif" value={totalVenues} icon="building" />
        <StatsCard title="Coach Aktif" value={totalCoaches} icon="trophy" />
        <StatsCard title="Total Booking Court" value={totalBookings} icon="calendar-days" />
        <StatsCard title="Total Booking Coach" value={totalCoachBookings} icon="calendar-days" />
        <StatsCard
          title="Pending Approval"
          value={pendingTotal}
          icon="check-circle"
          accent={pendingTotal > 0}
          description={`${pendingVenues} venue, ${pendingCoaches} coach`}
        />
      </div>
    </div>
  );
}
