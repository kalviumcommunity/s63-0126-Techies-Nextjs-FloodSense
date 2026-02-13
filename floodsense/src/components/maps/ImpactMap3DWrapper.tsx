'use client';

import dynamic from 'next/dynamic';

const ImpactMap3D = dynamic(
  () => import('./ImpactMap3D').then((m) => m.ImpactMap3D),
  {
    ssr: false,
    loading: () => (
      <div className="flex aspect-[4/3] min-h-[320px] w-full items-center justify-center rounded-2xl border border-border bg-muted/30">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    ),
  }
);

export function ImpactMap3DWrapper() {
  return <ImpactMap3D />;
}
