import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { NextResponse } from "next/server";

const alertSchema = z.object({
  title: z.string().min(1, "Title is required"),
  message: z.string().min(1, "Message is required"),
  severity: z.enum(["low", "medium", "high"]).optional(),
  districtId: z.string().optional(),
  issuedAt: z.string().datetime().optional(),
  expiresAt: z.string().datetime().optional(),
});

export async function GET() {
  const alerts = await prisma.alert.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(alerts);
}

export async function POST(req: Request) {
  try {
    const json = await req.json();

    const parsed = alertSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          error: {
            code: "VALIDATION_ERROR",
            issues: parsed.error.flatten(),
          },
        },
        { status: 400 }
      );
    }

    // Stub implementation: no database write, just echo back validated payload
    return NextResponse.json(
      {
        success: true,
        message: "Alert payload accepted (stub, not persisted)",
        data: parsed.data,
        timestamp: new Date().toISOString(),
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid JSON body",
        error: { code: "INVALID_JSON" },
      },
      { status: 400 }
    );
  }
}
