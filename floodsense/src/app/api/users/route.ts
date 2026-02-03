import { NextResponse } from "next/server";

// GET /api/users
// Returns a placeholder list of users.
export async function GET() {
  // In a real implementation, you would fetch users from the database here.
  const users = [
    { id: 1, name: "Example User", email: "user@example.com" },
  ];

  return NextResponse.json({ data: users });
}

// POST /api/users
// Accepts a JSON payload to create a new user (placeholder only).
export async function POST(request: Request) {
  // In a real implementation, you would validate the body
  // and persist the new user to the database.
  const body = await request.json().catch(() => null);

  if (!body) {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  return NextResponse.json(
    {
      message: "User creation is not yet implemented. This is a stub endpoint.",
      received: body,
    },
    { status: 201 },
  );
}

