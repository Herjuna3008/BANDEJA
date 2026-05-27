import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getBookingTimeSlots } from "@/lib/booking-utils";
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
  const timeSlots = getBookingTimeSlots(startTime, duration);
  const bookingDate = new Date(date);

  try {
    const booking = await prisma.$transaction(async (tx) => {
      // 1. Check court is available
      const court = await tx.court.findUnique({ where: { id: courtId } });
      if (!court || court.status === "MAINTENANCE") {
        throw new Error("COURT_UNAVAILABLE");
      }

      // 2. Check for time slot conflicts
      const conflicts = await tx.timeSlot.findMany({
        where: {
          courtId,
          date: bookingDate,
          time: { in: timeSlots },
          isBooked: true,
        },
      });

      if (conflicts.length > 0) {
        const conflictTimes = conflicts.map((s) => s.time).join(",");
        throw new Error(`SLOT_CONFLICT:${conflictTimes}`);
      }

      // 3. Create the booking
      const newBooking = await tx.booking.create({
        data: {
          userId: session.user.id,
          courtId,
          date: bookingDate,
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

      // 4. Mark time slots as booked (upsert — safe if slot row doesn't exist yet)
      await Promise.all(
        timeSlots.map((time) =>
          tx.timeSlot.upsert({
            where: { courtId_date_time: { courtId, date: bookingDate, time } },
            update: { isBooked: true },
            create: { courtId, date: bookingDate, time, isBooked: true },
          })
        )
      );

      return newBooking;
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "COURT_UNAVAILABLE") {
        return NextResponse.json(
          { error: "Court sedang dalam maintenance." },
          { status: 409 }
        );
      }
      if (err.message.startsWith("SLOT_CONFLICT:")) {
        const slots = err.message.split(":")[1].split(",");
        return NextResponse.json(
          { error: "Slot sudah terisi pada waktu tersebut.", slots },
          { status: 409 }
        );
      }
    }
    throw err;
  }
}
