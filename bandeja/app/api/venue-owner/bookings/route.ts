import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const venue = await prisma.venue.findFirst({
    where: { ownerId: session.user.id },
  });
  if (!venue) return NextResponse.json({ error: "No venue found" }, { status: 404 });

  const bookings = await prisma.booking.findMany({
    where: { court: { venueId: venue.id } },
    include: {
      user: { select: { name: true, email: true } },
      court: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(bookings);
}
