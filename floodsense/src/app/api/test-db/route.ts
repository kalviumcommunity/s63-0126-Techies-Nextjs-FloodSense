import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      take: 100,
      select: { id: true, name: true, email: true, createdAt: true },
    });
    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      users,
      count: users.length,
    });
  } catch (error) {
    const err = error instanceof Error ? error : new Error("Unknown error");
    console.error("[test-db] Connection error:", err);
    return NextResponse.json(
      {
        success: false,
        message: "Database connection failed",
        error: err.message,
      },
      { status: 500 }
    );
  }
}
