import { describe, expect, it } from "vitest";
import { filterAndSortHikes } from "./filterHikes";
import { hikes } from "../data/hikes";
import type { HikeFilters } from "../types";

describe("filterAndSortHikes", () => {
  it("filters by difficulty and rating", () => {
    const filters: HikeFilters = {
      difficulty: "easy",
      maxDistanceKm: 50,
      maxHours: 10,
      minRating: 4.6
    };

    const result = filterAndSortHikes(hikes, filters);
    expect(result.length).toBe(1);
    expect(result[0].id).toBe("kapalua-coastal");
  });

  it("sorts by rating descending after filters", () => {
    const filters: HikeFilters = {
      difficulty: "all",
      maxDistanceKm: 50,
      maxHours: 10,
      minRating: 4.5
    };

    const result = filterAndSortHikes(hikes, filters);
    const ratings = result.map((hike) => hike.rating);
    expect(ratings).toEqual([...ratings].sort((a, b) => b - a));
  });

  it("filters by proximity to base location when base coordinates are provided", () => {
    const filters: HikeFilters = {
      difficulty: "all",
      maxDistanceKm: 20,
      maxHours: 12,
      minRating: 0
    };

    const sample = [
      {
        ...hikes[0],
        id: "nearby",
        trailhead: {
          ...hikes[0].trailhead,
          coordinates: { lat: 41.39, lng: 2.17 }
        }
      },
      {
        ...hikes[1],
        id: "far-away",
        trailhead: {
          ...hikes[1].trailhead,
          coordinates: { lat: 41.89, lng: 2.17 }
        }
      }
    ];

    const result = filterAndSortHikes(sample, filters, { lat: 41.3851, lng: 2.1734 });
    expect(result.map((hike) => hike.id)).toEqual(["nearby"]);
  });
});
