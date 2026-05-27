import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [courtBookings, coachBookings] = await Promise.all([
    prisma.booking.findMany({
      include: {
        user: { select: { name: true, email: true } },
        court: { include: { venue: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.coachBooking.findMany({
      include: {
        user: { select: { name: true, email: true } },
        coach: { include: { user: { select: { name: true } } } },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return NextResponse.json({ courtBookings, coachBookings });
}
