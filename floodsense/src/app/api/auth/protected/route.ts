import { sendError, sendSuccess } from "@/lib/responseHandler";
import { ERROR_CODES } from "@/lib/errorCodes";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return sendError(
        "Authorization header missing",
        ERROR_CODES.VALIDATION_ERROR,
        401
      );
    }

    const token = authHeader.replace("Bearer ", "").trim();

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret || jwtSecret.length < 16) {
      return sendError(
        "Server configuration error",
        ERROR_CODES.INTERNAL_ERROR,
        500
      );
    }
    const decoded = jwt.verify(token, jwtSecret);

    return sendSuccess(
      { decoded },
      "Token is valid"
    );
  } catch (err) {
    return sendError(
      "Invalid or expired token",
      ERROR_CODES.VALIDATION_ERROR,
      401,
      err
    );
  }
}
