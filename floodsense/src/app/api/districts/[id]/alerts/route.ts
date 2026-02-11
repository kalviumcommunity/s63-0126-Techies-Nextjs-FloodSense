import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const alerts = await prisma.alert.findMany({
    where: { districtId: id },
    orderBy: { issuedAt: "desc" },
  });

  return NextResponse.json(alerts);
}
