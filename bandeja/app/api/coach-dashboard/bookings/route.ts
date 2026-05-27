import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const coach = await prisma.coach.findFirst({ where: { userId: session.user.id } });
  if (!coach) return NextResponse.json({ error: "Not a coach" }, { status: 404 });

  const bookings = await prisma.coachBooking.findMany({
    where: { coachId: coach.id },
    include: {
      user: { select: { name: true, email: true, image: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(bookings);
}
