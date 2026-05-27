import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const venue = await prisma.venue.findUnique({
    where: { id, status: "APPROVED" },
    include: {
      courts: { include: { timeSlots: true } },
      coachVenues: {
        include: {
          coach: {
            include: { user: { select: { name: true, image: true } } },
          },
        },
      },
    },
  });

  if (!venue) return NextResponse.json({ error: "Venue not found" }, { status: 404 });

  return NextResponse.json(venue);
}
