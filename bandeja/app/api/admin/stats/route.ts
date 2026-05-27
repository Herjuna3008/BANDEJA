import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [totalUsers, totalVenues, totalCoaches, totalBookings, totalCoachBookings, pendingApprovals] =
    await Promise.all([
      prisma.user.count(),
      prisma.venue.count({ where: { status: "APPROVED" } }),
      prisma.coach.count({ where: { status: "APPROVED" } }),
      prisma.booking.count(),
      prisma.coachBooking.count(),
      prisma.venue
        .count({ where: { status: "PENDING" } })
        .then(async (v) => v + (await prisma.coach.count({ where: { status: "PENDING" } }))),
    ]);

  return NextResponse.json({
    totalUsers,
    totalVenues,
    totalCoaches,
    totalBookings: totalBookings + totalCoachBookings,
    pendingApprovals,
  });
}
