'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  fetchFloodRisk,
  fetchWeatherModel,
  fetchCommunityUpdates,
  type FloodRiskPayload,
  type WeatherModelPayload,
  type CommunityUpdatesPayload,
} from '@/lib/dataService';

/** Intervals in ms */
export const REFRESH_INTERVALS = {
  sensorTelemetry: 30 * 1000,
  weatherModel: 5 * 60 * 1000,
  communityUpdates: 15 * 60 * 1000,
} as const;

export interface DataRefreshState {
  floodRisk: FloodRiskPayload | null;
  weather: WeatherModelPayload | null;
  communityUpdates: CommunityUpdatesPayload | null;
  lastUpdated: {
    floodRisk: Date | null;
    weather: Date | null;
    communityUpdates: Date | null;
  };
  loading: {
    floodRisk: boolean;
    weather: boolean;
    communityUpdates: boolean;
  };
  error: {
    floodRisk: string | null;
    weather: string | null;
    communityUpdates: string | null;
  };
}

const initialState: DataRefreshState = {
  floodRisk: null,
  weather: null,
  communityUpdates: null,
  lastUpdated: {
    floodRisk: null,
    weather: null,
    communityUpdates: null,
  },
  loading: {
    floodRisk: false,
    weather: false,
    communityUpdates: false,
  },
  error: {
    floodRisk: null,
    weather: null,
    communityUpdates: null,
  },
};

/**
 * Centralized data refresh manager.
 * - Pauses polling when tab is hidden (visibility API)
 * - Uses setInterval with cleanup
 * - No duplicate intervals, no memory leaks
 */
export function useDataRefresh(lat: number, lng: number) {
  const [state, setState] = useState<DataRefreshState>(initialState);
  const intervalRefs = useRef<{ sensor: number; weather: number; community: number } | null>(null);
  const isVisibleRef = useRef(true);

  const fetchFlood = useCallback(async () => {
    setState((s) => ({ ...s, loading: { ...s.loading, floodRisk: true }, error: { ...s.error, floodRisk: null } }));
    try {
      const data = await fetchFloodRisk(lat, lng);
      setState((s) => ({
        ...s,
        floodRisk: data,
        lastUpdated: { ...s.lastUpdated, floodRisk: new Date() },
        loading: { ...s.loading, floodRisk: false },
        error: { ...s.error, floodRisk: null },
      }));
      return data;
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to fetch flood risk';
      setState((s) => ({
        ...s,
        loading: { ...s.loading, floodRisk: false },
        error: { ...s.error, floodRisk: msg },
      }));
      return null;
    }
  }, [lat, lng]);

  const fetchWeather = useCallback(async () => {
    setState((s) => ({ ...s, loading: { ...s.loading, weather: true }, error: { ...s.error, weather: null } }));
    try {
      const data = await fetchWeatherModel(lat, lng);
      setState((s) => ({
        ...s,
        weather: data,
        lastUpdated: { ...s.lastUpdated, weather: new Date() },
        loading: { ...s.loading, weather: false },
        error: { ...s.error, weather: null },
      }));
      return data;
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to fetch weather';
      setState((s) => ({
        ...s,
        loading: { ...s.loading, weather: false },
        error: { ...s.error, weather: msg },
      }));
      return null;
    }
  }, [lat, lng]);

  const fetchCommunity = useCallback(async () => {
    setState((s) => ({ ...s, loading: { ...s.loading, communityUpdates: true }, error: { ...s.error, communityUpdates: null } }));
    try {
      const data = await fetchCommunityUpdates(lat, lng);
      setState((s) => ({
        ...s,
        communityUpdates: data,
        lastUpdated: { ...s.lastUpdated, communityUpdates: new Date() },
        loading: { ...s.loading, communityUpdates: false },
        error: { ...s.error, communityUpdates: null },
      }));
      return data;
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to fetch community updates';
      setState((s) => ({
        ...s,
        loading: { ...s.loading, communityUpdates: false },
        error: { ...s.error, communityUpdates: msg },
      }));
      return null;
    }
  }, [lat, lng]);

  const refreshAll = useCallback(async () => {
    await Promise.all([fetchFlood(), fetchWeather(), fetchCommunity()]);
  }, [fetchFlood, fetchWeather, fetchCommunity]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleVisibility = () => {
      isVisibleRef.current = !document.hidden;
      if (document.hidden) {
        if (intervalRefs.current) {
          clearInterval(intervalRefs.current.sensor);
          clearInterval(intervalRefs.current.weather);
          clearInterval(intervalRefs.current.community);
          intervalRefs.current = null;
        }
      } else {
        fetchFlood();
        fetchWeather();
        fetchCommunity();
        intervalRefs.current = {
          sensor: window.setInterval(fetchFlood, REFRESH_INTERVALS.sensorTelemetry),
          weather: window.setInterval(fetchWeather, REFRESH_INTERVALS.weatherModel),
          community: window.setInterval(fetchCommunity, REFRESH_INTERVALS.communityUpdates),
        };
      }
    };

    handleVisibility();
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      if (intervalRefs.current) {
        clearInterval(intervalRefs.current.sensor);
        clearInterval(intervalRefs.current.weather);
        clearInterval(intervalRefs.current.community);
        intervalRefs.current = null;
      }
    };
  }, [fetchFlood, fetchWeather, fetchCommunity]);

  return {
    ...state,
    refreshAll,
    refreshFlood: fetchFlood,
    refreshWeather: fetchWeather,
    refreshCommunity: fetchCommunity,
    intervals: REFRESH_INTERVALS,
  };
}

/** Whether the page/tab is visible */
export function usePageVisible(): boolean {
  const [visible, setVisible] = useState(
    typeof document !== 'undefined' ? !document.hidden : true
  );
  useEffect(() => {
    const handle = () => setVisible(!document.hidden);
    document.addEventListener('visibilitychange', handle);
    return () => document.removeEventListener('visibilitychange', handle);
  }, []);
  return visible;
}

/** Seconds until next sensor telemetry refresh (for countdown) */
export function useSensorCountdown(lastUpdated: Date | null): number {
  const [seconds, setSeconds] = useState(REFRESH_INTERVALS.sensorTelemetry / 1000);
  const visible = usePageVisible();

  useEffect(() => {
    if (!lastUpdated || !visible) return;
    const interval = REFRESH_INTERVALS.sensorTelemetry / 1000;
    const tick = () => {
      const elapsed = (Date.now() - lastUpdated.getTime()) / 1000;
      const remaining = Math.max(0, Math.ceil(interval - elapsed));
      setSeconds(remaining);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [lastUpdated, visible]);

  return seconds;
}
