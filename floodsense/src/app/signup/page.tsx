'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Container } from '@/components/container';

const imagery = {
  auth:
    'https://images.pexels.com/photos/2239655/pexels-photo-2239655.jpeg?auto=compress&cs=tinysrgb&w=2000',
};

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    if (!agreed) {
      setMessage({ type: 'error', text: 'Please agree to the terms and privacy policy.' });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        const errorMsg = data?.message ?? 'Signup failed. Please try again.';
        setMessage({ type: 'error', text: errorMsg });
        setLoading(false);
        return;
      }

      setMessage({ type: 'success', text: data.message ?? 'Account created successfully!' });
      setName('');
      setEmail('');
      setPassword('');
      setAgreed(false);
      setTimeout(() => router.push('/login'), 1200);
    } catch {
      setMessage({
        type: 'error',
        text: 'Network error. Please check your connection and try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background">
      <Container className="py-12 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <Card
            title="Create your account"
            description="Start coordinating responses in minutes."
            className="motion-safe:animate-fade-in"
          >
            <form onSubmit={handleSubmit} className="space-y-4 text-sm text-muted-foreground">
              {message && (
                <div
                  className={`rounded-2xl border px-4 py-3 text-sm ${
                    message.type === 'success'
                      ? 'border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-400'
                      : 'border-red-500/50 bg-red-500/10 text-red-700 dark:text-red-400'
                  }`}
                >
                  {message.text}
                </div>
              )}
              <label className="grid gap-2">
                <span className="font-medium text-foreground">Full name</span>
                <input
                  type="text"
                  placeholder="Avery Morgan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="h-11 rounded-2xl border border-border bg-background px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </label>
              <label className="grid gap-2">
                <span className="font-medium text-foreground">Work email</span>
                <input
                  type="email"
                  placeholder="avery@response.gov"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11 rounded-2xl border border-border bg-background px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </label>
              <label className="grid gap-2">
                <span className="font-medium text-foreground">Password</span>
                <input
                  type="password"
                  placeholder="Create a secure password (min 8 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="h-11 rounded-2xl border border-border bg-background px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </label>
              <label className="flex items-start gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1 h-4 w-4 accent-primary"
                />
                <span>
                  I agree to the FloodSense terms and privacy policy.
                </span>
              </label>
              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? 'Creating account...' : 'Create account'}
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Already have an account?{' '}
                <Link className="font-semibold text-foreground" href="/login">
                  Log in
                </Link>
              </p>
            </form>
          </Card>
          <div className="space-y-4 motion-safe:animate-fade-up">
            <Badge variant="success">Join the network</Badge>
            <h1 className="text-3xl font-semibold text-foreground">
              Equip your team with real-time flood intelligence.
            </h1>
            <p className="text-muted-foreground">
              Set response roles, configure alerts, and collaborate across
              agencies with shared dashboards and live updates.
            </p>
            <div className="grid gap-3 text-sm text-muted-foreground">
              {[
                'Role-based access for incident teams',
                'Faster response times with clear escalation',
                'Audit-ready reporting and timeline exports',
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-border bg-muted/40 px-4 py-3"
                >
                  {item}
                </div>
              ))}
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border shadow-lg">
              <Image
                src={imagery.auth}
                alt="Operations center with monitoring screens"
                fill
                className="object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
