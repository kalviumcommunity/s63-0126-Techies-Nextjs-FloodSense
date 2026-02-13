'use client';

import dynamic from 'next/dynamic';
import type { FloodRiskPayload } from '@/lib/dataService';

const AdvancedFloodRiskMap = dynamic(
  () => import('./AdvancedFloodRiskMap').then((m) => m.AdvancedFloodRiskMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex aspect-[4/3] min-h-[320px] w-full items-center justify-center rounded-2xl border border-slate-700/50 bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
          <span className="text-xs text-slate-500">Loading intelligence map...</span>
        </div>
      </div>
    ),
  }
);

export interface AdvancedFloodRiskMapWrapperProps {
  center: [number, number];
  userPosition: [number, number];
  floodRiskData: FloodRiskPayload | null;
  isLive: boolean;
}

export function AdvancedFloodRiskMapWrapper({
  center,
  userPosition,
  floodRiskData,
  isLive,
}: AdvancedFloodRiskMapWrapperProps) {
  return (
    <AdvancedFloodRiskMap
      center={center}
      userPosition={userPosition}
      floodRiskData={floodRiskData}
      isLive={isLive}
    />
  );
}
