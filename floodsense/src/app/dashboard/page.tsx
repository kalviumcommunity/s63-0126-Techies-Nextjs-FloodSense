import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Container } from '@/components/container';
import { DashboardGreeting } from '@/components/dashboard-greeting';

const stats = [
  { label: 'Active alerts', value: '12', tone: 'warning' as const },
  { label: 'Teams deployed', value: '8', tone: 'info' as const },
  { label: 'Sensors healthy', value: '94%', tone: 'success' as const },
  { label: 'Avg. response', value: '2.6 min', tone: 'neutral' as const },
];

const alerts = [
  {
    id: 'AL-204',
    district: 'Lower Delta',
    severity: 'High',
    time: '3 min ago',
    status: 'Active',
  },
  {
    id: 'AL-198',
    district: 'Harbor East',
    severity: 'Moderate',
    time: '12 min ago',
    status: 'Monitoring',
  },
  {
    id: 'AL-193',
    district: 'Riverwalk',
    severity: 'Critical',
    time: '18 min ago',
    status: 'Deploy',
  },
];

const imagery = {
  dashboard:
    'https://images.pexels.com/photos/2179608/pexels-photo-2179608.jpeg?auto=compress&cs=tinysrgb&w=2000',
};

export default function DashboardPage() {
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
              Monitor active districts, coordinate teams, and take action with
              clarity.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button variant="outline">Download brief</Button>
              <Link href="/preferences">
                <Button>Update settings</Button>
              </Link>
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
                <p className="text-xs uppercase text-muted-foreground">
                  {stat.label}
                </p>
                <Badge variant={stat.tone}>{stat.tone}</Badge>
              </div>
              <p className="mt-3 text-2xl font-semibold text-foreground">
                {stat.value}
              </p>
            </Card>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_0.7fr] motion-safe:animate-fade-up">
          <Card
            title="Active alerts"
            description="Prioritized flood warnings across monitored districts."
            action={<Button variant="ghost" size="sm">View all</Button>}
          >
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex flex-col gap-3 rounded-2xl border border-border bg-muted/50 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {alert.district}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {alert.id} - {alert.time}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <Badge
                      variant={
                        alert.severity === 'Critical'
                          ? 'danger'
                          : alert.severity === 'High'
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
              ))}
            </div>
          </Card>
          <Card
            title="Operational readiness"
            description="Live resources and coverage zones."
          >
            <div className="space-y-4">
              {[
                { label: 'Rapid response units', value: '18 available' },
                { label: 'Mobile barriers', value: '32 deployed' },
                { label: 'Evacuation shelters', value: '6 open' },
                { label: 'Drone coverage', value: '83% online' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-semibold text-foreground">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-2xl border border-dashed border-border p-4 text-sm text-muted-foreground">
              No unresolved incidents in queue. All critical actions are up to
              date.
            </div>
          </Card>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] motion-safe:animate-fade-up">
          <Card
            title="Impact map"
            description="Citywide flood risk modeling and response zones."
          >
            <div className="mt-2 aspect-[4/3] w-full rounded-2xl border border-border bg-[radial-gradient(circle_at_top,_rgba(31,91,216,0.2),_transparent_60%)] p-4 text-sm text-muted-foreground">
              <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-border">
                Map visualization placeholder
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span className="rounded-full bg-muted px-3 py-1">High risk</span>
              <span className="rounded-full bg-muted px-3 py-1">Moderate</span>
              <span className="rounded-full bg-muted px-3 py-1">Safe</span>
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
                <div
                  key={event}
                  className="flex items-start gap-3 text-sm"
                >
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

        <div className="mt-8 grid gap-6 lg:grid-cols-3 motion-safe:animate-fade-up">
          <Card title="Empty state preview" description="When there are no active alerts.">
            <div className="rounded-2xl border border-dashed border-border bg-muted/40 p-6 text-sm text-muted-foreground">
              All clear. No new incidents have been reported in the last 12
              hours.
            </div>
          </Card>
          <Card title="Loading state preview" description="Skeleton shimmer for data-heavy panels.">
            <div className="space-y-3">
              <div className="h-3 w-2/3 animate-pulse rounded-full bg-muted" />
              <div className="h-3 w-1/2 animate-pulse rounded-full bg-muted" />
              <div className="h-3 w-3/4 animate-pulse rounded-full bg-muted" />
            </div>
          </Card>
          <Card title="Escalation readiness" description="Next steps for the on-call lead.">
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="rounded-2xl border border-border bg-muted/40 p-4">
                Confirm bridge closures and notify transit.
              </div>
              <div className="rounded-2xl border border-border bg-muted/40 p-4">
                Stage mobile barriers at Lower Delta checkpoints.
              </div>
            </div>
          </Card>
        </div>
      </Container>
    </div>
  );
}
