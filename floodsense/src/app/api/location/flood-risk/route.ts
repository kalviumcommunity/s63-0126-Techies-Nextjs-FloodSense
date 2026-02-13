import { NextRequest, NextResponse } from 'next/server';
import { sendSuccess } from '@/lib/responseHandler';

/** ~0.01 deg ≈ 1 km at mid-latitudes */
function offsetCoord(coord: number, km: number): number {
  return coord + (km / 111) * (coord >= 0 ? 1 : -1);
}

/**
 * Returns flood risk zones and heatmap points centered on user location.
 * In production, this would query a real flood model API.
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

  const zones = [
    {
      id: 'zone-1',
      risk: 'high' as const,
      name: 'North District Hub',
      waterLevel: '4.2m',
      coordinates: [
        [offsetCoord(lng, -1.5), offsetCoord(lat, -0.7)],
        [offsetCoord(lng, 0.5), offsetCoord(lat, -0.7)],
        [offsetCoord(lng, 0.5), offsetCoord(lat, 0.3)],
        [offsetCoord(lng, -1.5), offsetCoord(lat, 0.3)],
        [offsetCoord(lng, -1.5), offsetCoord(lat, -0.7)],
      ],
    },
    {
      id: 'zone-2',
      risk: 'medium' as const,
      name: 'Eastern Corridor',
      waterLevel: '2.1m',
      coordinates: [
        [offsetCoord(lng, 0.6), offsetCoord(lat, -0.4)],
        [offsetCoord(lng, 1.8), offsetCoord(lat, -0.4)],
        [offsetCoord(lng, 1.8), offsetCoord(lat, 0.5)],
        [offsetCoord(lng, 0.6), offsetCoord(lat, 0.5)],
        [offsetCoord(lng, 0.6), offsetCoord(lat, -0.4)],
      ],
    },
    {
      id: 'zone-3',
      risk: 'low' as const,
      name: 'South Safe Zone',
      waterLevel: '0.8m',
      coordinates: [
        [offsetCoord(lng, -1.2), offsetCoord(lat, -2.0)],
        [offsetCoord(lng, -0.2), offsetCoord(lat, -2.0)],
        [offsetCoord(lng, -0.2), offsetCoord(lat, -1.2)],
        [offsetCoord(lng, -1.2), offsetCoord(lat, -1.2)],
        [offsetCoord(lng, -1.2), offsetCoord(lat, -2.0)],
      ],
    },
  ];

  const heatmapPoints = [
    { coordinates: [offsetCoord(lng, -0.7), offsetCoord(lat, -0.2)] as [number, number], intensity: 0.9 },
    { coordinates: [lng, lat] as [number, number], intensity: 1 },
    { coordinates: [offsetCoord(lng, 0.2), offsetCoord(lat, -0.4)] as [number, number], intensity: 0.85 },
    { coordinates: [offsetCoord(lng, 0.8), offsetCoord(lat, 0.2)] as [number, number], intensity: 0.6 },
    { coordinates: [offsetCoord(lng, -0.9), offsetCoord(lat, -1.0)] as [number, number], intensity: 0.3 },
  ];

  const criticalAlert = {
    coordinates: [offsetCoord(lng, 0.1), offsetCoord(lat, -0.3)] as [number, number],
    message: 'Flood Zone Alpha · 4.2m · Evacuate',
  };

  return sendSuccess({
    zones,
    heatmapPoints,
    criticalAlert,
  });
}
