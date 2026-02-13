import { NextRequest, NextResponse } from 'next/server';
import { sendSuccess } from '@/lib/responseHandler';

/**
 * Returns weather model data for given coordinates.
 * In production, integrate with OpenWeatherMap, Open-Meteo, etc.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = parseFloat(searchParams.get('lat') ?? '28.6139');
  const lng = parseFloat(searchParams.get('lng') ?? '77.209');

  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    return NextResponse.json(
      { success: false, message: 'Invalid lat or lng' },
      { status: 400 }
    );
  }

  const seed = Math.sin(lat * 7 + lng * 13) * 0.5 + 0.5;
  const data = {
    temperature: Math.round(18 + seed * 12),
    humidity: Math.round(65 + seed * 25),
    precipitation: Math.round(seed * 25),
    windSpeed: Math.round(8 + seed * 12),
    pressure: Math.round(1008 + seed * 15),
    condition: seed > 0.7 ? 'Heavy rain' : seed > 0.4 ? 'Light rain' : 'Partly cloudy',
  };

  return sendSuccess(data);
}
