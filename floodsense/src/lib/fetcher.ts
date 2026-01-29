import { FloodAlert, District, WeatherData } from './types';
import { FLOOD_DISTRICTS } from './constants';

/**
 * Simulates API delay
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Fetches flood alerts with caching configuration
 * Used for SSG, SSR, and ISR demonstrations
 */
export async function fetchFloodAlerts(): Promise<FloodAlert[]> {
  // Simulate API call
  await delay(100);
  
  return [
    {
      id: '1',
      district: 'Downtown Riverside',
      riskLevel: 'high',
      waterLevel: 2.5,
      timestamp: new Date().toISOString(),
      status: 'active',
    },
    {
      id: '2',
      district: 'Coastal Bay Area',
      riskLevel: 'critical',
      waterLevel: 3.8,
      timestamp: new Date().toISOString(),
      status: 'active',
    },
    {
      id: '3',
      district: 'Valley Plains',
      riskLevel: 'medium',
      waterLevel: 1.2,
      timestamp: new Date().toISOString(),
      status: 'active',
    },
  ];
}

/**
 * Fetches district data
 * Used for static generation
 */
export async function fetchDistricts(): Promise<District[]> {
  await delay(50);
  return FLOOD_DISTRICTS;
}

/**
 * Fetches weather data for a specific district
 * Used for dynamic rendering
 */
export async function fetchWeatherData(districtId: string): Promise<WeatherData> {
  await delay(200);
  
  return {
    temperature: Math.floor(Math.random() * 15) + 20,
    humidity: Math.floor(Math.random() * 40) + 50,
    precipitation: Math.random() * 10,
    windSpeed: Math.random() * 20,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Fetches a single district by ID
 */
export async function fetchDistrictById(id: string): Promise<District | null> {
  await delay(100);
  return FLOOD_DISTRICTS.find(d => d.id === id) || null;
}
