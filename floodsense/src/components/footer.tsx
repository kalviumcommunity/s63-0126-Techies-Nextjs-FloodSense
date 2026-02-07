import Link from 'next/link';
import { Container } from './container';

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <Container className="py-10">
        <div className="grid gap-8 md:grid-cols-[2fr_1fr_1fr]">
          <div>
            <Link href="/" className="text-lg font-semibold text-foreground">
              FloodSense
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              Real-time flood risk visualization and alerts for vulnerable
              communities. Built for clarity, speed, and resilience.
            </p>
          </div>
          <div className="space-y-2 text-sm">
            <p className="font-semibold text-foreground">Platform</p>
            <Link className="block text-muted-foreground hover:text-foreground" href="/dashboard">
              Dashboard
            </Link>
            <Link className="block text-muted-foreground hover:text-foreground" href="/preferences">
              Preferences
            </Link>
            <Link className="block text-muted-foreground hover:text-foreground" href="/profile">
              Profile
            </Link>
          </div>
          <div className="space-y-2 text-sm">
            <p className="font-semibold text-foreground">Company</p>
            <Link className="block text-muted-foreground hover:text-foreground" href="/about">
              About
            </Link>
            <Link className="block text-muted-foreground hover:text-foreground" href="/login">
              Login
            </Link>
            <Link className="block text-muted-foreground hover:text-foreground" href="/signup">
              Sign-up
            </Link>
          </div>
        </div>
        <div className="mt-8 flex flex-col gap-4 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>(c) 2025 FloodSense. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Security</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://www.linkedin.com"
              className="text-muted-foreground transition hover:text-foreground"
              aria-label="Visit FloodSense on LinkedIn"
            >
              LinkedIn
            </a>
            <a
              href="https://www.x.com"
              className="text-muted-foreground transition hover:text-foreground"
              aria-label="Visit FloodSense on X"
            >
              X
            </a>
            <a
              href="https://www.youtube.com"
              className="text-muted-foreground transition hover:text-foreground"
              aria-label="Visit FloodSense on YouTube"
            >
              YouTube
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
