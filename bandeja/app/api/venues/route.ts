import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const venues = await prisma.venue.findMany({
    where: { status: "APPROVED" },
    include: {
      courts: true,
      owner: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(venues);
}
