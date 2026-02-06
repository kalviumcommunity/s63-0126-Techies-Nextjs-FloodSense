import { prisma } from "@/lib/prisma";
import { sendSuccess, sendError } from "@/lib/responseHandler";
import { ERROR_CODES } from "@/lib/errorCodes";

export async function GET() {
  try {
    const districts = await prisma.district.findMany({
      orderBy: { name: "asc" },
    });

    return sendSuccess(districts, "Districts fetched successfully");
  } catch (err) {
    return sendError(
      "Failed to fetch districts",
      ERROR_CODES.DATABASE_FAILURE,
      500,
      err
    );
  }
  
}
