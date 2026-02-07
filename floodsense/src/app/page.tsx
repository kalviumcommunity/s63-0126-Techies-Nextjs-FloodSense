import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Container } from '@/components/container';

const highlights = [
  {
    title: 'Signal-grade clarity',
    description:
      'A calm command interface that keeps your team focused on the highest-impact decisions.',
  },
  {
    title: 'Predictive intelligence',
    description:
      'Forecast-ready insights surface before thresholds are breached, with guided actions.',
  },
  {
    title: 'Rapid coordination',
    description:
      'Align teams, routes, and resources in one view built for high-pressure moments.',
  },
];

const metrics = [
  { label: 'Active monitoring zones', value: '48' },
  { label: 'Average response time', value: '2.4 min' },
  { label: 'Operational readiness', value: '92%' },
];

const dashboardModules = [
  {
    title: 'Live incident queue',
    detail: 'Prioritized alerts with next-best actions and team status.',
  },
  {
    title: 'Resource readiness',
    detail: 'Track availability of mobile barriers, drones, and field units.',
  },
  {
    title: 'Forecast intelligence',
    detail: 'Adaptive risk modeling with hourly confidence updates.',
  },
];

const imagery = {
  hero:
    'https://images.pexels.com/photos/9404467/pexels-photo-9404467.jpeg?auto=compress&cs=tinysrgb&w=2000',
  dashboard:
    'https://images.pexels.com/photos/31550735/pexels-photo-31550735.jpeg?auto=compress&cs=tinysrgb&w=2000',
};

export default function Home() {
  return (
    <div className="bg-background">
      <section className="relative min-h-screen overflow-hidden">
        <Image
          src={imagery.hero}
          alt="Aerial view of a flood-prone river landscape"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/30 to-transparent" />
        <Container className="relative flex min-h-screen items-center py-16 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="space-y-6 text-white motion-safe:animate-fade-up">
              <Badge variant="info" className="bg-white/10 text-white">
                Trusted by resilience teams
              </Badge>
              <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
                FloodSense is the premium command center for flood risk
                intelligence.
              </h1>
              <p className="text-base text-white/80 sm:text-lg">
                Built for leaders who need instant clarity, live coordination,
                and elegant decision support in every moment.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/dashboard">
                  <Button size="lg">Launch dashboard</Button>
                </Link>
                <Link href="/about">
                  <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
                    Our approach
                  </Button>
                </Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {metrics.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-white/15 bg-white/10 p-4 text-sm backdrop-blur"
                  >
                    <p className="text-2xl font-semibold">{stat.value}</p>
                    <p className="text-white/70">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-white/15 bg-white/10 p-6 text-white shadow-2xl backdrop-blur motion-safe:animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                    Live overview
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold">Northern Corridor</h2>
                </div>
                <Badge variant="warning" className="bg-white/20 text-white">
                  Elevated
                </Badge>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {[
                  { label: 'Rain intensity', value: '18 mm/hr' },
                  { label: 'River height', value: '4.8 m' },
                  { label: 'Evacuation zones', value: '6 active' },
                  { label: 'Sensors online', value: '128 of 132' },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-white/15 bg-white/10 p-4 text-sm"
                  >
                    <p className="text-white/70">{item.label}</p>
                    <p className="mt-2 text-lg font-semibold">{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-2xl border border-white/15 bg-white/10 p-4 text-sm text-white/70">
                <p className="font-semibold text-white">Predicted surge window</p>
                <p className="mt-2">
                  Peak impact expected between 19:20 and 20:05. Prepare mobile
                  barriers and re-route traffic away from Zone D.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-y border-border bg-muted/50">
        <Container className="py-10">
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs uppercase tracking-[0.3em] text-muted-foreground">
            <span>City Operations</span>
            <span>Hydrology Institute</span>
            <span>Resilience Labs</span>
            <span>RapidAid Network</span>
          </div>
        </Container>
      </section>

      <section>
        <Container className="py-16 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div className="space-y-4 motion-safe:animate-fade-up">
              <Badge variant="success">Dashboard-style features</Badge>
              <h2 className="text-3xl font-semibold text-foreground">
                A dashboard built for the decision-maker.
              </h2>
              <p className="text-muted-foreground">
                Every module is designed to reduce cognitive load and surface
                the next best action instantly.
              </p>
              <div className="grid gap-3">
                {dashboardModules.map((module) => (
                  <Card key={module.title} title={module.title}>
                    {module.detail}
                  </Card>
                ))}
              </div>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border bg-card shadow-xl">
              <Image
                src={imagery.dashboard}
                alt="Satellite-style view of river delta terrain"
                fill
                className="object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </Container>
      </section>

      <section>
        <Container className="py-16 lg:py-24">
          <div className="grid gap-6 lg:grid-cols-3">
            {highlights.map((feature) => (
              <Card key={feature.title} title={feature.title}>
                {feature.description}
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-background">
        <Container className="py-16 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div className="space-y-4">
              <Badge variant="success">How it works</Badge>
              <h2 className="text-3xl font-semibold text-foreground">
                From signal to action in three disciplined steps.
              </h2>
              <p className="text-muted-foreground">
                FloodSense consolidates sensor data, forecasts, and field
                updates into a single trusted timeline.
              </p>
            </div>
            <div className="grid gap-4">
              {[
                {
                  title: 'Ingest and verify',
                  detail:
                    'Automated checks validate sensor integrity, rainfall accuracy, and anomalies.',
                },
                {
                  title: 'Model and predict',
                  detail:
                    'Risk simulations update hourly with clear confidence intervals.',
                },
                {
                  title: 'Deploy and coordinate',
                  detail:
                    'Teams receive actionable guidance and escalation playbooks.',
                },
              ].map((step, index) => (
                <div
                  key={step.title}
                  className="rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {step.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {step.detail}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-gradient-to-r from-primary/10 via-transparent to-accent/10">
        <Container className="py-16 lg:py-24">
          <div className="flex flex-col items-start justify-between gap-6 rounded-3xl border border-border bg-card p-8 shadow-sm lg:flex-row lg:items-center">
            <div>
              <h2 className="text-3xl font-semibold text-foreground">
                Ready for premium readiness?
              </h2>
              <p className="mt-2 text-muted-foreground">
                Launch the dashboard or configure your operational preferences
                in minutes.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/dashboard">
                <Button size="lg">Open dashboard</Button>
              </Link>
              <Link href="/preferences">
                <Button variant="outline" size="lg">
                  Configure settings
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
