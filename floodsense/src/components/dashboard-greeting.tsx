'use client';

import { useAuth } from '@/context/AuthContext';

export function DashboardGreeting() {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated || !user) return null;
  return (
    <p className="text-sm text-muted-foreground">
      Welcome, <span className="font-medium text-foreground">{user.name}</span>.
    </p>
  );
}
