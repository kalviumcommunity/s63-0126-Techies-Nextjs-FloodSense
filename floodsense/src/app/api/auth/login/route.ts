import { prisma } from "@/lib/prisma";
import { sendError, sendSuccess } from "@/lib/responseHandler";
import { ERROR_CODES } from "@/lib/errorCodes";
import { env } from "@/lib/env";
import { handleApiError } from "@/lib/apiErrorHandler";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body ?? {};

    if (!email || !password) {
      return sendError(
        "Email and password are required",
        ERROR_CODES.VALIDATION_ERROR,
        400
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return sendError(
        "Invalid email or password",
        ERROR_CODES.NOT_FOUND,
        401
      );
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return sendError(
        "Invalid email or password",
        ERROR_CODES.VALIDATION_ERROR,
        401
      );
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      env.JWT_SECRET,
      { expiresIn: "1h" }
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
    return handleApiError(err, "Login failed");
  }
}
