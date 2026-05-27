import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  specialty: z.string().min(2).optional(),
  experience: z.string().min(1).optional(),
  ratePerSession: z.number().min(1).optional(),
  bio: z.string().optional(),
});

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const coach = await prisma.coach.findFirst({ where: { userId: session.user.id } });
  if (!coach) return NextResponse.json({ error: "Not a coach" }, { status: 404 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const updated = await prisma.coach.update({ where: { id: coach.id }, data: parsed.data });
  return NextResponse.json(updated);
}
