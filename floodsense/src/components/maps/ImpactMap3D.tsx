'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import 'maplibre-gl/dist/maplibre-gl.css';

const DEFAULT_CENTER: [number, number] = [77.41, 29.47];
const PITCH = 60;
const BEARING = -20;
const ZOOM = 11;
const SAMPLE_FLOOD_ZONE: [number, number] = [77.42, 29.46];

const DARK_STYLE = {
  version: 8,
  sources: {
    'osm-dark': {
      type: 'raster',
      tiles: ['https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
    },
    'flood-extrusion': {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: { height: 80, base: 0 },
            geometry: {
              type: 'Polygon',
              coordinates: [
                [
                  [77.408, 29.455],
                  [77.418, 29.455],
                  [77.418, 29.465],
                  [77.408, 29.465],
                  [77.408, 29.455],
                ],
              ],
            },
          },
        ],
      },
    },
  },
  layers: [
    {
      id: 'osm-dark',
      type: 'raster',
      source: 'osm-dark',
      minzoom: 0,
      maxzoom: 22,
    },
    {
      id: '3d-flood-zone',
      type: 'fill-extrusion',
      source: 'flood-extrusion',
      paint: {
        'fill-extrusion-color': '#ef4444',
        'fill-extrusion-height': ['get', 'height'],
        'fill-extrusion-base': ['get', 'base'],
        'fill-extrusion-opacity': 0.85,
      },
    },
  ],
};

export function ImpactMap3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import('maplibre-gl').Map | null>(null);
  const markerRef = useRef<import('maplibre-gl').Marker | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  const cleanup = useCallback(() => {
    if (markerRef.current) {
      markerRef.current.remove();
      markerRef.current = null;
    }
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!containerRef.current || typeof window === 'undefined') return;

    let cancelled = false;

    const initMap = async () => {
      try {
        const maplibregl = (await import('maplibre-gl')).default;
        if (cancelled || !containerRef.current) return;

        const map = new maplibregl.Map({
          container: containerRef.current,
          style: DARK_STYLE as import('maplibre-gl').StyleSpecification,
          center: DEFAULT_CENTER,
          zoom: ZOOM,
          pitch: PITCH,
          bearing: BEARING,
        });

        map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'top-right');

        map.on('load', () => {
          if (cancelled) return;

          const el = document.createElement('div');
          el.className = 'flood-zone-marker';
          el.innerHTML = `
            <div class="relative flex h-10 w-10 items-center justify-center">
              <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500/40"></span>
              <span class="relative inline-flex h-6 w-6 rounded-full border-2 border-red-500 bg-red-600/90 shadow-lg"></span>
            </div>
          `;
          el.style.cursor = 'pointer';

          const popup = new maplibregl.Popup({ offset: 15 }).setHTML(
            '<div class="rounded-lg bg-slate-900 px-3 py-2 text-sm text-white shadow-lg"><strong>Flood Zone Alpha</strong><br/>Elevated risk · 4.2m water level</div>'
          );

          const marker = new maplibregl.Marker({ element: el })
            .setLngLat(SAMPLE_FLOOD_ZONE)
            .setPopup(popup)
            .addTo(map);

          markerRef.current = marker;
          mapRef.current = map;
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

  if (status === 'error') {
    return (
      <div className="flex h-full min-h-[320px] w-full flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-muted/30 p-6 text-center">
        <p className="text-sm text-muted-foreground">Failed to load 3D map</p>
      </div>
    );
  }

  return (
    <div className="relative h-full min-h-[320px] w-full overflow-hidden rounded-2xl border border-border bg-slate-900">
      <div ref={containerRef} className="absolute inset-0 h-full w-full" />
      {status === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      )}
      <div className="absolute bottom-3 left-3 flex gap-2 rounded-lg border border-border/50 bg-slate-900/90 px-3 py-2 text-xs shadow-lg backdrop-blur">
        <span className="rounded-full bg-red-500/90 px-2.5 py-0.5 font-medium text-white">
          High risk
        </span>
        <span className="rounded-full bg-amber-500/90 px-2.5 py-0.5 font-medium text-white">
          Moderate
        </span>
        <span className="rounded-full bg-emerald-500/90 px-2.5 py-0.5 font-medium text-white">
          Safe
        </span>
      </div>
    </div>
  );
}
