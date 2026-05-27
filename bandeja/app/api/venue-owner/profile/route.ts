import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2).optional(),
  area: z.string().min(1).optional(),
  district: z.string().min(1).optional(),
});

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const venue = await prisma.venue.findFirst({ where: { ownerId: session.user.id } });
  if (!venue) return NextResponse.json({ error: "No venue" }, { status: 404 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const updated = await prisma.venue.update({ where: { id: venue.id }, data: parsed.data });
  return NextResponse.json(updated);
}
