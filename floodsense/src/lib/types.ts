export interface FloodAlert {
  id: string;
  district: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  waterLevel: number;
  timestamp: string;
  status: 'active' | 'resolved';
}

export interface District {
  id: string;
  name: string;
  population: number;
  elevation: number;
  floodProne: boolean;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  precipitation: number;
  windSpeed: number;
  timestamp: string;
}
