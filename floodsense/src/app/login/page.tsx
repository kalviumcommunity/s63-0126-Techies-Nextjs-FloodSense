import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Container } from '@/components/container';

const imagery = {
  auth:
    'https://images.pexels.com/photos/2239655/pexels-photo-2239655.jpeg?auto=compress&cs=tinysrgb&w=2000',
};

export default function LoginPage() {
  return (
    <div className="bg-background">
      <Container className="py-12 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-6 motion-safe:animate-fade-up">
            <Badge variant="info">Welcome back</Badge>
            <h1 className="text-4xl font-semibold text-foreground">
              Log in to your FloodSense workspace
            </h1>
            <p className="text-muted-foreground">
              Access live intelligence, response coordination, and operational
              briefings.
            </p>
            <div className="rounded-3xl border border-border bg-[radial-gradient(circle_at_top,_rgba(31,91,216,0.15),_transparent_60%)] p-6 text-sm text-muted-foreground">
              <p className="font-semibold text-foreground">Demo access</p>
              <p className="mt-2">
                Use any email and password to preview the UI. No backend logic
                is connected.
              </p>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border shadow-lg">
              <Image
                src={imagery.auth}
                alt="Emergency response monitoring station"
                fill
                className="object-cover"
                loading="lazy"
              />
            </div>
          </div>
          <Card title="Sign in" description="Enter your details below." className="motion-safe:animate-fade-in">
            <form className="space-y-4 text-sm text-muted-foreground">
              <label className="grid gap-2">
                <span className="font-medium text-foreground">Email</span>
                <input
                  type="email"
                  placeholder="name@agency.gov"
                  className="h-11 rounded-2xl border border-border bg-background px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </label>
              <label className="grid gap-2">
                <span className="font-medium text-foreground">Password</span>
                <input
                  type="password"
                  placeholder="********"
                  className="h-11 rounded-2xl border border-border bg-background px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </label>
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="h-4 w-4 accent-primary" />
                  Keep me signed in
                </label>
                <span className="text-muted-foreground">Forgot password?</span>
              </div>
              <Button className="w-full" size="lg">
                Log in
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                New here?{' '}
                <Link className="font-semibold text-foreground" href="/signup">
                  Create an account
                </Link>
              </p>
            </form>
          </Card>
        </div>
      </Container>
    </div>
  );
}
