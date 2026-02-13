'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { FloodRiskPayload } from '@/lib/dataService';

const ZOOM = 12;
const PITCH = 65;
const BEARING = -15;

type RiskFilter = 'all' | 'high' | 'medium' | 'low';

function zonesToGeoJSON(zones: FloodRiskPayload['zones']) {
  return {
    type: 'FeatureCollection' as const,
    features: zones.map((z) => ({
      type: 'Feature' as const,
      id: z.id,
      properties: { risk: z.risk, name: z.name, waterLevel: z.waterLevel },
      geometry: {
        type: 'Polygon' as const,
        coordinates: [z.coordinates],
      },
    })),
  };
}

function heatmapToGeoJSON(points: FloodRiskPayload['heatmapPoints']) {
  return {
    type: 'FeatureCollection' as const,
    features: points.map((p) => ({
      type: 'Feature' as const,
      geometry: {
        type: 'Point' as const,
        coordinates: p.coordinates,
      },
      properties: { intensity: p.intensity },
    })),
  };
}

function getFilter(filter: RiskFilter): import('maplibre-gl').FilterSpecification | undefined {
  if (filter === 'all') return undefined;
  return ['==', ['get', 'risk'], filter];
}

export interface AdvancedFloodRiskMapProps {
  center: [number, number];
  userPosition: [number, number];
  floodRiskData: FloodRiskPayload | null;
  isLive: boolean;
}

export function AdvancedFloodRiskMap({
  center,
  userPosition,
  floodRiskData,
  isLive,
}: AdvancedFloodRiskMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import('maplibre-gl').Map | null>(null);
  type MapLibre = {
    Map: new (opts: import('maplibre-gl').MapOptions) => import('maplibre-gl').Map;
    Marker: new (opts?: object) => import('maplibre-gl').Marker;
    Popup: new (opts?: object) => import('maplibre-gl').Popup;
    NavigationControl: new (opts?: object) => import('maplibre-gl').NavigationControl;
  };
  const maplibreglRef = useRef<MapLibre | null>(null);
  const criticalMarkerRef = useRef<import('maplibre-gl').Marker | null>(null);
  const userMarkerRef = useRef<import('maplibre-gl').Marker | null>(null);
  const popupRef = useRef<import('maplibre-gl').Popup | null>(null);
  const hasCenteredRef = useRef(false);
  const isInitializedRef = useRef(false);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [riskFilter, setRiskFilter] = useState<RiskFilter>('all');

  const cleanup = useCallback(() => {
    if (popupRef.current) {
      popupRef.current.remove();
      popupRef.current = null;
    }
    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
      userMarkerRef.current = null;
    }
    if (criticalMarkerRef.current) {
      criticalMarkerRef.current.remove();
      criticalMarkerRef.current = null;
    }
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }
    maplibreglRef.current = null;
    isInitializedRef.current = false;
    hasCenteredRef.current = false;
  }, []);

  useEffect(() => {
    if (!containerRef.current || typeof window === 'undefined' || isInitializedRef.current) return;

    let cancelled = false;
    const initialCenter: [number, number] = [center[0], center[1]];
    const initialUserPosition: [number, number] = [userPosition[0], userPosition[1]];

    const initMap = async () => {
      try {
        const maplibregl = ((await import('maplibre-gl')) as { default: MapLibre }).default;
        if (cancelled || !containerRef.current || isInitializedRef.current) return;

        maplibreglRef.current = maplibregl;

        const baseStyle = {
          version: 8,
          sources: {
            'osm-dark': {
              type: 'raster',
              tiles: ['https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'],
              tileSize: 256,
              attribution: '&copy; OSM &copy; CARTO',
            },
            'flood-risk': {
              type: 'geojson',
              data: { type: 'FeatureCollection' as const, features: [] },
              generateId: true,
            },
            'heatmap-points': {
              type: 'geojson',
              data: { type: 'FeatureCollection' as const, features: [] },
            },
          },
          layers: [
            { id: 'osm-dark', type: 'raster', source: 'osm-dark', minzoom: 0, maxzoom: 22 },
            {
              id: 'heatmap',
              type: 'heatmap',
              source: 'heatmap-points',
              paint: {
                'heatmap-weight': ['get', 'intensity'],
                'heatmap-intensity': 1.2,
                'heatmap-color': [
                  'interpolate',
                  ['linear'],
                  ['heatmap-density'],
                  0, 'rgba(0, 0, 0, 0)',
                  0.2, 'rgba(239, 68, 68, 0.4)',
                  0.5, 'rgba(249, 115, 22, 0.6)',
                  0.8, 'rgba(34, 197, 94, 0.5)',
                ],
                'heatmap-radius': 35,
                'heatmap-opacity': 0.7,
              },
            },
            {
              id: 'flood-zones-fill',
              type: 'fill',
              source: 'flood-risk',
              paint: {
                'fill-color': [
                  'match',
                  ['get', 'risk'],
                  'high', 'rgba(239, 68, 68, 0.6)',
                  'medium', 'rgba(249, 115, 22, 0.5)',
                  'low', 'rgba(34, 197, 94, 0.5)',
                  'rgba(100, 100, 100, 0.5)',
                ],
                'fill-outline-color': [
                  'match',
                  ['get', 'risk'],
                  'high', '#ef4444',
                  'medium', '#f97316',
                  'low', '#22c55e',
                  '#64748b',
                ],
              },
            },
          ],
        };

        const map = new maplibregl.Map({
          container: containerRef.current,
          style: baseStyle as import('maplibre-gl').StyleSpecification,
          center: initialCenter,
          zoom: ZOOM - 1,
          pitch: 0,
          bearing: 0,
        });

        map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'top-right');

        map.on('load', () => {
          if (cancelled) return;

          if (!hasCenteredRef.current) {
            hasCenteredRef.current = true;
            map.easeTo({
              center: initialCenter,
              zoom: ZOOM,
              pitch: PITCH,
              bearing: BEARING,
              duration: 2000,
            });
          }

          const m = map as import('maplibre-gl').Map & { setFog?: (fog: unknown) => void };
          if (typeof m.setFog === 'function') {
            m.setFog({
              range: [0.5, 2.5],
              color: 'rgb(15, 23, 42)',
              'high-color': 'rgb(30, 41, 59)',
              'horizon-blend': 0.35,
              'space-color': 'rgb(15, 23, 42)',
            });
          }

          const popup = new maplibregl.Popup({
            closeButton: false,
            closeOnClick: false,
            className: 'flood-risk-popup',
            offset: 10,
          });
          popupRef.current = popup;

          map.on('mouseenter', 'flood-zones-fill', (e) => {
            map.getCanvas().style.cursor = 'pointer';
            const props = e.features?.[0]?.properties;
            if (props) {
              const riskLabel = (props.risk as string).replace(/^./, (c: string) => c.toUpperCase());
              const color =
                props.risk === 'high' ? '#ef4444' : props.risk === 'medium' ? '#f97316' : '#22c55e';
              popup
                .setLngLat(e.lngLat)
                .setHTML(
                  `<div style="border-radius:8px;border:1px solid ${color};background:#0f172a;color:white;padding:8px 12px;font-size:13px;box-shadow:0 4px 6px rgba(0,0,0,0.3)">
                    <strong style="color:${color}">${props.name}</strong><br/>
                    Risk: ${riskLabel} · Water: ${props.waterLevel}
                  </div>`
                )
                .addTo(map);
            }
          });

          map.on('mouseleave', 'flood-zones-fill', () => {
            map.getCanvas().style.cursor = '';
            popup.remove();
          });

          const userEl = document.createElement('div');
          userEl.style.pointerEvents = 'auto';
          userEl.style.zIndex = '10';
          userEl.innerHTML = isLive
            ? `<div style="position:relative;display:flex;height:48px;width:48px;align-items:center;justify-content:center" title="Your live position">
                <span style="position:absolute;inset:0;border-radius:50%;background:rgba(16,185,129,0.5);animation:ping 2s cubic-bezier(0,0,0.2,1) infinite"></span>
                <span style="position:relative;height:32px;width:32px;border-radius:50%;border:2px solid #34d399;background:#059669;box-shadow:0 4px 6px -1px rgba(0,0,0,0.3)"></span>
              </div>`
            : `<div style="position:relative;display:flex;height:40px;width:40px;align-items:center;justify-content:center" title="Default location (enable GPS for live)">
                <span style="position:relative;height:24px;width:24px;border-radius:50%;border:2px solid #fbbf24;background:#f59e0b;box-shadow:0 4px 6px -1px rgba(0,0,0,0.3)"></span>
              </div>`;
          const userMarker = new maplibregl.Marker({ element: userEl })
            .setLngLat(initialUserPosition)
            .setPopup(
              new maplibregl.Popup({ offset: 12 }).setHTML(
                `<div style="border-radius:8px;border:1px solid #334155;background:rgba(15,23,42,0.95);color:white;padding:8px 12px;font-size:12px">${isLive ? '<strong style="color:#34d399">You</strong> · Live GPS' : 'Default center · Enable GPS for live location'}</div>`
              )
            )
            .addTo(map);
          userMarkerRef.current = userMarker;

          mapRef.current = map;
          isInitializedRef.current = true;
          if (!cancelled) setStatus('ready');
        });

        return () => {
          cancelled = true;
          cleanup();
        };
      } catch {
        if (!cancelled) setStatus('error');
        return () => {
          cancelled = true;
          cleanup();
        };
      }
    };

    let teardown: (() => void) | undefined;
    initMap().then((fn) => {
      teardown = fn;
    });

    return () => {
      cancelled = true;
      teardown?.();
      cleanup();
    };
  }, [cleanup]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || status !== 'ready' || !floodRiskData) return;

    const floodSource = map.getSource('flood-risk') as import('maplibre-gl').GeoJSONSource | undefined;
    const heatmapSource = map.getSource('heatmap-points') as import('maplibre-gl').GeoJSONSource | undefined;
    if (floodSource) floodSource.setData(zonesToGeoJSON(floodRiskData.zones));
    if (heatmapSource) heatmapSource.setData(heatmapToGeoJSON(floodRiskData.heatmapPoints));
  }, [floodRiskData, status]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || status !== 'ready') return;
    try {
      if (map.getLayer('flood-zones-fill')) {
        map.setFilter('flood-zones-fill', getFilter(riskFilter));
      }
    } catch {
      /* layer may not exist */
    }
  }, [riskFilter, status]);

  useEffect(() => {
    const map = mapRef.current;
    const ml = maplibreglRef.current;
    if (!map || status !== 'ready' || !ml) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.setLngLat(userPosition);
    }
  }, [userPosition, status]);

  useEffect(() => {
    const map = mapRef.current;
    const ml = maplibreglRef.current;
    if (!map || status !== 'ready' || !floodRiskData?.criticalAlert || !ml) return;

    if (criticalMarkerRef.current) {
      criticalMarkerRef.current.remove();
      criticalMarkerRef.current = null;
    }

    const coord = floodRiskData.criticalAlert.coordinates;
    const msg = floodRiskData.criticalAlert.message;

    const el = document.createElement('div');
    el.innerHTML = `
      <div style="position:relative;display:flex;height:48px;width:48px;align-items:center;justify-content:center">
        <span style="position:absolute;inset:0;border-radius:50%;background:rgba(239,68,68,0.5);animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite"></span>
        <span style="position:relative;height:32px;width:32px;border-radius:50%;border:2px solid #f87171;background:#dc2626;box-shadow:0 4px 6px -1px rgba(0,0,0,0.3)"></span>
      </div>
    `;
    const marker = new ml.Marker({ element: el })
      .setLngLat(coord)
      .setPopup(
        new ml.Popup({ offset: 20 }).setHTML(
          `<div style="border-radius:8px;border:1px solid rgba(239,68,68,0.5);background:rgba(15,23,42,0.95);padding:12px 16px;font-size:13px;color:white;box-shadow:0 4px 6px rgba(0,0,0,0.3)"><strong style="color:#f87171">CRITICAL ALERT</strong><br/>${msg}</div>`
        )
      )
      .addTo(map);
    criticalMarkerRef.current = marker;

    return () => {
      if (criticalMarkerRef.current) {
        criticalMarkerRef.current.remove();
        criticalMarkerRef.current = null;
      }
    };
  }, [floodRiskData?.criticalAlert, status]);

  if (status === 'error') {
    return (
      <div className="flex h-full min-h-[320px] w-full flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-600 bg-slate-900/50 p-6">
        <p className="text-sm text-slate-400">Failed to load flood risk map</p>
      </div>
    );
  }

  return (
    <div className="relative h-full min-h-[320px] w-full overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-950 shadow-inner">
      <div ref={containerRef} className="absolute inset-0 h-full w-full" />

      {status === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/90">
          <div className="flex flex-col items-center gap-3">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
            <span className="text-xs text-slate-500">Loading intelligence map...</span>
          </div>
        </div>
      )}

      <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-1.5">
        {(['all', 'high', 'medium', 'low'] as const).map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setRiskFilter(filter)}
            className={`rounded-lg border px-2.5 py-1 text-xs font-medium transition-all ${
              riskFilter === filter
                ? filter === 'high'
                  ? 'border-red-500/80 bg-red-500/30 text-red-400'
                  : filter === 'medium'
                    ? 'border-amber-500/80 bg-amber-500/30 text-amber-400'
                    : filter === 'low'
                      ? 'border-emerald-500/80 bg-emerald-500/30 text-emerald-400'
                      : 'border-cyan-500/80 bg-cyan-500/20 text-cyan-400'
                : 'border-slate-600/60 bg-slate-900/80 text-slate-400 hover:border-slate-500 hover:text-slate-300'
            }`}
          >
            {filter === 'all' ? 'Show All' : filter === 'high' ? 'High only' : filter === 'medium' ? 'Medium only' : 'Low only'}
          </button>
        ))}
      </div>

      <div className="absolute bottom-3 left-3 z-10 flex gap-2 rounded-lg border border-slate-700/70 bg-slate-900/90 px-3 py-2 text-xs shadow-lg backdrop-blur">
        <span className="rounded-full bg-red-500/90 px-2.5 py-0.5 font-medium text-white">High</span>
        <span className="rounded-full bg-amber-500/90 px-2.5 py-0.5 font-medium text-white">Medium</span>
        <span className="rounded-full bg-emerald-500/90 px-2.5 py-0.5 font-medium text-white">Low</span>
      </div>

      <div className="absolute top-3 right-12 z-10 flex items-center gap-2 rounded border border-slate-700/50 bg-slate-900/80 px-2 py-1">
        {isLive ? (
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" title="Live GPS" />
        ) : (
          <span className="h-2 w-2 rounded-full bg-amber-500" title="Fallback location" />
        )}
        <span className="text-[10px] uppercase tracking-wider text-slate-500">Live Intel</span>
      </div>
    </div>
  );
}
