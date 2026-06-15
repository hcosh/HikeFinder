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
});
