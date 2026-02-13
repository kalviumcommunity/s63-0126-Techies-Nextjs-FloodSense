'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/badge';
import { LOCATION_METRICS } from '@/lib/locationData';

const DEFAULT_LOCATIONS = [
  'Northern Corridor',
  'Lower Delta',
  'Harbor East',
  'Riverwalk',
];

export function LiveOverviewCard() {
  const [locations, setLocations] = useState<string[]>(DEFAULT_LOCATIONS);
  const [selectedLocation, setSelectedLocation] = useState('Northern Corridor');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/districts')
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && Array.isArray(data?.data)) {
          const dbNames = data.data.map((d: { name: string }) => d.name);
          const merged = [...new Set([...DEFAULT_LOCATIONS, ...dbNames])];
          setLocations(merged);
          if (!merged.includes(selectedLocation)) {
            setSelectedLocation(merged[0] || 'Northern Corridor');
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const metrics =
    LOCATION_METRICS[selectedLocation] ?? LOCATION_METRICS['Northern Corridor'];

  return (
    <div className="rounded-3xl border border-white/15 bg-white/10 p-6 text-white shadow-2xl backdrop-blur motion-safe:animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-white/60">
            Live overview
          </p>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="mt-2 block w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-xl font-semibold text-white focus:border-white/40 focus:outline-none focus:ring-1 focus:ring-white/40 min-w-[200px]"
          >
            {locations.map((name) => (
              <option key={name} value={name} className="bg-slate-900 text-white">
                {name}
              </option>
            ))}
          </select>
        </div>
        <Badge
          variant={
            metrics.status === 'critical'
              ? 'danger'
              : metrics.status === 'elevated'
              ? 'warning'
              : metrics.status === 'safe'
              ? 'success'
              : 'info'
          }
          className="shrink-0 bg-white/20 text-white capitalize"
        >
          {metrics.status}
        </Badge>
      </div>
      {loading ? (
        <div className="mt-6 h-32 animate-pulse rounded-2xl bg-white/10" />
      ) : (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              { label: 'Rain intensity', value: metrics.rainIntensity },
              { label: 'River height', value: metrics.riverHeight },
              { label: 'Evacuation zones', value: metrics.evacuationZones },
              { label: 'Sensors online', value: metrics.sensorsOnline },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/15 bg-white/10 p-4 text-sm"
              >
                <p className="text-white/70">{item.label}</p>
                <p className="mt-2 text-lg font-semibold">{item.value}</p>
              </div>
            ))}
          </div>
          {metrics.surgeWindow && (
            <div className="mt-6 rounded-2xl border border-white/15 bg-white/10 p-4 text-sm text-white/70">
              <p className="font-semibold text-white">Predicted surge window</p>
              <p className="mt-2">
                Peak impact expected between {metrics.surgeWindow.start} and{' '}
                {metrics.surgeWindow.end}. {metrics.surgeWindow.action}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
