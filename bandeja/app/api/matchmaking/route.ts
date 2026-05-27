import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createMatchSchema = z.object({
  level: z.enum(["beginner", "intermediate", "advanced"]),
  venueCourt: z.string().min(1),
  date: z.string().min(1),
  time: z.string().min(1),
  format: z.enum(["Singles (1v1)", "Doubles (2v2)", "Fleksibel"]),
});

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const level = searchParams.get("level");

  const posts = await prisma.matchPost.findMany({
    where: {
      isOpen: true,
      ...(level && level !== "all" ? { level } : {}),
    },
    include: {
      user: { select: { name: true, image: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = createMatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const post = await prisma.matchPost.create({
    data: {
      userId: session.user.id,
      ...parsed.data,
    },
    include: {
      user: { select: { name: true, image: true } },
    },
  });

  return NextResponse.json(post, { status: 201 });
}
