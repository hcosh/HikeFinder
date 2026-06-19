import { describe, expect, it } from "vitest";
import { MockApiHikeProvider } from "./mockApiHikeProvider";

const validRecord = {
  id: "test-hike",
  title: "Test Hike",
  rating: 4.5,
  reviewCount: 100,
  difficulty: "easy",
  estimatedHours: 2,
  distanceKm: 3.2,
  highlights: ["Ocean view"],
  description: "Test trail",
  trailhead: {
    name: "Test Trailhead",
    lat: 20.99,
    lng: -156.55,
    qualityConfidence: 0.9,
    source: "test"
  }
};

describe("MockApiHikeProvider", () => {
  it("returns Stavanger-area hikes for Stavanger base location", async () => {
    const provider = new MockApiHikeProvider();
    const hikes = await provider.listNearbyHikes("Stavanger");

    expect(hikes.map((hike) => hike.name)).toEqual(
      expect.arrayContaining(["Preikestolen Trail", "Kjeragbolten Trail", "Dalsnuten Loop"])
    );
    expect(hikes[0]?.trailhead.coordinates.lat).toBeGreaterThan(58);
  });

  it("returns global catalog hikes for unrelated base locations", async () => {
    const provider = new MockApiHikeProvider();
    const hikes = await provider.listNearbyHikes("Athens");

    expect(hikes.map((hike) => hike.name)).toEqual(
      expect.arrayContaining(["Lycabettus Hill Loop", "Sugarloaf Foothills Loop"])
    );
    expect(hikes.map((hike) => hike.name)).not.toEqual(expect.arrayContaining(["Waihee Ridge Trail"]));
  });

  it("skips malformed records and returns valid normalized hikes", async () => {
    const provider = new MockApiHikeProvider([
      validRecord,
      {
        id: "broken",
        title: "Broken",
        rating: "not-a-number"
      }
    ]);

    const hikes = await provider.listNearbyHikes("Maui");
    expect(hikes).toHaveLength(1);
    expect(hikes[0]?.id).toBe("test-hike");
  });

  it("throws when all records are malformed", async () => {
    const provider = new MockApiHikeProvider([
      {
        id: "broken",
        title: "Broken",
        rating: "not-a-number"
      }
    ]);

    await expect(provider.listNearbyHikes("Maui")).rejects.toThrow("no valid records");
  });
});
