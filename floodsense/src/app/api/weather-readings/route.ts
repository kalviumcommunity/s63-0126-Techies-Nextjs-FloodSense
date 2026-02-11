import { NextResponse } from "next/server";

/**
 * WeatherData model was removed in schema update.
 * This endpoint returns empty data to maintain API compatibility.
 * Consider migrating to a dedicated weather service if needed.
 */
export async function GET() {
  return NextResponse.json([]);
}

export async function POST() {
  return NextResponse.json(
    {
      error: "Weather readings API deprecated",
      message:
        "WeatherData model has been removed. Use a dedicated weather service instead.",
    },
    { status: 410 }
  );
}
