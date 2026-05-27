import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateSchema = z.object({
  venueId: z.string(),
  available: z.boolean(),
});

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const coach = await prisma.coach.findFirst({ where: { userId: session.user.id } });
  if (!coach) return NextResponse.json({ error: "Not a coach" }, { status: 404 });

  const allVenues = await prisma.venue.findMany({
    where: { status: "APPROVED" },
    include: {
      coachVenues: { where: { coachId: coach.id } },
    },
  });

  const venues = allVenues.map((v) => ({
    ...v,
    isAvailable: v.coachVenues.length > 0,
  }));

  return NextResponse.json(venues);
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const coach = await prisma.coach.findFirst({ where: { userId: session.user.id } });
  if (!coach) return NextResponse.json({ error: "Not a coach" }, { status: 404 });

  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { venueId, available } = parsed.data;

  if (available) {
    await prisma.coachVenue.upsert({
      where: { coachId_venueId: { coachId: coach.id, venueId } },
      create: { coachId: coach.id, venueId },
      update: {},
    });
  } else {
    await prisma.coachVenue.deleteMany({
      where: { coachId: coach.id, venueId },
    });
  }

  return NextResponse.json({ success: true });
}
