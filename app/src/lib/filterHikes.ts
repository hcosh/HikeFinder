import type { Coordinates, Hike, HikeFilters } from "../types";

function toRadians(value: number): number {
  return (value * Math.PI) / 180;
}

export function getDistanceKm(a: Coordinates, b: Coordinates): number {
  const earthRadiusKm = 6371;
  const deltaLat = toRadians(b.lat - a.lat);
  const deltaLng = toRadians(b.lng - a.lng);
  const lat1 = toRadians(a.lat);
  const lat2 = toRadians(b.lat);

  const haversine =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);

  return 2 * earthRadiusKm * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
}

export function filterAndSortHikes(
  hikes: Hike[],
  filters: HikeFilters,
  baseCoordinates?: Coordinates | null
): Hike[] {
  return hikes
    .filter((hike) => hike.hours <= filters.maxHours)
    .filter((hike) => {
      if (!baseCoordinates) {
        return hike.distanceKm <= filters.maxDistanceKm;
      }
      return getDistanceKm(baseCoordinates, hike.trailhead.coordinates) <= filters.maxDistanceKm;
    })
    .filter((hike) => (filters.difficulty === "all" ? true : hike.difficulty === filters.difficulty))
    .filter((hike) => hike.rating >= filters.minRating)
    .sort((a, b) => b.rating - a.rating);
}
