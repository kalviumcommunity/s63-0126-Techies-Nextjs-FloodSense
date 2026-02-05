import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  _: Request,
  { params }: { params: { id: string } }
) {
  const alerts = await prisma.alert.findMany({
    where: { districtId: params.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(alerts);
}
