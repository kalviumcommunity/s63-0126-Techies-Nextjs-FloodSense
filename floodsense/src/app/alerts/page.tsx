import { fetchFloodAlerts } from '@/lib/fetcher';
import { Card } from '@/components/card';
import { Navbar } from '@/components/navbar';

/**
 * SSR (Server-Side Rendering) Page
 * 
 * This page is rendered on the server for each request.
 * - Data is fetched fresh on every request
 * - Perfect for personalized or frequently changing data
 * - Uses force-dynamic to disable caching
 * 
 * Next.js uses SSR when:
 * - force-dynamic is exported
 * - Dynamic functions are used (cookies, headers, searchParams)
 * - fetch with cache: 'no-store' or revalidate: 0
 */
export const dynamic = 'force-dynamic';

export default async function AlertsPage() {
  // This data is fetched on EVERY REQUEST (not cached)
  const alerts = await fetchFloodAlerts();

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical':
        return 'bg-red-600 text-white';
      case 'high':
        return 'bg-orange-500 text-white';
      case 'medium':
        return 'bg-yellow-500 text-white';
      case 'low':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Flood Alerts (SSR)
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            This page uses <strong>Server-Side Rendering (SSR)</strong>. 
            The data is fetched fresh on every request, ensuring you always 
            see the latest flood alert information.
          </p>
          <div className="mt-4 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <p className="text-sm text-orange-800 dark:text-orange-200">
              <strong>Rendering Mode:</strong> SSR (Server-Side Rendering)
              <br />
              <strong>force-dynamic:</strong> Exported to disable static generation
              <br />
              <strong>Cache:</strong> No caching - fresh data on every request
              <br />
              <strong>Generated At:</strong> {new Date().toLocaleString()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {alerts.map((alert) => (
            <Card
              key={alert.id}
              title={alert.district}
              className="hover:shadow-lg transition-shadow"
            >
              <div className="space-y-3">
                <div>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getRiskColor(alert.riskLevel)}`}>
                    {alert.riskLevel.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm">
                  <span className="font-medium">Water Level:</span> {alert.waterLevel}m
                </p>
                <p className="text-sm">
                  <span className="font-medium">Status:</span>{' '}
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      alert.status === 'active'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                        : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                    }`}
                  >
                    {alert.status}
                  </span>
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Updated: {new Date(alert.timestamp).toLocaleString()}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
