import { beforeEach, describe, expect, it } from "vitest";
import { clearTelemetryEvents, getTelemetryEvents, getTelemetryEventsJson, trackEvent } from "./telemetry";

describe("telemetry", () => {
  beforeEach(() => {
    clearTelemetryEvents();
  });

  it("stores events with payload", () => {
    trackEvent("hikes_loaded", { count: 3, base: "Maui" });
    const events = getTelemetryEvents();

    expect(events).toHaveLength(1);
    expect(events[0]?.name).toBe("hikes_loaded");
    expect(events[0]?.payload).toEqual({ count: 3, base: "Maui" });
  });

  it("exports telemetry as JSON", () => {
    trackEvent("provider_fallback_used", { base: "Maui" });

    const json = getTelemetryEventsJson();
    const parsed = JSON.parse(json) as Array<{ name: string }>;

    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed[0]?.name).toBe("provider_fallback_used");
  });
});
