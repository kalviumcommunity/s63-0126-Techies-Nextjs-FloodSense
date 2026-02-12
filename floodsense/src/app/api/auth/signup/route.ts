import { prisma } from "@/lib/prisma";
import { sendError, sendSuccess } from "@/lib/responseHandler";
import { ERROR_CODES } from "@/lib/errorCodes";
import bcrypt from "bcryptjs";
import { logger } from "@/lib/logger";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = body ?? {};

    if (!name || !email || !password) {
      return sendError(
        "Name, email, and password are required",
        ERROR_CODES.VALIDATION_ERROR,
        400
      );
    }

    const trimmedName = String(name).trim();
    const trimmedEmail = String(email).trim().toLowerCase();
    const trimmedPassword = String(password);

    if (!trimmedName) {
      return sendError("Name cannot be empty", ERROR_CODES.VALIDATION_ERROR, 400);
    }

    if (!EMAIL_REGEX.test(trimmedEmail)) {
      return sendError("Invalid email format", ERROR_CODES.VALIDATION_ERROR, 400);
    }

    if (trimmedPassword.length < MIN_PASSWORD_LENGTH) {
      return sendError(
        `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
        ERROR_CODES.VALIDATION_ERROR,
        400
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: trimmedEmail },
    });

    if (existingUser) {
      return sendError(
        "A user with this email already exists",
        ERROR_CODES.VALIDATION_ERROR,
        409
      );
    }

    const hashedPassword = await bcrypt.hash(trimmedPassword, 10);

    const user = await prisma.user.create({
      data: {
        name: trimmedName,
        email: trimmedEmail,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    return sendSuccess(user, "Account created successfully", 201);
  } catch (err) {
    logger.error("Signup failed", err);
    return sendError(
      "Signup failed",
      ERROR_CODES.INTERNAL_ERROR,
      500,
      err instanceof Error ? err.message : String(err)
    );
  }
}
