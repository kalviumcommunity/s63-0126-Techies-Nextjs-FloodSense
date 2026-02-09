import { sendError } from "@/lib/responseHandler";
import { ERROR_CODES } from "@/lib/errorCodes";
import { logger } from "@/lib/logger";

export const handleApiError = (
  error: unknown,
  message = "Something went wrong",
  status = 500,
  code = ERROR_CODES.INTERNAL_ERROR
) => {
  logger.error(message, error);

  const safeMessage =
    process.env.NODE_ENV === "development" ? message : "Unexpected error";

  return sendError(safeMessage, code, status, error);
};
