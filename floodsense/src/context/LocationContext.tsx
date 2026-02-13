'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

/** Fallback when GPS unavailable [lng, lat] (e.g. Delhi) */
const FALLBACK_CENTER: [number, number] = [77.209, 28.6139];

export interface LocationState {
  /** User latitude */
  latitude: number;
  /** User longitude */
  longitude: number;
  /** Whether location is from live GPS (vs fallback) */
  isLive: boolean;
  /** Loading / ready / denied / error */
  status: 'loading' | 'ready' | 'denied' | 'error' | 'unavailable';
  /** Human-readable error message if any */
  errorMessage?: string;
}

interface LocationContextValue extends LocationState {
  /** Refetch position (re-request permission if needed) */
  refresh: () => void;
}

const initialState: LocationState = {
  latitude: FALLBACK_CENTER[1],
  longitude: FALLBACK_CENTER[0],
  isLive: false,
  status: 'loading',
};

const LocationContext = createContext<LocationContextValue | null>(null);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<LocationState>(initialState);

  const updateLocation = useCallback((coords: { latitude: number; longitude: number }) => {
    setState({
      latitude: coords.latitude,
      longitude: coords.longitude,
      isLive: true,
      status: 'ready',
    });
  }, []);

  const refresh = useCallback(() => {
    if (!navigator?.geolocation) {
      setState((s) => ({
        ...s,
        latitude: FALLBACK_CENTER[1],
        longitude: FALLBACK_CENTER[0],
        isLive: false,
        status: 'unavailable',
        errorMessage: 'Geolocation not supported',
      }));
      return;
    }

    setState((s) => ({ ...s, status: 'loading' }));

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        updateLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      },
      (err) => {
        const msg =
          err.code === 1
            ? 'Location permission denied'
            : err.code === 2
              ? 'Position unavailable'
              : err.code === 3
                ? 'Location request timed out'
                : 'Could not get location';
        setState({
          latitude: FALLBACK_CENTER[1],
          longitude: FALLBACK_CENTER[0],
          isLive: false,
          status: err.code === 1 ? 'denied' : 'error',
          errorMessage: msg,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 60000,
      }
    );
  }, [updateLocation]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const value = useMemo<LocationContextValue>(
    () => ({
      ...state,
      refresh,
    }),
    [state, refresh]
  );

  return (
    <LocationContext.Provider value={value}>{children}</LocationContext.Provider>
  );
}

export function useLocation() {
  const ctx = useContext(LocationContext);
  if (!ctx) {
    throw new Error('useLocation must be used within LocationProvider');
  }
  return ctx;
}

/** Returns [lng, lat] for MapLibre */
export function useMapCenter(): [number, number] {
  const { longitude, latitude } = useLocation();
  return [longitude, latitude];
}
