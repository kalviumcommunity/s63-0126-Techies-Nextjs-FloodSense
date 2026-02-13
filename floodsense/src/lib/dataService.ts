/**
 * Location-based data fetching for FloodSense.
 * All fetches use user coordinates — no hardcoded lat/lng.
 */

export interface FloodRiskZone {
  id: string;
  risk: 'high' | 'medium' | 'low';
  name: string;
  waterLevel: string;
  coordinates: number[][];
}

export interface FloodRiskPayload {
  zones: FloodRiskZone[];
  heatmapPoints: { coordinates: [number, number]; intensity: number }[];
  criticalAlert?: { coordinates: [number, number]; message: string };
}

export interface WeatherModelPayload {
  temperature: number;
  humidity: number;
  precipitation: number;
  windSpeed: number;
  pressure: number;
  condition: string;
}

export interface CommunityUpdate {
  id: string;
  district: string;
  severity: string;
  title: string;
  message: string;
  time: string;
  status: string;
}

export interface CommunityUpdatesPayload {
  updates: CommunityUpdate[];
}

/** Fetch flood risk data for given coordinates */
export async function fetchFloodRisk(
  lat: number,
  lng: number
): Promise<FloodRiskPayload> {
  const res = await fetch(
    `/api/location/flood-risk?lat=${encodeURIComponent(lat)}&lng=${encodeURIComponent(lng)}`
  );
  if (!res.ok) throw new Error('Failed to fetch flood risk');
  const json = await res.json();
  return json.data ?? json;
}

/** Fetch weather model data for given coordinates */
export async function fetchWeatherModel(
  lat: number,
  lng: number
): Promise<WeatherModelPayload> {
  const res = await fetch(
    `/api/location/weather?lat=${encodeURIComponent(lat)}&lng=${encodeURIComponent(lng)}`
  );
  if (!res.ok) throw new Error('Failed to fetch weather');
  const json = await res.json();
  return json.data ?? json;
}

/** Fetch community updates (alerts) near given coordinates */
export async function fetchCommunityUpdates(
  lat: number,
  lng: number,
  radiusKm = 50
): Promise<CommunityUpdatesPayload> {
  const res = await fetch(
    `/api/location/community-updates?lat=${encodeURIComponent(lat)}&lng=${encodeURIComponent(lng)}&radius=${radiusKm}`
  );
  if (!res.ok) throw new Error('Failed to fetch community updates');
  const json = await res.json();
  return json.data ?? json;
}
