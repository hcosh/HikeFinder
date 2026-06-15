import { describe, expect, it } from "vitest";
import { formatTelemetrySummary, summarizeTelemetryEvents } from "./telemetryReport";
import type { TelemetryEvent } from "./telemetry";

describe("telemetryReport", () => {
  it("summarizes fallback frequency and maps handoffs", () => {
    const events: TelemetryEvent[] = [
      { name: "provider_fallback_used", timestamp: "2026-01-01T00:00:00Z", payload: { base: "Maui" } },
      { name: "maps_handoff_opened", timestamp: "2026-01-01T00:01:00Z", payload: { hikeId: "h1" } },
      { name: "maps_handoff_opened", timestamp: "2026-01-01T00:02:00Z", payload: { hikeId: "h2" } }
    ];

    const summary = summarizeTelemetryEvents(events);

    expect(summary.totalEvents).toBe(3);
    expect(summary.fallbackUsedCount).toBe(1);
    expect(summary.mapsHandoffCount).toBe(2);
    expect(summary.fallbackRatePercent).toBeCloseTo(33.3, 1);
  });

  it("formats summary text for QA reports", () => {
    const summary = summarizeTelemetryEvents([]);
    const formatted = formatTelemetrySummary(summary);

    expect(formatted).toContain("Telemetry QA Summary");
    expect(formatted).toContain("Fallback used: 0");
    expect(formatted).toContain("Event counts:");
  });
});
