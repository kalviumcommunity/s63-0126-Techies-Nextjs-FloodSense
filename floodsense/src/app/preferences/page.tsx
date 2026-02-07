import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Container } from '@/components/container';

export default function PreferencesPage() {
  return (
    <div className="bg-background">
      <Container className="py-12 lg:py-16">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between motion-safe:animate-fade-up">
          <div>
            <Badge variant="info">Preferences</Badge>
            <h1 className="mt-3 text-3xl font-semibold text-foreground">
              Operational settings
            </h1>
            <p className="mt-2 text-muted-foreground">
              Fine-tune alerts, notifications, and data cadence for every
              response team.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline">Reset defaults</Button>
            <Button>Save changes</Button>
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2 motion-safe:animate-fade-up">
          <Card
            title="Alert routing"
            description="Control escalation and notification priority."
          >
            <div className="space-y-4 text-sm text-muted-foreground">
              {[
                'Escalate critical alerts to on-call lead',
                'Notify local response teams for high severity',
                'Send nightly summaries to leadership',
              ].map((item) => (
                <label
                  key={item}
                  className="flex items-center justify-between rounded-2xl border border-border bg-muted/40 px-4 py-3"
                >
                  <span>{item}</span>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 accent-primary"
                  />
                </label>
              ))}
            </div>
          </Card>
          <Card
            title="Notification channels"
            description="Choose where critical updates are delivered."
          >
            <div className="space-y-4 text-sm text-muted-foreground">
              {[
                { label: 'SMS alerts', status: 'Enabled' },
                { label: 'Email briefings', status: 'Enabled' },
                { label: 'Radio dispatch', status: 'Optional' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-2xl border border-border bg-muted/40 px-4 py-3"
                >
                  <span>{item.label}</span>
                  <Badge variant="neutral">{item.status}</Badge>
                </div>
              ))}
            </div>
          </Card>
          <Card
            title="Data freshness"
            description="Set how frequently data sources refresh."
          >
            <div className="space-y-4">
              {[
                { label: 'Sensor telemetry', value: 'Every 30 seconds' },
                { label: 'Weather model', value: 'Every 5 minutes' },
                { label: 'Community updates', value: 'Every 15 minutes' },
              ].map((item) => (
                <div key={item.label} className="text-sm">
                  <p className="font-semibold text-foreground">{item.label}</p>
                  <p className="text-muted-foreground">{item.value}</p>
                </div>
              ))}
              <Button variant="outline" size="sm">
                Adjust cadence
              </Button>
            </div>
          </Card>
          <Card
            title="Security and access"
            description="Manage trusted devices and permissions."
          >
            <div className="space-y-4 text-sm text-muted-foreground">
              <div className="rounded-2xl border border-border bg-muted/40 px-4 py-3">
                <p className="font-semibold text-foreground">Active devices</p>
                <p>8 trusted devices - Last verified 2 hours ago</p>
              </div>
              <div className="rounded-2xl border border-border bg-muted/40 px-4 py-3">
                <p className="font-semibold text-foreground">Access policy</p>
                <p>Multi-factor authentication required for all admins.</p>
              </div>
              <Button variant="outline" size="sm">
                Review access logs
              </Button>
            </div>
          </Card>
        </div>
      </Container>
    </div>
  );
}
