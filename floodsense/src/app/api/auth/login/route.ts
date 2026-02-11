import { prisma } from "@/lib/prisma";
import { sendError, sendSuccess } from "@/lib/responseHandler";
import { ERROR_CODES } from "@/lib/errorCodes";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  console.log("[Auth/Login] POST request received");
  try {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret || jwtSecret.length < 16) {
      console.error("[Auth/Login] JWT_SECRET is missing or too short");
      return sendError(
        "Server configuration error",
        ERROR_CODES.INTERNAL_ERROR,
        500
      );
    }

    const body = await req.json();
    const { email, password } = body ?? {};
    console.log("[Auth/Login] Body parsed:", { hasEmail: !!email, hasPassword: !!password });

    if (!email || !password) {
      console.log("[Auth/Login] Validation failed: missing fields");
      return sendError(
        "Email and password are required",
        ERROR_CODES.VALIDATION_ERROR,
        400
      );
    }

    const trimmedEmail = String(email).trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email: trimmedEmail },
    });

    if (!user) {
      console.log("[Auth/Login] User not found:", trimmedEmail);
      return sendError(
        "Invalid email or password",
        ERROR_CODES.NOT_FOUND,
        401
      );
    }

    const isValid = await bcrypt.compare(String(password), user.password);

    if (!isValid) {
      console.log("[Auth/Login] Invalid password for:", trimmedEmail);
      return sendError(
        "Invalid email or password",
        ERROR_CODES.VALIDATION_ERROR,
        401
      );
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      jwtSecret,
      { expiresIn: "24h" }
    );

    console.log("[Auth/Login] Login successful:", user.id);
    return sendSuccess(
      {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      "Login successful"
    );
  } catch (err) {
    console.error("[Auth/Login] Error:", err);
    return sendError(
      "Login failed",
      ERROR_CODES.INTERNAL_ERROR,
      500,
      err instanceof Error ? err.message : String(err)
    );
  }
}
