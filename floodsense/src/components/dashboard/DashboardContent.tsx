'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Container } from '@/components/container';
import { DashboardGreeting } from '@/components/dashboard-greeting';
import { AdvancedFloodRiskMapWrapper } from '@/components/maps/AdvancedFloodRiskMapWrapper';
import { useLocation } from '@/context/LocationContext';
import {
  useDataRefresh,
  useSensorCountdown,
  usePageVisible,
  REFRESH_INTERVALS,
} from '@/hooks/useDataRefresh';

const imagery = {
  dashboard:
    'https://images.pexels.com/photos/2179608/pexels-photo-2179608.jpeg?auto=compress&cs=tinysrgb&w=2000',
};

function formatTime(date: Date | null): string {
  if (!date) return '—';
  const sec = Math.floor((Date.now() - date.getTime()) / 1000);
  if (sec < 60) return 'Just now';
  if (sec < 3600) return `${Math.floor(sec / 60)}m ago`;
  if (sec < 86400) return `${Math.floor(sec / 3600)}h ago`;
  return date.toLocaleTimeString();
}

export function DashboardContent() {
  const { latitude, longitude, isLive, status: locStatus, errorMessage, refresh } = useLocation();
  const visible = usePageVisible();
  const {
    floodRisk,
    weather,
    communityUpdates,
    lastUpdated,
    loading,
    refreshAll,
  } = useDataRefresh(latitude, longitude);
  const sensorCountdown = useSensorCountdown(lastUpdated.floodRisk);

  const center: [number, number] = [longitude, latitude];
  const userPosition: [number, number] = [longitude, latitude];

  const stats = [
    {
      label: 'Active alerts',
      value: communityUpdates?.updates?.length?.toString() ?? '—',
      tone: 'warning' as const,
    },
    {
      label: 'Teams deployed',
      value: '8',
      tone: 'info' as const,
    },
    {
      label: 'Sensors healthy',
      value: loading.floodRisk ? '…' : '94%',
      tone: 'success' as const,
      live: true,
    },
    {
      label: 'Avg. response',
      value: '2.6 min',
      tone: 'neutral' as const,
    },
  ];

  return (
    <div className="bg-background">
      <Container className="py-12 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center motion-safe:animate-fade-up">
          <div className="space-y-3">
            <Badge variant="info">Live operations</Badge>
            <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">
              Flood response dashboard
            </h1>
            <DashboardGreeting />
            <p className="text-muted-foreground">
              Monitor active districts, coordinate teams, and take action with clarity.
            </p>
            {locStatus === 'denied' && (
              <p className="rounded-lg border border-amber-500/50 bg-amber-500/10 px-3 py-2 text-sm text-amber-700 dark:text-amber-400">
                Location denied. Using fallback. Enable GPS for live data.
              </p>
            )}
            {locStatus === 'unavailable' && (
              <p className="rounded-lg border border-amber-500/50 bg-amber-500/10 px-3 py-2 text-sm text-amber-700 dark:text-amber-400">
                Geolocation not supported. Showing default map.
              </p>
            )}
            <div className="flex flex-wrap gap-3 pt-2">
              <Button variant="outline">Download brief</Button>
              <Link href="/preferences">
                <Button>Update settings</Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={() => refresh()}>
                {locStatus === 'loading' ? 'Locating…' : 'Refresh location'}
              </Button>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border shadow-lg">
            <Image
              src={imagery.dashboard}
              alt="River monitoring aerial photography"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 motion-safe:animate-fade-up">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase text-muted-foreground">{stat.label}</p>
                <div className="flex items-center gap-2">
                  {stat.live && visible && (
                    <span
                      className="h-2 w-2 animate-pulse rounded-full bg-emerald-500"
                      title="Live telemetry"
                    />
                  )}
                  <Badge variant={stat.tone}>{stat.tone}</Badge>
                </div>
              </div>
              <p className="mt-3 text-2xl font-semibold text-foreground">{stat.value}</p>
              {stat.live && lastUpdated.floodRisk && (
                <p className="mt-1 text-[10px] text-muted-foreground">
                  Next refresh in {sensorCountdown}s
                </p>
              )}
            </Card>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_0.7fr] motion-safe:animate-fade-up">
          <Card
            title="Active alerts"
            description="Prioritized flood warnings from nearby districts."
            action={
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground">
                  Updated {formatTime(lastUpdated.communityUpdates)}
                </span>
                <Button variant="ghost" size="sm" onClick={refreshAll}>
                  Refresh
                </Button>
              </div>
            }
          >
            <div className="space-y-4">
              {loading.communityUpdates ? (
                <div className="h-32 animate-pulse rounded-2xl bg-muted/50" />
              ) : communityUpdates?.updates?.length ? (
                communityUpdates.updates.slice(0, 5).map((alert) => (
                  <div
                    key={alert.id}
                    className="flex flex-col gap-3 rounded-2xl border border-border bg-muted/50 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="text-sm font-semibold text-foreground">{alert.district}</p>
                      <p className="text-xs text-muted-foreground">
                        {alert.title} · {alert.time}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <Badge
                        variant={
                          alert.severity === 'SEVERE' || alert.severity === 'HIGH'
                            ? 'danger'
                            : alert.severity === 'MODERATE'
                              ? 'warning'
                              : 'info'
                        }
                      >
                        {alert.severity}
                      </Badge>
                      <Badge variant="neutral">{alert.status}</Badge>
                      <Button size="sm">Assign team</Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-border bg-muted/40 p-6 text-sm text-muted-foreground">
                  No active alerts nearby.
                </div>
              )}
            </div>
          </Card>
          <Card
            title="Weather model"
            description={`Location-based forecast. Refreshes every ${REFRESH_INTERVALS.weatherModel / 60000} min.`}
          >
            <div className="space-y-4">
              {weather ? (
                <>
                  <p className="text-[10px] text-muted-foreground">
                    Updated {formatTime(lastUpdated.weather)}
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-border bg-muted/30 p-3">
                      <p className="text-xs text-muted-foreground">Temperature</p>
                      <p className="text-lg font-semibold">{weather.temperature}°C</p>
                    </div>
                    <div className="rounded-xl border border-border bg-muted/30 p-3">
                      <p className="text-xs text-muted-foreground">Precipitation</p>
                      <p className="text-lg font-semibold">{weather.precipitation} mm</p>
                    </div>
                    <div className="rounded-xl border border-border bg-muted/30 p-3">
                      <p className="text-xs text-muted-foreground">Humidity</p>
                      <p className="text-lg font-semibold">{weather.humidity}%</p>
                    </div>
                    <div className="rounded-xl border border-border bg-muted/30 p-3">
                      <p className="text-xs text-muted-foreground">Wind</p>
                      <p className="text-lg font-semibold">{weather.windSpeed} km/h</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{weather.condition}</p>
                </>
              ) : (
                <div className="h-24 animate-pulse rounded-xl bg-muted/50" />
              )}
            </div>
          </Card>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] motion-safe:animate-fade-up">
          <Card
            title="Flood Risk Intelligence Map"
            description="3D risk zones centered on your location. Live data refreshes every 30s."
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  Zones updated {formatTime(lastUpdated.floodRisk)}
                  {visible && lastUpdated.floodRisk && (
                    <span className="ml-1">· next in {sensorCountdown}s</span>
                  )}
                </span>
              </div>
              <div className="mt-2 aspect-[4/3] w-full overflow-hidden rounded-2xl">
                <AdvancedFloodRiskMapWrapper
                  center={center}
                  userPosition={userPosition}
                  floodRiskData={floodRisk}
                  isLive={isLive}
                />
              </div>
            </div>
          </Card>
          <Card
            title="Response timeline"
            description="Last 24 hours of coordinated actions."
          >
            <div className="space-y-4">
              {[
                'Flood gate Alpha closed at 16:20',
                'Community alert issued for Lower Delta',
                'Shelter readiness confirmed in Harbor East',
                'Hydrology model updated with new rainfall data',
              ].map((event) => (
                <div key={event} className="flex items-start gap-3 text-sm">
                  <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                  <p className="text-muted-foreground">{event}</p>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" className="mt-6 w-full">
              Download full report
            </Button>
          </Card>
        </div>
      </Container>
    </div>
  );
}
