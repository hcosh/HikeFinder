import type { Hike, HikeProvider } from "../../types";
import { normalizeRawHike, type RawHikeRecord } from "../normalizeHike";
import {
  getGlobalCatalogRawRecordsForLocation,
  resolveLocationCatalog,
  stavangerRawHikeRecords
} from "../locationHikeCatalog";

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
  },
  {
    id: "lahaina-pali",
    title: "Lahaina Pali Trail",
    rating: 4.6,
    reviewCount: 890,
    difficulty: "hard",
    estimatedHours: 4.5,
    distanceKm: 8.7,
    highlights: ["Historic route", "Sweeping coast", "Windy ridgelines"],
    description:
      "A rugged, exposed trail with steep sections and broad coastal views. Bring sun protection.",
    trailhead: {
      name: "Lahaina Pali Trail (Maalaea side)",
      lat: 20.7905,
      lng: -156.4978,
      parkingNote: "Limited shoulder parking.",
      qualityConfidence: 0.88,
      source: "Hiking community dataset"
    }
  },
  {
    id: "makawao-forest-loop",
    title: "Makawao Forest Loop",
    rating: 4.5,
    reviewCount: 540,
    difficulty: "easy",
    estimatedHours: 2,
    distanceKm: 5.3,
    highlights: ["Cool forest", "Shaded path", "Great for warm days"],
    description:
      "A mellow forest route with shade and softer terrain, ideal for a low-stress morning.",
    trailhead: {
      name: "Makawao Forest Reserve Entrance",
      lat: 20.8543,
      lng: -156.3043,
      parkingNote: "Parking lot at reserve entrance.",
      qualityConfidence: 0.91,
      source: "State reserve metadata"
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

    const catalog = resolveLocationCatalog(baseLocationLabel);
    const selectedRecords =
      this.records ??
      (catalog === "maui"
        ? rawHikeRecords
        : catalog === "stavanger"
          ? stavangerRawHikeRecords
          : getGlobalCatalogRawRecordsForLocation(baseLocationLabel));

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
