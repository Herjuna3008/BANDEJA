import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createCoachBookingSchema = z.object({
  coachId: z.string(),
  venueId: z.string(),
  date: z.string(),
  time: z.string(),
  sessions: z.number().min(1).max(4),
  totalPrice: z.number(),
  paymentMethod: z.string(),
});

function generateCoachBookingCode() {
  return `BDJ-C-${Math.floor(10000 + Math.random() * 90000)}`;
}

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const bookings = await prisma.coachBooking.findMany({
    where: { userId: session.user.id },
    include: {
      coach: { include: { user: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(bookings);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = createCoachBookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { coachId, venueId, date, time, sessions, totalPrice, paymentMethod } = parsed.data;

  const booking = await prisma.coachBooking.create({
    data: {
      userId: session.user.id,
      coachId,
      venueId,
      date: new Date(date),
      time,
      sessions,
      totalPrice,
      paymentMethod,
      bookingCode: generateCoachBookingCode(),
    },
    include: {
      coach: { include: { user: true } },
    },
  });

  return NextResponse.json(booking, { status: 201 });
}
