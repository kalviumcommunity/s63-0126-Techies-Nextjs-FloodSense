import { NextResponse } from "next/server";

export const sendSuccess = (
  data: any = null,
  message = "Success",
  status = 200
) => {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
    },
    { status }
  );
};

export const sendError = (
  message = "Something went wrong",
  code = "INTERNAL_ERROR",
  status = 500,
  details?: any
) => {
  return NextResponse.json(
    {
      success: false,
      message,
      error: {
        code,
        details: process.env.NODE_ENV === "development" ? details : undefined,
      },
      timestamp: new Date().toISOString(),
    },
    { status }
  );
};
