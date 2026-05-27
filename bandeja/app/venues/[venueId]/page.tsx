import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { VenueDetailClient } from "./venue-detail-client";

interface Props {
  params: Promise<{ venueId: string }>;
}

export default async function VenueDetailPage({ params }: Props) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { venueId } = await params;

  const venue = await prisma.venue.findUnique({
    where: { id: venueId, status: "APPROVED" },
    include: { courts: true },
  });

  if (!venue) notFound();

  return (
    <>
      <Navbar session={session} />
      <main className="min-h-dvh pt-20">
        <VenueDetailClient venue={venue} userId={session.user.id} />
      </main>
      <Footer />
    </>
  );
}
