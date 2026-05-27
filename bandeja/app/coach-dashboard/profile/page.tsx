import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CoachProfileClient } from "./coach-profile-client";

export default async function CoachProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const coach = await prisma.coach.findFirst({ where: { userId: session.user.id } });
  if (!coach) return <div className="text-neutral-500 p-12 text-center">Coach record tidak ditemukan.</div>;

  return (
    <div>
      <h2 className="mb-6 font-display text-3xl uppercase tracking-[0.06em] text-neutral-100">
        Profil Coach
      </h2>
      <CoachProfileClient coach={coach} />
    </div>
  );
}
