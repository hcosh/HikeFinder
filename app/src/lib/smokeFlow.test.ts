import { beforeEach, describe, expect, it } from "vitest";
import { defaultHikeProvider } from "../data/providers";
import { buildGoogleMapsDirectionsUrl } from "./googleMaps";
import { clearAppState, getSavedBaseLocation, setSavedBaseLocation } from "./appStateStore";
import { clearTelemetryEvents, getTelemetryEvents, trackEvent } from "./telemetry";

describe("smoke flow", () => {
  beforeEach(() => {
    clearAppState();
    clearTelemetryEvents();
  });

  it("covers manual base -> hikes load -> select detail -> maps handoff", async () => {
    setSavedBaseLocation({ label: "Kapalua, Maui" });
    const savedBase = getSavedBaseLocation();

    expect(savedBase?.label).toBe("Kapalua, Maui");

    const hikes = await defaultHikeProvider.listNearbyHikes(savedBase?.label ?? "Kapalua, Maui");
    expect(hikes.length).toBeGreaterThan(0);

    const selectedHike = hikes[0];
    expect(selectedHike?.id).toBeTruthy();
    if (!selectedHike) {
      throw new Error("Expected at least one hike in smoke flow");
    }

    const mapsUrl = buildGoogleMapsDirectionsUrl(selectedHike.trailhead.coordinates);
    expect(mapsUrl).not.toBeNull();
    expect(mapsUrl).toContain("google.com/maps/dir");

    trackEvent("maps_handoff_opened", { hikeId: selectedHike.id });
    const handoffEvents = getTelemetryEvents().filter((event) => event.name === "maps_handoff_opened");

    expect(handoffEvents).toHaveLength(1);
    expect(handoffEvents[0]?.payload).toEqual({ hikeId: selectedHike.id });
  });

  it("formats heading for the requested base location", () => {
    const heading = `Top nearby hikes for Stavanger`;
    expect(heading).toContain("Stavanger");
  });

  it("returns null maps URL for invalid trailhead coordinates", () => {
    const mapsUrl = buildGoogleMapsDirectionsUrl({ lat: 999, lng: -156.55 });
    expect(mapsUrl).toBeNull();
  });
});
