import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CoachDetailClient } from "./coach-detail-client";

interface Props {
  params: Promise<{ coachId: string }>;
}

export default async function CoachDetailPage({ params }: Props) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { coachId } = await params;

  const coach = await prisma.coach.findUnique({
    where: { id: coachId, status: "APPROVED" },
    include: {
      user: { select: { name: true, image: true, email: true } },
      coachVenues: { include: { venue: true } },
    },
  });

  if (!coach) notFound();

  return (
    <>
      <Navbar session={session} />
      <main className="min-h-dvh pt-20">
        <CoachDetailClient coach={coach} />
      </main>
      <Footer />
    </>
  );
}
