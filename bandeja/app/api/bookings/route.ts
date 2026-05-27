import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createBookingSchema = z.object({
  courtId: z.string(),
  date: z.string(),
  startTime: z.string(),
  duration: z.number().min(1).max(3),
  totalPrice: z.number(),
  paymentMethod: z.string(),
});

function generateBookingCode() {
  return `BDJ-${Math.floor(10000 + Math.random() * 90000)}`;
}

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const bookings = await prisma.booking.findMany({
    where: { userId: session.user.id },
    include: {
      court: {
        include: { venue: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(bookings);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = createBookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { courtId, date, startTime, duration, totalPrice, paymentMethod } = parsed.data;

  const booking = await prisma.booking.create({
    data: {
      userId: session.user.id,
      courtId,
      date: new Date(date),
      startTime,
      duration,
      totalPrice,
      paymentMethod,
      bookingCode: generateBookingCode(),
    },
    include: {
      court: { include: { venue: true } },
    },
  });

  return NextResponse.json(booking, { status: 201 });
}
