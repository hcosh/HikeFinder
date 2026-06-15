import { describe, expect, it } from "vitest";
import { buildGoogleMapsDirectionsUrl } from "./googleMaps";

describe("buildGoogleMapsDirectionsUrl", () => {
  it("builds a valid Google Maps directions URL", () => {
    const url = buildGoogleMapsDirectionsUrl({ lat: 20.9959, lng: -156.6662 });
    expect(url).toContain("https://www.google.com/maps/dir/");
    expect(url).toContain("api=1");
    expect(url).toContain("travelmode=driving");
  });

  it("returns null for invalid latitude", () => {
    const url = buildGoogleMapsDirectionsUrl({ lat: 120, lng: -156.6662 });
    expect(url).toBeNull();
  });

  it("returns null for invalid longitude", () => {
    const url = buildGoogleMapsDirectionsUrl({ lat: 20.9959, lng: -300 });
    expect(url).toBeNull();
  });
});
