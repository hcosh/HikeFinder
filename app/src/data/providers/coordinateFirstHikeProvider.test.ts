import { beforeEach, describe, expect, it, vi } from "vitest";
import { coordinateFirstHikeProvider } from "./coordinateFirstHikeProvider";

describe("coordinateFirstHikeProvider", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns nearby catalog hikes for known locations without geocoding", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");

    const hikes = await coordinateFirstHikeProvider.listNearbyHikes("Bergen");

    expect(hikes.length).toBeGreaterThan(0);
    expect(hikes.map((hike) => hike.name)).toEqual(
      expect.arrayContaining(["Ulriken Summit Loop", "Floyen to Vidden Ridge Approach"])
    );
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("geocodes unknown locations and returns generated nearby suggestions", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => [{ lat: "43.615", lon: "-116.2023" }]
    } as Response);

    const hikes = await coordinateFirstHikeProvider.listNearbyHikes("Boise");

    expect(hikes).toHaveLength(8);
    expect(hikes[0]?.name).toContain("Boise");
    expect(hikes.every((hike) => hike.trailhead.source.includes("generated"))).toBe(true);
  });
});
