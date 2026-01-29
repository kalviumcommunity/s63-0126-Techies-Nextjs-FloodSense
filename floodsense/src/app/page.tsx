import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { Card } from '@/components/card';
import { Button } from '@/components/button';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            FloodSense
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">
            Real-time Flood Risk Visualization & Alerting Platform
          </p>
          <p className="text-gray-500 dark:text-gray-500">
            Demonstrating Next.js App Router Rendering Modes
          </p>
        </div>

        <div className="mb-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Next.js Rendering Modes Implementation
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            This project demonstrates three key rendering strategies in Next.js App Router:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li><strong>SSG (Static Site Generation)</strong> - Pages generated at build time</li>
            <li><strong>SSR (Server-Side Rendering)</strong> - Pages rendered on each request</li>
            <li><strong>ISR (Incremental Static Regeneration)</strong> - Static pages regenerated periodically</li>
          </ul>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card
            title="Districts (SSG)"
            className="border-2 border-blue-200 dark:border-blue-800"
          >
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Static Site Generation - Perfect for content that doesn't change frequently.
              Generated once at build time and cached on CDN.
            </p>
            <div className="space-y-2 text-sm mb-4">
              <p><strong>Use Case:</strong> District information</p>
              <p><strong>Performance:</strong> Fastest (pre-rendered)</p>
              <p><strong>Cache:</strong> Static HTML</p>
            </div>
            <Link href="/districts">
              <Button className="w-full">View Districts</Button>
            </Link>
          </Card>

          <Card
            title="Alerts (SSR)"
            className="border-2 border-orange-200 dark:border-orange-800"
          >
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Server-Side Rendering - Fresh data on every request using force-dynamic.
              Ideal for real-time or personalized content.
            </p>
            <div className="space-y-2 text-sm mb-4">
              <p><strong>Use Case:</strong> Live flood alerts</p>
              <p><strong>Performance:</strong> Slower (server-rendered)</p>
              <p><strong>Cache:</strong> No caching</p>
            </div>
            <Link href="/alerts">
              <Button variant="secondary" className="w-full">View Alerts</Button>
            </Link>
          </Card>

          <Card
            title="Weather (ISR)"
            className="border-2 border-green-200 dark:border-green-800"
          >
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Incremental Static Regeneration - Static pages regenerated every 60 seconds.
              Best balance of performance and freshness.
            </p>
            <div className="space-y-2 text-sm mb-4">
              <p><strong>Use Case:</strong> Weather data</p>
              <p><strong>Performance:</strong> Fast (static with updates)</p>
              <p><strong>Cache:</strong> Regenerated every 60s</p>
            </div>
            <Link href="/weather">
              <Button variant="secondary" className="w-full">View Weather</Button>
            </Link>
          </Card>
        </div>

        <div className="mt-12 p-6 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Implementation Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2 text-blue-600 dark:text-blue-400">SSG Implementation</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                <li>No dynamic functions</li>
                <li>Data fetched at build time</li>
                <li>Automatic static optimization</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-orange-600 dark:text-orange-400">SSR Implementation</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                <li>export const dynamic = 'force-dynamic'</li>
                <li>Fresh data on every request</li>
                <li>No caching enabled</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-green-600 dark:text-green-400">ISR Implementation</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                <li>export const revalidate = 60</li>
                <li>Static with periodic updates</li>
                <li>Background regeneration</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
