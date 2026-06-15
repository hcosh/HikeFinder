import type { Hike } from "../types";
import type { RawHikeRecord } from "./normalizeHike";

const stavangerKeywordMatches = ["stavanger", "rogaland", "norway", "sandnes", "lysefjord"];

export function isStavangerLocation(baseLocationLabel: string): boolean {
  const normalized = baseLocationLabel.toLowerCase();
  return stavangerKeywordMatches.some((keyword) => normalized.includes(keyword));
}

export const stavangerHikes: Hike[] = [
  {
    id: "preikestolen",
    name: "Preikestolen Trail",
    rating: 4.9,
    reviews: 2140,
    difficulty: "moderate",
    hours: 4,
    distanceKm: 8.2,
    highlights: ["Lysefjord views", "Cliff platform", "Classic Stavanger day hike"],
    summary:
      "A signature hike from Stavanger with a steady climb to one of Norway's most iconic viewpoints.",
    trailhead: {
      label: "Preikestolen Parking",
      coordinates: { lat: 58.9869, lng: 6.1889 },
      parkingNote: "Large designated lot near the trail start.",
      transitOptions: [
        {
          mode: "mixed",
          routeLabel: "Kolumbus bus + ferry + shuttle",
          boardAt: "Stavanger bus terminal",
          alightAt: "Preikestolen BaseCamp",
          walkMinutes: 10,
          durationMinutes: 95,
          frequency: "Every 60 minutes in season",
          notes: "Check seasonal ferry-shuttle coordination before departure."
        }
      ],
      qualityConfidence: 0.98,
      source: "Visit Stavanger trail guide"
    }
  },
  {
    id: "kjeragbolten",
    name: "Kjeragbolten Trail",
    rating: 4.8,
    reviews: 1680,
    difficulty: "hard",
    hours: 6.5,
    distanceKm: 12.0,
    highlights: ["Mountain plateau", "Lysefjord exposure", "Famous boulder"],
    summary:
      "A demanding alpine outing from the Stavanger region with steep sections and dramatic fjord scenery.",
    trailhead: {
      label: "Øygardstøl Trailhead",
      coordinates: { lat: 59.0223, lng: 6.5784 },
      parkingNote: "Paid parking at the mountain lodge.",
      transitOptions: [
        {
          mode: "shuttle",
          routeLabel: "Seasonal Lysebotn mountain shuttle",
          boardAt: "Stavanger city center pickup",
          alightAt: "Øygardstøl trailhead",
          walkMinutes: 4,
          durationMinutes: 150,
          frequency: "1-2 departures daily (seasonal)",
          notes: "Advance booking recommended; weather cancellations possible."
        }
      ],
      qualityConfidence: 0.97,
      source: "Region Stavanger trail guide"
    }
  },
  {
    id: "dalsnuten",
    name: "Dalsnuten Loop",
    rating: 4.6,
    reviews: 930,
    difficulty: "easy",
    hours: 2,
    distanceKm: 4.8,
    highlights: ["Quick summit", "City views", "Family-friendly"],
    summary:
      "A shorter Stavanger-area summit hike with broad city and fjord views, ideal when time is limited.",
    trailhead: {
      label: "Gramstad Trailhead",
      coordinates: { lat: 58.9187, lng: 5.7319 },
      parkingNote: "Trailhead parking at Gramstad.",
      transitOptions: [
        {
          mode: "bus",
          routeLabel: "Kolumbus bus 23",
          boardAt: "Stavanger sentrum",
          alightAt: "Gramstad stop",
          walkMinutes: 7,
          durationMinutes: 35,
          frequency: "Every 30 minutes",
          notes: "Most reliable public option for a half-day local hike."
        }
      ],
      qualityConfidence: 0.94,
      source: "Local hiking association"
    }
  }
];

export const stavangerRawHikeRecords: RawHikeRecord[] = [
  {
    id: "preikestolen",
    title: "Preikestolen Trail",
    rating: 4.9,
    reviewCount: 2140,
    difficulty: "moderate",
    estimatedHours: 4,
    distanceKm: 8.2,
    highlights: ["Lysefjord views", "Cliff platform", "Classic Stavanger day hike"],
    description:
      "A signature hike from Stavanger with a steady climb to one of Norway's most iconic viewpoints.",
    trailhead: {
      name: "Preikestolen Parking",
      lat: 58.9869,
      lng: 6.1889,
      parkingNote: "Large designated lot near the trail start.",
      transitOptions: [
        {
          mode: "mixed",
          routeLabel: "Kolumbus bus + ferry + shuttle",
          boardAt: "Stavanger bus terminal",
          alightAt: "Preikestolen BaseCamp",
          walkMinutes: 10,
          durationMinutes: 95,
          frequency: "Every 60 minutes in season",
          notes: "Check seasonal ferry-shuttle coordination before departure."
        }
      ],
      qualityConfidence: 0.98,
      source: "Visit Stavanger trail guide"
    }
  },
  {
    id: "kjeragbolten",
    title: "Kjeragbolten Trail",
    rating: 4.8,
    reviewCount: 1680,
    difficulty: "hard",
    estimatedHours: 6.5,
    distanceKm: 12.0,
    highlights: ["Mountain plateau", "Lysefjord exposure", "Famous boulder"],
    description:
      "A demanding alpine outing from the Stavanger region with steep sections and dramatic fjord scenery.",
    trailhead: {
      name: "Øygardstøl Trailhead",
      lat: 59.0223,
      lng: 6.5784,
      parkingNote: "Paid parking at the mountain lodge.",
      transitOptions: [
        {
          mode: "shuttle",
          routeLabel: "Seasonal Lysebotn mountain shuttle",
          boardAt: "Stavanger city center pickup",
          alightAt: "Øygardstøl trailhead",
          walkMinutes: 4,
          durationMinutes: 150,
          frequency: "1-2 departures daily (seasonal)",
          notes: "Advance booking recommended; weather cancellations possible."
        }
      ],
      qualityConfidence: 0.97,
      source: "Region Stavanger trail guide"
    }
  },
  {
    id: "dalsnuten",
    title: "Dalsnuten Loop",
    rating: 4.6,
    reviewCount: 930,
    difficulty: "easy",
    estimatedHours: 2,
    distanceKm: 4.8,
    highlights: ["Quick summit", "City views", "Family-friendly"],
    description:
      "A shorter Stavanger-area summit hike with broad city and fjord views, ideal when time is limited.",
    trailhead: {
      name: "Gramstad Trailhead",
      lat: 58.9187,
      lng: 5.7319,
      parkingNote: "Trailhead parking at Gramstad.",
      transitOptions: [
        {
          mode: "bus",
          routeLabel: "Kolumbus bus 23",
          boardAt: "Stavanger sentrum",
          alightAt: "Gramstad stop",
          walkMinutes: 7,
          durationMinutes: 35,
          frequency: "Every 30 minutes",
          notes: "Most reliable public option for a half-day local hike."
        }
      ],
      qualityConfidence: 0.94,
      source: "Local hiking association"
    }
  }
];