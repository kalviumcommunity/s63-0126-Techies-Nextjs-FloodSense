import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const district = await prisma.district.findUnique({
    where: { id },
    include: { alerts: true },
  });

  if (!district)
    return NextResponse.json({ error: "District not found" }, { status: 404 });

  return NextResponse.json(district);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const updated = await prisma.district.update({
    where: { id },
    data: body,
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.district.delete({ where: { id } });
  return NextResponse.json({ message: "Deleted" });
}
