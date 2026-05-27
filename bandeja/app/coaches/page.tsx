import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CoachesClient } from "./coaches-client";

export default async function CoachesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const coaches = await prisma.coach.findMany({
    where: { status: "APPROVED" },
    include: {
      user: { select: { name: true, image: true } },
      coachVenues: { include: { venue: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  return (
    <>
      <Navbar session={session} />
      <main className="min-h-dvh pt-20">
        <CoachesClient coaches={coaches} />
      </main>
      <Footer />
    </>
  );
}
