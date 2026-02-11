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

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    console.log('[Login] Submitting form:', { email });

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log('[Login] Response:', { status: res.status, hasToken: !!data?.data?.token });

      if (!res.ok) {
        const errorMsg = data?.message ?? 'Login failed. Please try again.';
        setMessage({ type: 'error', text: errorMsg });
        setLoading(false);
        return;
      }

      const token = data?.data?.token;
      const user = data?.data?.user;
      if (token) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('floodsense_token', token);
          if (user) {
            localStorage.setItem('floodsense_user', JSON.stringify(user));
          }
        }
      }

      setMessage({ type: 'success', text: data.message ?? 'Login successful!' });
      setTimeout(() => router.push('/dashboard'), 1000);
    } catch (err) {
      console.error('[Login] Fetch error:', err);
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
              <p className="font-semibold text-foreground">Secure login</p>
              <p className="mt-2">
                Sign in with your FloodSense account. Create an account if you
                don&apos;t have one yet.
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
                <span className="font-medium text-foreground">Email</span>
                <input
                  type="email"
                  placeholder="name@agency.gov"
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
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
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
              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? 'Signing in...' : 'Log in'}
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
