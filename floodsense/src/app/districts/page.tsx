import { fetchDistricts } from '@/lib/fetcher';
import { Card } from '@/components/card';
import { Navbar } from '@/components/navbar';

/**
 * SSG (Static Site Generation) Page
 * 
 * This page is statically generated at build time.
 * - No dynamic data fetching at request time
 * - Perfect for content that doesn't change frequently
 * - Fastest loading time, cached on CDN
 * 
 * Next.js automatically uses SSG when:
 * - No dynamic functions are used (cookies, headers, searchParams)
 * - No force-dynamic export
 * - Data is fetched at build time
 */
export default async function DistrictsPage() {
  // This data is fetched at BUILD TIME, not at request time
  const districts = await fetchDistricts();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Flood Districts (SSG)
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            This page uses <strong>Static Site Generation (SSG)</strong>. 
            The data is fetched and the page is generated at build time, 
            making it extremely fast and cacheable.
          </p>
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Rendering Mode:</strong> SSG (Static Site Generation)
              <br />
              <strong>Build Time:</strong> Generated once at build time
              <br />
              <strong>Cache:</strong> Static HTML cached on CDN
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {districts.map((district) => (
            <Card
              key={district.id}
              title={district.name}
              className="hover:shadow-lg transition-shadow"
            >
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Population:</span> {district.population.toLocaleString()}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Elevation:</span> {district.elevation}m
                </p>
                <p className="text-sm">
                  <span className="font-medium">Flood Prone:</span>{' '}
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      district.floodProne
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                        : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                    }`}
                  >
                    {district.floodProne ? 'Yes' : 'No'}
                  </span>
                </p>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
