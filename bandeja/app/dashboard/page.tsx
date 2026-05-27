import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AlertCircle } from "lucide-react";
import { StatsCard } from "@/components/admin/StatsCard";
import { Card } from "@/components/ui/card";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const [courtBookings, coachBookings, matchPosts, coachRecord, venueRecord] =
    await Promise.all([
      prisma.booking.count({ where: { userId: session.user.id } }),
      prisma.coachBooking.count({ where: { userId: session.user.id } }),
      prisma.matchPost.count({ where: { userId: session.user.id, isOpen: true } }),
      prisma.coach.findFirst({ where: { userId: session.user.id } }),
      prisma.venue.findFirst({ where: { ownerId: session.user.id } }),
    ]);

  const isPendingCoach = coachRecord?.status === "PENDING";
  const isPendingVenueOwner = venueRecord?.status === "PENDING";

  return (
    <div>
      <h2 className="mb-6 font-display text-3xl uppercase tracking-[0.06em] text-neutral-100">
        Selamat datang, {session.user.name?.split(" ")[0]}
      </h2>

      {(isPendingCoach || isPendingVenueOwner) && (
        <div className="mb-6 flex items-start gap-3 rounded-[4px] border border-yellow-400/30 bg-yellow-400/5 px-4 py-3">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-yellow-400" />
          <div>
            <p className="text-sm font-medium text-yellow-400">Pendaftaran dalam proses review</p>
            <p className="mt-0.5 text-xs text-neutral-500">
              {isPendingCoach
                ? "Pendaftaran Coach kamu sedang menunggu approval dari admin."
                : "Pendaftaran Venue Owner kamu sedang menunggu approval dari admin."}
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <StatsCard
          title="Total Booking Lapangan"
          value={courtBookings}
          icon="calendar-days"
          accent
        />
        <StatsCard
          title="Total Booking Pelatih"
          value={coachBookings}
          icon="trophy"
        />
        <StatsCard
          title="Match Post Aktif"
          value={matchPosts}
          icon="swords"
        />
      </div>

      <div className="mt-8">
        <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.16em] text-neutral-500">
          // Menu Cepat
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { label: "Book Lapangan", href: "/venues", desc: "Pilih venue dan court" },
            { label: "Cari Pelatih", href: "/coaches", desc: "Temukan pelatih terbaik" },
            { label: "Matchmaking", href: "/matchmaking", desc: "Tantang lawan baru" },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-[4px] border border-neutral-800 p-5 transition-colors hover:border-lime-300 hover:bg-[#1a1a17]"
            >
              <p className="font-bold text-neutral-100">{item.label}</p>
              <p className="mt-1 text-sm text-neutral-500">{item.desc}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
