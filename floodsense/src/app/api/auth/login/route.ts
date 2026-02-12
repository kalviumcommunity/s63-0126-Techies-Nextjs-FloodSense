import { prisma } from "@/lib/prisma";
import { sendError, sendSuccess } from "@/lib/responseHandler";
import { ERROR_CODES } from "@/lib/errorCodes";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { logger } from "@/lib/logger";

const BCRYPT_HASH_PREFIX = /^\$2[aby]\$/;

function isBcryptHash(value: string): boolean {
  return BCRYPT_HASH_PREFIX.test(value);
}

export async function POST(req: Request) {
  try {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret || jwtSecret.length < 16) {
      logger.error("Login: JWT_SECRET is missing or too short");
      return sendError(
        "Server configuration error",
        ERROR_CODES.INTERNAL_ERROR,
        500
      );
    }

    const body = await req.json();
    const { email, password } = body ?? {};

    if (!email || !password) {
      logger.warn("Login: missing email or password");
      return sendError(
        "Email and password are required",
        ERROR_CODES.VALIDATION_ERROR,
        400
      );
    }

    const trimmedEmail = String(email).trim().toLowerCase();
    const plainPassword = String(password);

    const user = await prisma.user.findUnique({
      where: { email: trimmedEmail },
    });

    if (!user) {
      logger.warn("Login: user not found", { email: trimmedEmail });
      return sendError(
        "Invalid email or password",
        ERROR_CODES.NOT_FOUND,
        401
      );
    }

    if (!isBcryptHash(user.password)) {
      logger.error("Login: user has plain-text password (migration needed)", {
        userId: user.id,
        email: user.email,
      });
      return sendError(
        "Account security upgrade required. Please sign up again with a new password.",
        ERROR_CODES.VALIDATION_ERROR,
        401
      );
    }

    const isValid = await bcrypt.compare(plainPassword, user.password);

    if (!isValid) {
      logger.warn("Login: invalid password", { email: trimmedEmail });
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
    logger.error("Login: unexpected error", err);
    return sendError(
      "Login failed",
      ERROR_CODES.INTERNAL_ERROR,
      500,
      err instanceof Error ? err.message : String(err)
    );
  }
}
