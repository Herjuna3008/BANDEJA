import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MatchmakingClient } from "./matchmaking-client";

export default async function MatchmakingPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const [posts, venues] = await Promise.all([
    prisma.matchPost.findMany({
      where: { isOpen: true },
      include: { user: { select: { name: true, image: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.venue.findMany({
      where: { status: "APPROVED" },
      include: { courts: true },
    }),
  ]);

  return (
    <>
      <Navbar session={session} />
      <main className="min-h-dvh pt-20">
        <MatchmakingClient
          initialPosts={posts}
          venues={venues}
          userId={session.user.id}
          userName={session.user.name ?? "Player"}
        />
      </main>
      <Footer />
    </>
  );
}
