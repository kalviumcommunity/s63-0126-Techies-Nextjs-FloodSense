import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const districtId = searchParams.get("districtId");

  const readings = await prisma.weatherData.findMany({
    where: districtId ? { districtId } : {},
    orderBy: { recordedAt: "desc" },
    take: 50,
  });

  return NextResponse.json(readings);
}

export async function POST(req: Request) {
  const body = await req.json();

  const reading = await prisma.weatherData.create({
    data: body,
  });

  return NextResponse.json(reading, { status: 201 });
}
