import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [pendingVenues, pendingCoaches] = await Promise.all([
    prisma.venue.findMany({
      where: { status: "PENDING" },
      include: { owner: { select: { name: true, email: true, image: true } } },
      orderBy: { createdAt: "asc" },
    }),
    prisma.coach.findMany({
      where: { status: "PENDING" },
      include: { user: { select: { name: true, email: true, image: true } } },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  return NextResponse.json({ venues: pendingVenues, coaches: pendingCoaches });
}
