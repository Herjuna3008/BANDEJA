import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const venues = await prisma.venue.findMany({
    include: {
      owner: { select: { name: true, email: true } },
      courts: { select: { id: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(venues);
}
