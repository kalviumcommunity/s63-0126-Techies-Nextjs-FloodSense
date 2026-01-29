import { District } from './types';

export const FLOOD_DISTRICTS: District[] = [
  { id: '1', name: 'Downtown Riverside', population: 45000, elevation: 12, floodProne: true },
  { id: '2', name: 'Coastal Bay Area', population: 32000, elevation: 8, floodProne: true },
  { id: '3', name: 'Mountain View', population: 28000, elevation: 150, floodProne: false },
  { id: '4', name: 'Valley Plains', population: 55000, elevation: 25, floodProne: true },
  { id: '5', name: 'Highland District', population: 19000, elevation: 200, floodProne: false },
];

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.floodsense.example.com';
