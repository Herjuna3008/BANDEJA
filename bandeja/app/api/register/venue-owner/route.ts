import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const venueOwnerSchema = z.object({
  venueName: z.string().min(2),
  venueCode: z.string().min(2),
  shortName: z.string().min(1),
  area: z.string().min(1),
  district: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const existing = await prisma.venue.findFirst({
    where: { ownerId: session.user.id },
  });
  if (existing) {
    return NextResponse.json({ error: "Already registered as venue owner" }, { status: 400 });
  }

  const body = await req.json();
  const parsed = venueOwnerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { venueName, venueCode, shortName, area, district } = parsed.data;

  const venue = await prisma.venue.create({
    data: {
      name: venueName,
      code: venueCode,
      shortName,
      area,
      district,
      ownerId: session.user.id,
      status: "PENDING",
    },
  });

  return NextResponse.json(venue, { status: 201 });
}
