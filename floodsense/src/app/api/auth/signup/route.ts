import { prisma } from "@/lib/prisma";
import { sendError, sendSuccess } from "@/lib/responseHandler";
import { ERROR_CODES } from "@/lib/errorCodes";
import bcrypt from "bcryptjs";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

export async function POST(req: Request) {
  console.log("[Auth/Signup] POST request received");
  try {
    const body = await req.json();
    const { name, email, password } = body ?? {};
    console.log("[Auth/Signup] Body parsed:", { hasName: !!name, hasEmail: !!email, hasPassword: !!password });

    if (!name || !email || !password) {
      console.log("[Auth/Signup] Validation failed: missing fields");
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
      console.log("[Auth/Signup] Validation failed: invalid email format");
      return sendError("Invalid email format", ERROR_CODES.VALIDATION_ERROR, 400);
    }

    if (trimmedPassword.length < MIN_PASSWORD_LENGTH) {
      console.log("[Auth/Signup] Validation failed: password too short");
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
      console.log("[Auth/Signup] User already exists:", trimmedEmail);
      return sendError(
        "A user with this email already exists",
        ERROR_CODES.VALIDATION_ERROR,
        409
      );
    }

    const hashedPassword = await bcrypt.hash(trimmedPassword, 10);
    console.log("[Auth/Signup] Password hashed, creating user...");

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

    console.log("[Auth/Signup] User created successfully:", user.id);
    return sendSuccess(user, "Account created successfully", 201);
  } catch (err) {
    console.error("[Auth/Signup] Error:", err);
    return sendError(
      "Signup failed",
      ERROR_CODES.INTERNAL_ERROR,
      500,
      err instanceof Error ? err.message : String(err)
    );
  }
}
