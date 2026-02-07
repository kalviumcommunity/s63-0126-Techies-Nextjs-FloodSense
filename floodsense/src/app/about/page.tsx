import Image from 'next/image';
import { Badge } from '@/components/badge';
import { Card } from '@/components/card';
import { Container } from '@/components/container';

const values = [
  {
    title: 'Clarity over noise',
    description:
      'We prioritize calm, readable interfaces that help teams focus on what matters most.',
  },
  {
    title: 'Preparedness by design',
    description:
      'FloodSense is built to anticipate risk with predictive modeling and rapid triage.',
  },
  {
    title: 'Community-first impact',
    description:
      'Every insight is designed to protect the communities most vulnerable to flooding.',
  },
];

const imagery = {
  about:
    'https://images.pexels.com/photos/31550735/pexels-photo-31550735.jpeg?auto=compress&cs=tinysrgb&w=2000',
};

export default function AboutPage() {
  return (
    <div className="bg-background">
      <Container className="py-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-4 motion-safe:animate-fade-up">
            <Badge variant="info">About FloodSense</Badge>
            <h1 className="text-4xl font-semibold text-foreground">
              A mission-driven platform for resilient flood response.
            </h1>
            <p className="text-muted-foreground">
              FloodSense combines hydrology, operations, and community insights
              into a unified experience. We help teams anticipate risk, align
              resources, and communicate quickly.
            </p>
          </div>
          <div className="space-y-4">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border shadow-lg">
              <Image
                src={imagery.about}
                alt="Aerial view of river delta infrastructure"
                fill
                className="object-cover"
                loading="lazy"
              />
            </div>
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <p className="text-sm text-muted-foreground">Platform reach</p>
              <p className="mt-2 text-3xl font-semibold text-foreground">
                26 regions supported
              </p>
              <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span>Incident response uptime</span>
                  <span className="font-semibold text-foreground">99.9%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Average alert latency</span>
                  <span className="font-semibold text-foreground">1.8 min</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Community partners</span>
                  <span className="font-semibold text-foreground">140+</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {values.map((value) => (
            <Card key={value.title} title={value.title}>
              {value.description}
            </Card>
          ))}
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Card
            title="Our approach"
            description="We blend data science with on-the-ground workflows."
          >
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                FloodSense is built alongside city planners and emergency
                responders to ensure operational readiness. We align on risk
                models, optimize alert thresholds, and support post-incident
                reviews with clear metrics.
              </p>
              <p>
                By combining structured data and human reports, we deliver a
                shared operating picture that teams can trust.
              </p>
            </div>
          </Card>
          <Card
            title="Leadership"
            description="A multidisciplinary team dedicated to resilience."
          >
            <div className="space-y-4 text-sm text-muted-foreground">
              {[
                { name: 'Dr. Amira Ross', role: 'Chief Hydrologist' },
                { name: 'Elijah Park', role: 'Head of Operations' },
                { name: 'Sana Verma', role: 'Community Partnerships' },
              ].map((leader) => (
                <div
                  key={leader.name}
                  className="flex items-center justify-between rounded-2xl border border-border bg-muted/40 px-4 py-3"
                >
                  <span className="font-semibold text-foreground">
                    {leader.name}
                  </span>
                  <span>{leader.role}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </Container>
    </div>
  );
}
