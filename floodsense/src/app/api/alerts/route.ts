import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { NextResponse } from "next/server";

const alertSchema = z.object({
  title: z.string().min(1, "Title is required"),
  message: z.string().min(1, "Message is required"),
  severity: z.enum(["LOW", "MODERATE", "HIGH", "SEVERE"]).default("HIGH"),
  status: z.enum(["PENDING", "ACTIVE", "RESOLVED"]).default("PENDING"),
  districtId: z.string().min(1, "District ID is required"),
  createdBy: z.string().min(1, "Creator user ID is required"),
  issuedAt: z.string().datetime().optional(),
});

export async function GET() {
  const alerts = await prisma.alert.findMany({
    orderBy: { issuedAt: "desc" },
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

    const alert = await prisma.alert.create({
      data: {
        title: parsed.data.title,
        message: parsed.data.message,
        severity: parsed.data.severity as "LOW" | "MODERATE" | "HIGH" | "SEVERE",
        status: parsed.data.status as "PENDING" | "ACTIVE" | "RESOLVED",
        districtId: parsed.data.districtId,
        createdBy: parsed.data.createdBy,
        issuedAt: parsed.data.issuedAt
          ? new Date(parsed.data.issuedAt)
          : undefined,
      },
    });
    return NextResponse.json(
      { success: true, message: "Alert created", data: alert },
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
