import type { Hike, HikeProvider } from "../../types";
import { normalizeRawHike, type RawHikeRecord } from "../normalizeHike";
import { isStavangerLocation, stavangerRawHikeRecords } from "../locationHikeCatalog";

const rawHikeRecords: RawHikeRecord[] = [
  {
    id: "waihee-ridge",
    title: "Waihee Ridge Trail",
    rating: 4.8,
    reviewCount: 1240,
    difficulty: "moderate",
    estimatedHours: 3.5,
    distanceKm: 7.2,
    highlights: ["Ridge views", "Cloud forest", "Great sunrise"],
    description:
      "A lush ridge climb with dramatic valley and ocean views. Best in the morning for clear conditions.",
    trailhead: {
      name: "Waihee Ridge Trailhead",
      lat: 20.9423,
      lng: -156.5416,
      parkingNote: "Small lot. Arrive early.",
      qualityConfidence: 0.95,
      source: "Maui County trail directory"
    }
  },
  {
    id: "kapalua-coastal",
    title: "Kapalua Coastal Trail",
    rating: 4.7,
    reviewCount: 1520,
    difficulty: "easy",
    estimatedHours: 1.5,
    distanceKm: 4,
    highlights: ["Ocean cliffs", "Easy terrain", "Family friendly"],
    description: "A scenic coastal walk with minimal elevation gain and excellent ocean views.",
    trailhead: {
      name: "Kapalua Coastal Trail Start",
      lat: 20.9959,
      lng: -156.6662,
      parkingNote: "Resort-area parking nearby.",
      qualityConfidence: 0.93,
      source: "Destination trail map"
    }
  }
];

export class MockApiHikeProvider implements HikeProvider {
  constructor(private readonly records: unknown[] | null = null) {}

  async listNearbyHikes(baseLocationLabel: string): Promise<Hike[]> {
    await new Promise((resolve) => setTimeout(resolve, 240));

    // Useful for local testing of fallback paths.
    if (baseLocationLabel.toLowerCase().includes("offline")) {
      throw new Error("Mock API unavailable");
    }

    const selectedRecords = this.records ?? (isStavangerLocation(baseLocationLabel) ? stavangerRawHikeRecords : rawHikeRecords);

    const normalized = selectedRecords.flatMap((record) => {
      try {
        return [normalizeRawHike(record)];
      } catch {
        return [];
      }
    });

    if (normalized.length === 0) {
      throw new Error("Mock API returned no valid records");
    }

    return normalized;
  }
}

export const mockApiHikeProvider: HikeProvider = new MockApiHikeProvider();
