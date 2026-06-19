import { beforeEach, describe, expect, it, vi } from "vitest";
import { coordinateFirstHikeProvider } from "./coordinateFirstHikeProvider";

describe("coordinateFirstHikeProvider", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("falls back to nearby curated hikes when OSM query has no matches", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({ elements: [] })
    } as Response);

    const hikes = await coordinateFirstHikeProvider.listNearbyHikes("Bergen");

    expect(hikes.length).toBeGreaterThan(0);
    expect(hikes.map((hike) => hike.name)).toEqual(
      expect.arrayContaining(["Ulriken Summit Loop", "Floyen to Vidden Ridge Approach"])
    );
  });

  it("geocodes unknown locations and returns OSM trail matches", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch");
    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [{ lat: "43.615", lon: "-116.2023" }]
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          elements: [
            {
              id: 1,
              type: "relation",
              center: { lat: 43.632, lon: -116.188 },
              tags: { name: "Camel's Back Ridge Trail", route: "hiking" }
            },
            {
              id: 2,
              type: "way",
              center: { lat: 43.599, lon: -116.171 },
              geometry: [
                { lat: 43.5981, lon: -116.1732 },
                { lat: 43.5999, lon: -116.1711 },
                { lat: 43.6017, lon: -116.1696 }
              ],
              tags: { name: "Table Rock Path", highway: "path", sac_scale: "hiking" }
            }
          ]
        })
      } as Response);

    const hikes = await coordinateFirstHikeProvider.listNearbyHikes("Boise");

    expect(hikes.map((hike) => hike.name)).toEqual(
      expect.arrayContaining(["Camel's Back Ridge Trail", "Table Rock Path"])
    );
    expect(hikes.every((hike) => hike.trailhead.source === "OpenStreetMap Overpass")).toBe(true);
    const routePreviewHike = hikes.find((hike) => hike.name === "Table Rock Path");
    expect(routePreviewHike?.trailhead.routeGeometry?.length).toBeGreaterThan(1);
  });
});
