/**
 * Shared types for API responses and domain models.
 */

export interface FloodAlert {
  id: string;
  district: string;
  riskLevel: "low" | "medium" | "high" | "critical";
  waterLevel: number;
  timestamp: string;
  status: "active" | "resolved";
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  precipitation: number;
  windSpeed: number;
  timestamp: string;
}
