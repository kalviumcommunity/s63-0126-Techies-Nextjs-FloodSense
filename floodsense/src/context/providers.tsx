'use client';

import { AuthProvider } from './AuthContext';
import { LocationProvider } from './LocationContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <LocationProvider>{children}</LocationProvider>
    </AuthProvider>
  );
}
