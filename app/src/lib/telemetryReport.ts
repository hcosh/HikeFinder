import { getTelemetryEvents, type TelemetryEvent } from "./telemetry";

export type TelemetrySummary = {
  totalEvents: number;
  fallbackUsedCount: number;
  mapsHandoffCount: number;
  fallbackRatePercent: number;
  byName: Record<string, number>;
};

export function summarizeTelemetryEvents(events: TelemetryEvent[]): TelemetrySummary {
  const byName = events.reduce<Record<string, number>>((acc, event) => {
    acc[event.name] = (acc[event.name] ?? 0) + 1;
    return acc;
  }, {});

  const fallbackUsedCount = byName.provider_fallback_used ?? 0;
  const mapsHandoffCount = byName.maps_handoff_opened ?? 0;
  const totalEvents = events.length;
  const fallbackRatePercent = totalEvents === 0 ? 0 : Number(((fallbackUsedCount / totalEvents) * 100).toFixed(1));

  return {
    totalEvents,
    fallbackUsedCount,
    mapsHandoffCount,
    fallbackRatePercent,
    byName
  };
}

export function getTelemetrySummary(): TelemetrySummary {
  return summarizeTelemetryEvents(getTelemetryEvents());
}

export function formatTelemetrySummary(summary: TelemetrySummary): string {
  const eventLines = Object.entries(summary.byName)
    .sort(([nameA], [nameB]) => nameA.localeCompare(nameB))
    .map(([name, count]) => `- ${name}: ${count}`)
    .join("\n");

  return [
    "Telemetry QA Summary",
    `Total events: ${summary.totalEvents}`,
    `Fallback used: ${summary.fallbackUsedCount}`,
    `Maps handoff opened: ${summary.mapsHandoffCount}`,
    `Fallback rate: ${summary.fallbackRatePercent}%`,
    "Event counts:",
    eventLines || "- (none)"
  ].join("\n");
}
