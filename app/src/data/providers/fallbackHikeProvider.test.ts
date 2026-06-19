import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Hike, HikeProvider } from "../../types";
import { clearTelemetryEvents, getTelemetryEvents } from "../../lib/telemetry";
import { FallbackHikeProvider } from "./fallbackHikeProvider";
import { defaultHikeProvider } from ".";

const sampleHike = (id: string, name: string): Hike => ({
  id,
  name,
  rating: 4.7,
  reviews: 120,
  difficulty: "moderate",
  hours: 2,
  distanceKm: 4,
  highlights: ["Viewpoint"],
  summary: "Sample summary",
  trailhead: {
    label: "Sample Trailhead",
    coordinates: { lat: 20.9, lng: -156.5 },
    qualityConfidence: 0.9,
    source: "test"
  }
});

describe("FallbackHikeProvider", () => {
  beforeEach(() => {
    clearTelemetryEvents();
  });

  it("returns primary result when primary succeeds", async () => {
    const primary: HikeProvider = {
      listNearbyHikes: vi.fn().mockResolvedValue([sampleHike("1", "Primary")])
    };
    const fallback: HikeProvider = {
      listNearbyHikes: vi.fn().mockResolvedValue([sampleHike("2", "Fallback")])
    };

    const provider = new FallbackHikeProvider(primary, fallback);
    const result = await provider.listNearbyHikes("Maui");

    expect(result[0]?.id).toBe("1");
    expect(primary.listNearbyHikes).toHaveBeenCalledOnce();
    expect(fallback.listNearbyHikes).not.toHaveBeenCalled();
  });

  it("uses fallback when primary throws", async () => {
    const primary: HikeProvider = {
      listNearbyHikes: vi.fn().mockRejectedValue(new Error("network down"))
    };
    const fallback: HikeProvider = {
      listNearbyHikes: vi.fn().mockResolvedValue([sampleHike("2", "Fallback")])
    };

    const provider = new FallbackHikeProvider(primary, fallback);
    const result = await provider.listNearbyHikes("Maui");

    expect(result[0]?.id).toBe("2");
    expect(primary.listNearbyHikes).toHaveBeenCalledOnce();
    expect(fallback.listNearbyHikes).toHaveBeenCalledOnce();

    const events = getTelemetryEvents().filter((event) => event.name === "provider_fallback_used");
    expect(events).toHaveLength(1);
    expect(events[0]?.payload).toEqual({ base: "Maui" });
  });

  it("default provider falls back safely when mock API is unavailable", async () => {
    const result = await defaultHikeProvider.listNearbyHikes("offline mode");

    expect(result).toEqual([]);
  });
});
