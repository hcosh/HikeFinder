export type Difficulty = "easy" | "moderate" | "hard";

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Trailhead {
  label: string;
  coordinates: Coordinates;
  parkingNote?: string;
  qualityConfidence: number;
  source: string;
}

export interface Hike {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  difficulty: Difficulty;
  hours: number;
  distanceKm: number;
  highlights: string[];
  summary: string;
  trailhead: Trailhead;
}

export interface BaseLocation {
  label: string;
  coordinates?: Coordinates;
}

export interface HikeFilters {
  maxHours: number;
  maxDistanceKm: number;
  difficulty: "all" | Difficulty;
  minRating: number;
}

export interface HikeProvider {
  listNearbyHikes(baseLocationLabel: string): Promise<Hike[]>;
}