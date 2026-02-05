import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;

  const districts = await prisma.district.findMany({
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { name: "asc" },
  });

  return NextResponse.json({ page, limit, data: districts });
}

export async function POST(req: Request) {
  const body = await req.json();

  const district = await prisma.district.create({ data: body });

  return NextResponse.json(district, { status: 201 });
}
