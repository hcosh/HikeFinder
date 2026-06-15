const TELEMETRY_KEY = "holiday-hiking-telemetry-events";

export type TelemetryEvent = {
  name: string;
  timestamp: string;
  payload: Record<string, string | number | boolean>;
};

export function trackEvent(name: string, payload: Record<string, string | number | boolean>) {
  const event: TelemetryEvent = {
    name,
    timestamp: new Date().toISOString(),
    payload
  };

  try {
    const raw = localStorage.getItem(TELEMETRY_KEY);
    const current: TelemetryEvent[] = raw ? (JSON.parse(raw) as TelemetryEvent[]) : [];
    const next = [...current.slice(-49), event];
    localStorage.setItem(TELEMETRY_KEY, JSON.stringify(next));
  } catch {
    // Best-effort telemetry; do not block user flow.
  }

  // Keeps signal visible during local development.
  // eslint-disable-next-line no-console
  console.info("[telemetry]", event);
}

export function getTelemetryEvents(): TelemetryEvent[] {
  try {
    const raw = localStorage.getItem(TELEMETRY_KEY);
    return raw ? (JSON.parse(raw) as TelemetryEvent[]) : [];
  } catch {
    return [];
  }
}

export function getTelemetryEventsJson(): string {
  return JSON.stringify(getTelemetryEvents(), null, 2);
}

export function downloadTelemetryEvents(filename = "telemetry-events.json"): boolean {
  if (typeof document === "undefined") {
    return false;
  }

  try {
    const blob = new Blob([getTelemetryEventsJson()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
    return true;
  } catch {
    return false;
  }
}

export function clearTelemetryEvents(): void {
  localStorage.removeItem(TELEMETRY_KEY);
}