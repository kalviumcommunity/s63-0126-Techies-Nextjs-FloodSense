import { NextResponse } from "next/server";

// GET /api/alerts
// Returns a placeholder list of alerts.
export async function GET() {
  // In a real implementation, you would fetch alerts from the database here.
  const alerts = [
    {
      id: 1,
      districtId: 1,
      severity: "high",
      message: "Sample flood alert for demonstration purposes.",
    },
  ];

  return NextResponse.json({ data: alerts });
}

// POST /api/alerts
// Accepts a JSON payload to create a new alert (placeholder only).
export async function POST(request: Request) {
  // In a real implementation, you would validate the body
  // and persist the new alert to the database.
  const body = await request.json().catch(() => null);

  if (!body) {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  return NextResponse.json(
    {
      message: "Alert creation is not yet implemented. This is a stub endpoint.",
      received: body,
    },
    { status: 201 },
  );
}

