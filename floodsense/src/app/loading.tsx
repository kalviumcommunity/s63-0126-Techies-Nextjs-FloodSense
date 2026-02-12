import { Container } from '@/components/container';

export default function Loading() {
  return (
    <div className="bg-background">
      <Container className="py-12 lg:py-16">
        <div className="space-y-6">
          <div className="h-10 w-64 animate-pulse rounded-lg bg-muted" />
          <div className="h-4 w-full max-w-md animate-pulse rounded bg-muted" />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 animate-pulse rounded-2xl bg-muted" />
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
