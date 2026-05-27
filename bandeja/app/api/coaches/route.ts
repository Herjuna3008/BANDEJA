import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const coaches = await prisma.coach.findMany({
    where: { status: "APPROVED" },
    include: {
      user: { select: { name: true, image: true, email: true } },
      coachVenues: {
        include: { venue: true },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(coaches);
}
