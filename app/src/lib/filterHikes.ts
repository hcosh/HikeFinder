import type { Hike, HikeFilters } from "../types";

export function filterAndSortHikes(hikes: Hike[], filters: HikeFilters): Hike[] {
  return hikes
    .filter((hike) => hike.hours <= filters.maxHours)
    .filter((hike) => hike.distanceKm <= filters.maxDistanceKm)
    .filter((hike) => (filters.difficulty === "all" ? true : hike.difficulty === filters.difficulty))
    .filter((hike) => hike.rating >= filters.minRating)
    .sort((a, b) => b.rating - a.rating);
}
