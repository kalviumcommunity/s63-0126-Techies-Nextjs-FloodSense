import { fetchWeatherData } from '@/lib/fetcher';
import { FLOOD_DISTRICTS } from '@/lib/constants';
import { Card } from '@/components/card';
import { Navbar } from '@/components/navbar';

/**
 * ISR (Incremental Static Regeneration) Page
 * 
 * This page uses ISR to regenerate static pages periodically.
 * - Page is statically generated at build time
 * - Regenerated every 60 seconds (revalidate: 60)
 * - Best of both worlds: fast static pages with fresh data
 * 
 * Next.js uses ISR when:
 * - fetch() is called with revalidate option
 * - Or route segment config has revalidate export
 */
export const revalidate = 60; // Regenerate page every 60 seconds

export default async function WeatherPage() {
  // Fetch weather data for all districts
  // This will be cached and regenerated every 60 seconds
  const weatherPromises = FLOOD_DISTRICTS.map(district =>
    fetchWeatherData(district.id)
  );
  const weatherData = await Promise.all(weatherPromises);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Weather Data (ISR)
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            This page uses <strong>Incremental Static Regeneration (ISR)</strong>. 
            The page is statically generated but regenerated every 60 seconds 
            to keep the weather data fresh while maintaining fast load times.
          </p>
          <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-sm text-green-800 dark:text-green-200">
              <strong>Rendering Mode:</strong> ISR (Incremental Static Regeneration)
              <br />
              <strong>revalidate:</strong> 60 seconds
              <br />
              <strong>Cache:</strong> Static HTML regenerated every 60 seconds
              <br />
              <strong>Last Generated:</strong> {new Date().toLocaleString()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FLOOD_DISTRICTS.map((district, index) => {
            const weather = weatherData[index];
            return (
              <Card
                key={district.id}
                title={district.name}
                className="hover:shadow-lg transition-shadow"
              >
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Temperature:</span> {weather.temperature}°C
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Humidity:</span> {weather.humidity.toFixed(1)}%
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Precipitation:</span> {weather.precipitation.toFixed(2)}mm
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Wind Speed:</span> {weather.windSpeed.toFixed(1)} km/h
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                    Updated: {new Date(weather.timestamp).toLocaleString()}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}
