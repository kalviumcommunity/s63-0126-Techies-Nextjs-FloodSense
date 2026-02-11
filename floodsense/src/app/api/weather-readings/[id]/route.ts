import { NextResponse } from "next/server";

/**
 * WeatherData model was removed. This endpoint returns 410 Gone.
 */
export async function GET() {
  return NextResponse.json(
    { error: "Deprecated", message: "WeatherData model has been removed." },
    { status: 410 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: "Deprecated", message: "WeatherData model has been removed." },
    { status: 410 }
  );
}
