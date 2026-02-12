'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from './button';
import { Container } from './container';
import { ThemeToggle } from './theme-toggle';

const primaryLinks = [
  { href: '/', label: 'Landing' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/preferences', label: 'Preferences' },
  { href: '/about', label: 'About' },
  { href: '/profile', label: 'Profile' },
];

export function Navbar() {
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isAuthPage = pathname === '/login' || pathname === '/signup';

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-lg font-semibold tracking-tight text-foreground">
            FloodSense
          </Link>
          <div className="hidden items-center gap-1 lg:flex">
            {primaryLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle />
          {!isAuthPage && (
            isLoading ? (
              <span className="text-sm text-muted-foreground">Loading...</span>
            ) : isAuthenticated && user ? (
              <>
                <Link
                  href="/profile"
                  className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
                >
                  {user.name}
                </Link>
                <Button variant="ghost" size="sm" onClick={logout}>
                  Log out
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Log in
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm">Sign up</Button>
                </Link>
              </>
            )
          )}
        </div>
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground lg:hidden"
          aria-label="Toggle menu"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <span className="text-xs font-semibold">{isOpen ? 'Close' : 'Menu'}</span>
        </button>
      </Container>
      {isOpen && (
        <div className="border-t border-border bg-background lg:hidden">
          <Container className="py-4">
            <div className="grid gap-2">
              {primaryLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex items-center gap-3 pt-2">
                <ThemeToggle />
                {!isAuthPage && (
                  isLoading ? (
                    <span className="text-sm text-muted-foreground">Loading...</span>
                  ) : isAuthenticated && user ? (
                    <>
                      <Link
                        href="/profile"
                        className="rounded-md px-3 py-2 text-sm font-medium text-foreground"
                        onClick={() => setIsOpen(false)}
                      >
                        {user.name}
                      </Link>
                      <Button variant="ghost" size="sm" onClick={() => { logout(); setIsOpen(false); }}>
                        Log out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" onClick={() => setIsOpen(false)}>
                        <Button variant="ghost" size="sm">
                          Log in
                        </Button>
                      </Link>
                      <Link href="/signup" onClick={() => setIsOpen(false)}>
                        <Button size="sm">Sign up</Button>
                      </Link>
                    </>
                  )
                )}
              </div>
            </div>
          </Container>
        </div>
      )}
    </nav>
  );
}
