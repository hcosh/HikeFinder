import type { Coordinates, Difficulty, Hike, HikeProvider } from "../../types";
import { getDistanceKm } from "../../lib/filterHikes";
import {
  getAllCatalogHikes,
  getBaseCoordinatesForLocation,
  parseCoordinateLabel
} from "../locationHikeCatalog";

const radiusExpansionKm = [20, 50, 120, 250];
const geocodeCache = new Map<string, Coordinates | null>();

type OverpassElement = {
  id: number;
  type: "node" | "way" | "relation";
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
};

function estimateDifficulty(tags: Record<string, string>): Difficulty {
  if (tags.sac_scale === "demanding_mountain_hiking" || tags.sac_scale === "mountain_hiking") {
    return "hard";
  }
  if (tags.sac_scale || tags.route === "hiking") {
    return "moderate";
  }
  return "easy";
}

function getElementCoordinates(element: OverpassElement): Coordinates | null {
  if (typeof element.lat === "number" && typeof element.lon === "number") {
    return { lat: element.lat, lng: element.lon };
  }
  if (element.center) {
    return { lat: element.center.lat, lng: element.center.lon };
  }
  return null;
}

function isUsefulTrailElement(element: OverpassElement): boolean {
  const tags = element.tags;
  if (!tags?.name) {
    return false;
  }

  if (tags.route === "hiking" || tags.information === "trailhead") {
    return true;
  }

  if (tags.highway && /path|footway|track/.test(tags.highway) && (tags.sac_scale || tags.trail_visibility)) {
    return true;
  }

  return /trail|loop|track|ridge|summit|path|way/i.test(tags.name);
}

function toHike(baseCoordinates: Coordinates, element: OverpassElement): Hike | null {
  const tags = element.tags;
  const coordinates = getElementCoordinates(element);
  if (!tags?.name || !coordinates) {
    return null;
  }

  const distance = getDistanceKm(baseCoordinates, coordinates);
  const difficulty = estimateDifficulty(tags);
  const baseHours = Math.max(1.2, Math.min(7.5, distance / 3.1));

  return {
    id: `osm-${element.type}-${element.id}`,
    name: tags.name,
    rating: 4.2,
    reviews: 0,
    difficulty,
    hours: Number(baseHours.toFixed(1)),
    distanceKm: Number(distance.toFixed(1)),
    highlights: ["OpenStreetMap trail data", "Nearby route", "Coordinate-first search"],
    summary: `Trail data sourced from OpenStreetMap near the selected location (${distance.toFixed(1)} km away).`,
    trailhead: {
      label: tags.name,
      coordinates,
      qualityConfidence: 0.74,
      source: "OpenStreetMap Overpass"
    }
  };
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

async function fetchNearbyOpenStreetMapHikes(baseCoordinates: Coordinates): Promise<Hike[]> {
  for (const radiusKm of radiusExpansionKm) {
    const radiusMeters = Math.round(radiusKm * 1000);
    const query = `[out:json][timeout:20];
(
  relation(around:${radiusMeters},${baseCoordinates.lat},${baseCoordinates.lng})["route"="hiking"]["name"];
  relation(around:${radiusMeters},${baseCoordinates.lat},${baseCoordinates.lng})["route"="foot"]["name"];
  way(around:${radiusMeters},${baseCoordinates.lat},${baseCoordinates.lng})["highway"~"path|footway|track"]["name"];
  node(around:${radiusMeters},${baseCoordinates.lat},${baseCoordinates.lng})["tourism"="information"]["information"="trailhead"]["name"];
);
out center tags;`;

    const response = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: `data=${encodeURIComponent(query)}`
    });

    if (!response.ok) {
      continue;
    }

    const payload = (await response.json()) as { elements?: OverpassElement[] };
    const elements = payload.elements ?? [];
    const hikes = elements
      .filter(isUsefulTrailElement)
      .map((element) => toHike(baseCoordinates, element))
      .filter((hike): hike is Hike => Boolean(hike))
      .sort((a, b) => a.distanceKm - b.distanceKm)
      .filter((hike, index, array) => array.findIndex((item) => item.name === hike.name) === index)
      .slice(0, 10);

    if (hikes.length >= 5) {
      return hikes;
    }
    if (hikes.length > 0) {
      return hikes;
    }
  }

  return [];
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

    const osmHikes = await fetchNearbyOpenStreetMapHikes(baseCoordinates);
    if (osmHikes.length > 0) {
      return osmHikes;
    }

    const catalogMatches = selectNearbyCatalogHikes(baseCoordinates);
    if (catalogMatches.length > 0) {
      return catalogMatches.slice(0, 8);
    }

    throw new Error("No nearby hikes found from OSM or curated catalog");
  }
}

export const coordinateFirstHikeProvider: HikeProvider = new CoordinateFirstHikeProvider();
