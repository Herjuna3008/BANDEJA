import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const coach = await prisma.coach.findUnique({
    where: { id, status: "APPROVED" },
    include: {
      user: { select: { name: true, image: true, email: true } },
      coachVenues: {
        include: { venue: true },
      },
    },
  });

  if (!coach) return NextResponse.json({ error: "Coach not found" }, { status: 404 });

  return NextResponse.json(coach);
}
