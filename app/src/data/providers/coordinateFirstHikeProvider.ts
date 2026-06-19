import type { Coordinates, Difficulty, Hike, HikeProvider } from "../../types";
import { getDistanceKm } from "../../lib/filterHikes";
import {
  getAllCatalogHikes,
  getBaseCoordinatesForLocation,
  parseCoordinateLabel
} from "../locationHikeCatalog";

const radiusExpansionKm = [20, 50, 120, 250];
const syntheticTrailNames = [
  "Ridge Loop",
  "Summit Connector",
  "Forest Traverse",
  "Valley Outlook Path",
  "Lakefront Ascent",
  "Canyon Spur",
  "Hilltop Circuit",
  "Sunset Panorama Trail"
] as const;
const syntheticOffsetsKm = [
  { latKm: 2, lngKm: 1.5 },
  { latKm: -3, lngKm: 2.5 },
  { latKm: 4.2, lngKm: -1.8 },
  { latKm: -5.5, lngKm: -2.2 },
  { latKm: 7.1, lngKm: 3.8 },
  { latKm: -8.2, lngKm: 4.4 },
  { latKm: 10.4, lngKm: -4.7 },
  { latKm: -12.8, lngKm: -5.3 }
] as const;
const syntheticDifficulties: Difficulty[] = ["easy", "moderate", "easy", "moderate", "hard", "moderate", "hard", "easy"];
const geocodeCache = new Map<string, Coordinates | null>();

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function geocodeBaseLocation(baseLocationLabel: string): Promise<Coordinates | null> {
  const normalizedLabel = baseLocationLabel.trim().toLowerCase();
  if (geocodeCache.has(normalizedLabel)) {
    return geocodeCache.get(normalizedLabel) ?? null;
  }

  if (normalizedLabel.includes("offline")) {
    geocodeCache.set(normalizedLabel, null);
    return null;
  }

  const parsed = parseCoordinateLabel(baseLocationLabel);
  if (parsed) {
    geocodeCache.set(normalizedLabel, parsed);
    return parsed;
  }

  const known = getBaseCoordinatesForLocation(baseLocationLabel);
  if (known) {
    geocodeCache.set(normalizedLabel, known);
    return known;
  }

  const query = encodeURIComponent(baseLocationLabel.trim());
  if (!query) {
    geocodeCache.set(normalizedLabel, null);
    return null;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3000);

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${query}`,
      {
        headers: {
          Accept: "application/json"
        },
        signal: controller.signal
      }
    );

    if (!response.ok) {
      geocodeCache.set(normalizedLabel, null);
      return null;
    }

    const payload = (await response.json()) as Array<{ lat?: string; lon?: string }>;
    const first = payload[0];
    if (!first?.lat || !first?.lon) {
      geocodeCache.set(normalizedLabel, null);
      return null;
    }

    const lat = Number(first.lat);
    const lng = Number(first.lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      geocodeCache.set(normalizedLabel, null);
      return null;
    }

    const resolved = { lat, lng };
    geocodeCache.set(normalizedLabel, resolved);
    return resolved;
  } catch {
    geocodeCache.set(normalizedLabel, null);
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

function createSyntheticNearbyHikes(baseLocationLabel: string, center: Coordinates): Hike[] {
  const label = baseLocationLabel.trim() || "Selected area";
  const labelSlug = slugify(label) || "selected-area";
  const cosLat = Math.max(0.2, Math.cos((center.lat * Math.PI) / 180));

  return syntheticOffsetsKm.map((offset, index) => {
    const latOffset = offset.latKm / 111;
    const lngOffset = offset.lngKm / (111 * cosLat);
    const trailhead = {
      lat: center.lat + latOffset,
      lng: center.lng + lngOffset
    };
    const estimatedDistance = Math.max(2.4, Math.round((Math.abs(offset.latKm) + Math.abs(offset.lngKm)) * 1.1));

    return {
      id: `${labelSlug}-synthetic-${index + 1}`,
      name: `${label} ${syntheticTrailNames[index]}`,
      rating: Number((4.2 + (index % 4) * 0.15).toFixed(1)),
      reviews: 180 + index * 55,
      difficulty: syntheticDifficulties[index],
      hours: Number((1.8 + index * 0.45).toFixed(1)),
      distanceKm: estimatedDistance,
      highlights: ["Nearby access", "Scenic viewpoints", "Coordinate-first fallback"],
      summary:
        "Generated nearby route suggestion when curated catalog coverage is limited for this location.",
      trailhead: {
        label: `${label} trail access ${index + 1}`,
        coordinates: trailhead,
        parkingNote: "Verify parking and access conditions before departure.",
        qualityConfidence: 0.66,
        source: "Coordinate-first generated fallback"
      }
    };
  });
}

function selectNearbyCatalogHikes(baseCoordinates: Coordinates): Hike[] {
  const all = getAllCatalogHikes();
  let bestNearby: Hike[] = [];

  for (const radiusKm of radiusExpansionKm) {
    const nearby = all
      .map((hike) => ({
        hike,
        distance: getDistanceKm(baseCoordinates, hike.trailhead.coordinates)
      }))
      .filter((entry) => entry.distance <= radiusKm)
      .sort((a, b) => a.distance - b.distance || b.hike.rating - a.hike.rating)
      .map((entry) => entry.hike)
      .slice(0, 10);

    if (nearby.length > bestNearby.length) {
      bestNearby = nearby;
    }

    if (nearby.length >= 5) {
      return nearby;
    }
  }

  return bestNearby;
}

class CoordinateFirstHikeProvider implements HikeProvider {
  async listNearbyHikes(baseLocationLabel: string): Promise<Hike[]> {
    const baseCoordinates = await geocodeBaseLocation(baseLocationLabel);
    if (!baseCoordinates) {
      throw new Error("Unable to geocode base location");
    }

    const catalogMatches = selectNearbyCatalogHikes(baseCoordinates);
    const generated = createSyntheticNearbyHikes(baseLocationLabel, baseCoordinates);

    if (catalogMatches.length >= 8) {
      return catalogMatches.slice(0, 8);
    }
    if (catalogMatches.length > 0) {
      return [...catalogMatches, ...generated].slice(0, 8);
    }

    return generated;
  }
}

export const coordinateFirstHikeProvider: HikeProvider = new CoordinateFirstHikeProvider();
