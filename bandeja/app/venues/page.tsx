import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { VenuesClient } from "./venues-client";

export default async function VenuesPage() {
  const session = await auth();

  const venues = await prisma.venue.findMany({
    where: { status: "APPROVED" },
    include: { courts: true },
    orderBy: { createdAt: "asc" },
  });

  return (
    <>
      <Navbar session={session} />
      <main className="min-h-dvh pt-20">
        <VenuesClient venues={venues} />
      </main>
      <Footer />
    </>
  );
}
