import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { MatchesClient } from "./matches-client";

export default async function DashboardMatchesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const posts = await prisma.matchPost.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h2 className="mb-6 font-display text-3xl uppercase tracking-[0.06em] text-neutral-100">
        Match Post Saya
      </h2>
      <MatchesClient posts={posts} />
    </div>
  );
}
