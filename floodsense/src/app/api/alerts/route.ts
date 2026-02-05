import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const alerts = await prisma.alert.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(alerts);
}

export async function POST(req: Request) {
  const body = await req.json();

  const alert = await prisma.alert.create({
    data: body,
  });

  return NextResponse.json(alert, { status: 201 });
}
