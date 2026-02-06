import { prisma } from "@/lib/prisma";
import { sendSuccess, sendError } from "@/lib/responseHandler";
import { ERROR_CODES } from "@/lib/errorCodes";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;

    const users = await prisma.user.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    return sendSuccess(
      { page, limit, users },
      "Users fetched successfully"
    );
  } catch (err) {
    return sendError(
      "Failed to fetch users",
      ERROR_CODES.DATABASE_FAILURE,
      500,
      err
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.email || !body.name)
      return sendError(
        "Missing required fields",
        ERROR_CODES.VALIDATION_ERROR,
        400
      );

    const user = await prisma.user.create({ data: body });

    return sendSuccess(user, "User created successfully", 201);
  } catch (err) {
    return sendError(
      "User creation failed",
      ERROR_CODES.INTERNAL_ERROR,
      500,
      err
    );
  }
}
