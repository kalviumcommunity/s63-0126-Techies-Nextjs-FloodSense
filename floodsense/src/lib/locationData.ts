/**
 * Location-specific flood metrics.
 * In production, this would come from APIs/real-time sensors.
 */

export interface LocationMetrics {
  rainIntensity: string;
  riverHeight: string;
  evacuationZones: string;
  sensorsOnline: string;
  status: "elevated" | "critical" | "normal" | "safe";
  surgeWindow?: {
    start: string;
    end: string;
    action: string;
  };
}

export const LOCATION_METRICS: Record<string, LocationMetrics> = {
  "Northern Corridor": {
    rainIntensity: "18 mm/hr",
    riverHeight: "4.8 m",
    evacuationZones: "6 active",
    sensorsOnline: "128 of 132",
    status: "elevated",
    surgeWindow: {
      start: "19:20",
      end: "20:05",
      action: "Prepare mobile barriers and re-route traffic away from Zone D.",
    },
  },
  Shamli: {
    rainIntensity: "12 mm/hr",
    riverHeight: "3.2 m",
    evacuationZones: "2 active",
    sensorsOnline: "24 of 28",
    status: "normal",
    surgeWindow: {
      start: "20:00",
      end: "21:30",
      action: "Monitor water levels. Shelters on standby.",
    },
  },
  "Lower Delta": {
    rainIntensity: "24 mm/hr",
    riverHeight: "5.6 m",
    evacuationZones: "8 active",
    sensorsOnline: "94 of 98",
    status: "critical",
    surgeWindow: {
      start: "18:45",
      end: "19:50",
      action: "Evacuate Zone 4. Deploy mobile barriers at checkpoints.",
    },
  },
  "Harbor East": {
    rainIntensity: "8 mm/hr",
    riverHeight: "2.1 m",
    evacuationZones: "1 active",
    sensorsOnline: "42 of 44",
    status: "safe",
  },
  Riverwalk: {
    rainIntensity: "15 mm/hr",
    riverHeight: "3.9 m",
    evacuationZones: "4 active",
    sensorsOnline: "56 of 60",
    status: "elevated",
    surgeWindow: {
      start: "19:30",
      end: "20:45",
      action: "Bridge closures recommended. Notify transit authority.",
    },
  },
};
