import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  _: Request,
  { params }: { params: { id: string } }
) {
  const district = await prisma.district.findUnique({
    where: { id: params.id },
    include: { weather: true, alerts: true },
  });

  if (!district)
    return NextResponse.json({ error: "District not found" }, { status: 404 });

  return NextResponse.json(district);
}

export async function PUT(req: Request, { params }: any) {
  const body = await req.json();

  const updated = await prisma.district.update({
    where: { id: params.id },
    data: body,
  });

  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: any) {
  await prisma.district.delete({ where: { id: params.id } });

  return NextResponse.json({ message: "Deleted" });
}
