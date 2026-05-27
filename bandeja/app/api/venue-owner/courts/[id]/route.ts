import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateCourtSchema = z.object({
  name: z.string().min(1).optional(),
  surface: z.enum(["INDOOR", "OUTDOOR"]).optional(),
  status: z.enum(["AVAILABLE", "MAINTENANCE"]).optional(),
  pricePerHour: z.number().min(1).optional(),
});

async function getVenueForUser(userId: string) {
  return prisma.venue.findFirst({ where: { ownerId: userId } });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const venue = await getVenueForUser(session.user.id);
  if (!venue) return NextResponse.json({ error: "No venue" }, { status: 404 });

  const court = await prisma.court.findUnique({ where: { id } });
  if (!court || court.venueId !== venue.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = updateCourtSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const updated = await prisma.court.update({ where: { id }, data: parsed.data });

  return NextResponse.json(updated);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const venue = await getVenueForUser(session.user.id);
  if (!venue) return NextResponse.json({ error: "No venue" }, { status: 404 });

  const court = await prisma.court.findUnique({ where: { id } });
  if (!court || court.venueId !== venue.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.court.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
