import Image from 'next/image';
import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Container } from '@/components/container';

const imagery = {
  profile:
    'https://images.pexels.com/photos/3964648/pexels-photo-3964648.jpeg?auto=compress&cs=tinysrgb&w=2000',
};

export default function ProfilePage() {
  return (
    <div className="bg-background">
      <Container className="py-12 lg:py-16">
        <div className="relative mb-8 aspect-[5/2] overflow-hidden rounded-3xl border border-border shadow-lg">
          <Image
            src={imagery.profile}
            alt="Weather radar dome and monitoring facility"
            fill
            className="object-cover"
            loading="lazy"
          />
        </div>
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <Card>
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-foreground shadow-sm">
                AR
              </div>
              <div>
                <p className="text-lg font-semibold text-foreground">
                  Avery Rivers
                </p>
                <p className="text-sm text-muted-foreground">
                  Regional Operations Lead
                </p>
                <Badge variant="success" className="mt-2">
                  On call
                </Badge>
              </div>
            </div>
            <div className="mt-6 space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center justify-between">
                <span>Email</span>
                <span className="font-semibold text-foreground">
                  arivers@response.gov
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Phone</span>
                <span className="font-semibold text-foreground">
                  +1 (555) 482-1902
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Region</span>
                <span className="font-semibold text-foreground">
                  Coastal North
                </span>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button size="sm">Edit profile</Button>
              <Button size="sm" variant="outline">
                Manage access
              </Button>
            </div>
          </Card>

          <div className="space-y-6 motion-safe:animate-fade-up">
            <Card
              title="Current focus"
              description="Active initiatives and response readiness."
            >
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="rounded-2xl border border-border bg-muted/40 px-4 py-3">
                  <p className="font-semibold text-foreground">
                    Lower Delta surge planning
                  </p>
                  <p>Coordinating barrier deployment for Zone 4.</p>
                </div>
                <div className="rounded-2xl border border-border bg-muted/40 px-4 py-3">
                  <p className="font-semibold text-foreground">
                    Community outreach
                  </p>
                  <p>Preparing public advisory for weekend rainfall.</p>
                </div>
              </div>
            </Card>
            <Card
              title="Recent activity"
              description="Latest actions across your team."
            >
              <div className="space-y-4 text-sm text-muted-foreground">
                {[
                  'Approved escalation for Harbor East alert',
                  'Reviewed field sensor anomalies in Sector 3',
                  'Scheduled debrief with Emergency Services',
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3"
                  >
                    <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                    <p>{item}</p>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="mt-6 w-full">
                View full log
              </Button>
            </Card>
            <Card title="Empty state" description="When there are no scheduled shifts.">
              <div className="rounded-2xl border border-dashed border-border bg-muted/40 p-5 text-sm text-muted-foreground">
                No shifts scheduled for the next 48 hours. You will be notified
                if new coverage is required.
              </div>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
}
