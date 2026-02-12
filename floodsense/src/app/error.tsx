'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/button';
import { Container } from '@/components/container';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to error reporting service in production
  }, [error]);

  return (
    <div className="bg-background">
      <Container className="flex min-h-[60vh] flex-col items-center justify-center py-16">
        <h1 className="text-2xl font-semibold text-foreground">
          Something went wrong
        </h1>
        <p className="mt-2 text-muted-foreground">
          An unexpected error occurred. Please try again.
        </p>
        <div className="mt-6 flex gap-3">
          <Button onClick={reset}>Try again</Button>
          <Link href="/">
            <Button variant="outline">Go home</Button>
          </Link>
        </div>
      </Container>
    </div>
  );
}
