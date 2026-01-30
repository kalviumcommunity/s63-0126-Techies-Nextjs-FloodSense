/**
 * Centralized environment access
 * Prevents accidental exposure of secrets
 */

export const env = {
  DATABASE_URL: process.env.DATABASE_URL!,
  REDIS_URL: process.env.REDIS_URL!,
  AUTH_SECRET: process.env.AUTH_SECRET!,
  OPENWEATHER_API_KEY: process.env.OPENWEATHER_API_KEY!,

  // Public
  NEXT_PUBLIC_API_BASE_URL:
    process.env.NEXT_PUBLIC_API_BASE_URL!,
};
