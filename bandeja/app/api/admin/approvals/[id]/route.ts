import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const approvalSchema = z.object({
  type: z.enum(["venue", "coach"]),
  action: z.enum(["approve", "reject"]),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();
  const parsed = approvalSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { type, action } = parsed.data;
  const newStatus = action === "approve" ? "APPROVED" : "REJECTED";

  if (type === "venue") {
    const venue = await prisma.venue.findUnique({ where: { id } });
    if (!venue) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await prisma.$transaction([
      prisma.venue.update({ where: { id }, data: { status: newStatus } }),
      ...(action === "approve"
        ? [prisma.user.update({ where: { id: venue.ownerId }, data: { role: "VENUE_OWNER" } })]
        : []),
    ]);

    return NextResponse.json({ success: true });
  }

  if (type === "coach") {
    const coach = await prisma.coach.findUnique({ where: { id } });
    if (!coach) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await prisma.$transaction([
      prisma.coach.update({ where: { id }, data: { status: newStatus } }),
      ...(action === "approve"
        ? [prisma.user.update({ where: { id: coach.userId }, data: { role: "COACH" } })]
        : []),
    ]);

    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Invalid type" }, { status: 400 });
}
