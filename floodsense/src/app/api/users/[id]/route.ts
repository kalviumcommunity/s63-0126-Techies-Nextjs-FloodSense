import { prisma } from "@/lib/prisma";
import { sendSuccess, sendError } from "@/lib/responseHandler";
import { ERROR_CODES } from "@/lib/errorCodes";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user)
      return sendError(
        "User not found",
        ERROR_CODES.NOT_FOUND,
        404
      );

    return sendSuccess(user, "User fetched successfully");
  } catch (err) {
    return sendError("Failed", ERROR_CODES.INTERNAL_ERROR, 500, err);
  }
}


export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.user.delete({ where: { id } });

    return sendSuccess(null, "User deleted successfully");
  } catch (err) {
    return sendError("Delete failed", ERROR_CODES.INTERNAL_ERROR, 500, err);
  }
}
