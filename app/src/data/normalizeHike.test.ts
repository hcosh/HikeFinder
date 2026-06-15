import { describe, expect, it } from "vitest";
import { normalizeRawHike } from "./normalizeHike";

describe("normalizeRawHike", () => {
  it("maps valid raw payload into app hike shape", () => {
    const normalized = normalizeRawHike({
      id: "trail-1",
      title: "Twin Falls",
      rating: 4.6,
      reviewCount: 240,
      difficulty: "moderate",
      estimatedHours: 2.5,
      distanceKm: 5.2,
      highlights: ["Waterfall", "Forest"],
      description: "Waterfalls and bamboo forest",
      trailhead: {
        name: "Twin Falls Trailhead",
        lat: 20.99,
        lng: -156.12,
        qualityConfidence: 0.9,
        source: "mock-api"
      }
    });

    expect(normalized).toEqual({
      id: "trail-1",
      name: "Twin Falls",
      rating: 4.6,
      reviews: 240,
      difficulty: "moderate",
      hours: 2.5,
      distanceKm: 5.2,
      highlights: ["Waterfall", "Forest"],
      summary: "Waterfalls and bamboo forest",
      trailhead: {
        label: "Twin Falls Trailhead",
        coordinates: { lat: 20.99, lng: -156.12 },
        parkingNote: undefined,
        qualityConfidence: 0.9,
        source: "mock-api"
      }
    });
  });

  it("throws for invalid raw payload", () => {
    expect(() =>
      normalizeRawHike({
        id: "trail-2",
        title: "Broken",
        rating: 4.2,
        reviewCount: 12,
        difficulty: "moderate",
        estimatedHours: "not-a-number"
      })
    ).toThrow();
  });
});
