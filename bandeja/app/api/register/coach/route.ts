import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const coachSchema = z.object({
  specialty: z.string().min(2),
  experience: z.string().min(1),
  ratePerSession: z.number().min(1),
  bio: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const existing = await prisma.coach.findFirst({
    where: { userId: session.user.id },
  });
  if (existing) {
    return NextResponse.json({ error: "Already registered as coach" }, { status: 400 });
  }

  const body = await req.json();
  const parsed = coachSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const coach = await prisma.coach.create({
    data: {
      userId: session.user.id,
      ...parsed.data,
      status: "PENDING",
    },
  });

  return NextResponse.json(coach, { status: 201 });
}
