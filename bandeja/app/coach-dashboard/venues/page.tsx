import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CoachVenuesClient } from "./coach-venues-client";

export default async function CoachVenuesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const coach = await prisma.coach.findFirst({ where: { userId: session.user.id } });
  if (!coach) return <div className="text-neutral-500 p-12 text-center">Coach record tidak ditemukan.</div>;

  const allVenues = await prisma.venue.findMany({
    where: { status: "APPROVED" },
    include: { coachVenues: { where: { coachId: coach.id } } },
  });

  const venues = allVenues.map((v) => ({
    ...v,
    isAvailable: v.coachVenues.length > 0,
  }));

  return (
    <div>
      <h2 className="mb-6 font-display text-3xl uppercase tracking-[0.06em] text-neutral-100">
        Venue Saya
      </h2>
      <p className="mb-6 text-sm text-neutral-500">
        Pilih venue yang ingin kamu aktifkan untuk mengajar.
      </p>
      <CoachVenuesClient venues={venues} />
    </div>
  );
}
