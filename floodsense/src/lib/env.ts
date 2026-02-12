/**
 * Centralized environment access.
 * Server-side only. Use NEXT_PUBLIC_* for client-exposed values.
 */

function getEnv(key: string, required = false): string | undefined {
  const value = process.env[key];
  if (required && !value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const env = {
  DATABASE_URL: getEnv("DATABASE_URL", true)!,
  JWT_SECRET: getEnv("JWT_SECRET", true)!,

  REDIS_URL: getEnv("REDIS_URL") ?? "redis://localhost:6379",
  AUTH_SECRET: getEnv("AUTH_SECRET") ?? "",
  OPENWEATHER_API_KEY: getEnv("OPENWEATHER_API_KEY") ?? "",

  NEXT_PUBLIC_API_BASE_URL:
    getEnv("NEXT_PUBLIC_API_BASE_URL") ?? "http://localhost:3000/api",
};
