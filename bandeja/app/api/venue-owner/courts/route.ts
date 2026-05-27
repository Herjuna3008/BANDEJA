import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createCourtSchema = z.object({
  name: z.string().min(1),
  surface: z.enum(["INDOOR", "OUTDOOR"]),
  pricePerHour: z.number().min(1),
});

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const venue = await prisma.venue.findFirst({ where: { ownerId: session.user.id } });
  if (!venue) return NextResponse.json({ error: "No venue" }, { status: 404 });

  const courts = await prisma.court.findMany({
    where: { venueId: venue.id },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(courts);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const venue = await prisma.venue.findFirst({ where: { ownerId: session.user.id } });
  if (!venue) return NextResponse.json({ error: "No venue" }, { status: 404 });

  const body = await req.json();
  const parsed = createCourtSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const court = await prisma.court.create({
    data: { ...parsed.data, venueId: venue.id },
  });

  return NextResponse.json(court, { status: 201 });
}
