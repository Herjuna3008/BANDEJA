import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getBookingTimeSlots } from "@/lib/booking-utils";
import { z } from "zod";

const updateSchema = z.object({
  status: z.enum(["CONFIRMED", "CANCELLED", "COMPLETED"]),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const venue = await prisma.venue.findFirst({ where: { ownerId: session.user.id } });
  if (!venue) return NextResponse.json({ error: "No venue" }, { status: 404 });

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { court: true },
  });
  if (!booking || booking.court.venueId !== venue.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const newStatus = parsed.data.status;

  // When cancelling, release the time slots so the court becomes available again
  if (newStatus === "CANCELLED" && booking.status !== "CANCELLED") {
    const timeSlots = getBookingTimeSlots(booking.startTime, booking.duration);
    const bookingDate = booking.date;

    await prisma.$transaction([
      prisma.booking.update({ where: { id }, data: { status: "CANCELLED" } }),
      ...timeSlots.map((time) =>
        prisma.timeSlot.updateMany({
          where: { courtId: booking.courtId, date: bookingDate, time },
          data: { isBooked: false },
        })
      ),
    ]);

    return NextResponse.json({ status: "CANCELLED" });
  }

  const updated = await prisma.booking.update({
    where: { id },
    data: { status: newStatus },
  });

  return NextResponse.json(updated);
}
