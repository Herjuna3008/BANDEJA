import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProfileClient } from "./profile-client";

export default async function DashboardProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const [user, coachRecord, venueRecord] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, name: true, email: true, image: true, role: true, createdAt: true },
    }),
    prisma.coach.findFirst({ where: { userId: session.user.id } }),
    prisma.venue.findFirst({ where: { ownerId: session.user.id } }),
  ]);

  if (!user) redirect("/login");

  return (
    <div>
      <h2 className="mb-6 font-display text-3xl uppercase tracking-[0.06em] text-neutral-100">
        Profil Saya
      </h2>
      <ProfileClient
        user={user}
        coachRecord={coachRecord}
        venueRecord={venueRecord}
      />
    </div>
  );
}
