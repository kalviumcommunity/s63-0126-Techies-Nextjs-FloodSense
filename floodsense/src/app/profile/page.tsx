'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Container } from '@/components/container';

const imagery = {
  profile:
    'https://images.pexels.com/photos/3964648/pexels-photo-3964648.jpeg?auto=compress&cs=tinysrgb&w=2000',
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="bg-background">
        <Container className="py-12 lg:py-16">
          <div className="h-64 animate-pulse rounded-2xl bg-muted" />
          <div className="mt-6 h-48 animate-pulse rounded-2xl bg-muted" />
        </Container>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="bg-background">
        <Container className="py-12 lg:py-16">
          <Card
            title="Profile"
            description="Sign in to view your profile."
            className="max-w-md"
          >
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Create an account or log in to access your profile and preferences.
              </p>
              <div className="flex gap-3">
                <Link href="/login">
                  <Button>Log in</Button>
                </Link>
                <Link href="/signup">
                  <Button variant="outline">Sign up</Button>
                </Link>
              </div>
            </div>
          </Card>
        </Container>
      </div>
    );
  }

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
            sizes="(max-width: 768px) 100vw, 1200px"
          />
        </div>
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <Card>
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-foreground shadow-sm">
                {getInitials(user.name)}
              </div>
              <div>
                <p className="text-lg font-semibold text-foreground">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <div className="mt-6 space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center justify-between">
                <span>Name</span>
                <span className="font-semibold text-foreground">{user.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Email</span>
                <span className="font-semibold text-foreground">{user.email}</span>
              </div>
            </div>
          </Card>

          <div className="space-y-6">
            <Card
              title="Quick actions"
              description="Manage your account and settings."
            >
              <div className="flex flex-wrap gap-3">
                <Link href="/preferences">
                  <Button size="sm">Preferences</Button>
                </Link>
                <Link href="/dashboard">
                  <Button size="sm" variant="outline">
                    Dashboard
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
}
