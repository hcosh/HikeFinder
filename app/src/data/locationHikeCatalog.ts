import type { Hike } from "../types";
import type { RawHikeRecord } from "./normalizeHike";

const mauiKeywordMatches = [
  "maui",
  "hawaii",
  "kapalua",
  "lahaina",
  "wailea",
  "kihei",
  "kahului"
];
const stavangerKeywordMatches = ["stavanger", "rogaland", "norway", "sandnes", "lysefjord"];

export type LocationCatalog = "maui" | "stavanger" | "global";

export function isStavangerLocation(baseLocationLabel: string): boolean {
  const normalized = baseLocationLabel.toLowerCase();
  return stavangerKeywordMatches.some((keyword) => normalized.includes(keyword));
}

export function isMauiLocation(baseLocationLabel: string): boolean {
  const normalized = baseLocationLabel.toLowerCase();
  return mauiKeywordMatches.some((keyword) => normalized.includes(keyword));
}

export function resolveLocationCatalog(baseLocationLabel: string): LocationCatalog {
  if (isMauiLocation(baseLocationLabel)) {
    return "maui";
  }
  if (isStavangerLocation(baseLocationLabel)) {
    return "stavanger";
  }
  return "global";
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
  },
  {
    id: "moslifjellet",
    name: "Moslifjellet Ridge",
    rating: 4.5,
    reviews: 620,
    difficulty: "moderate",
    hours: 3,
    distanceKm: 6.3,
    highlights: ["Lake viewpoints", "Gravel ridge", "Half-day route"],
    summary:
      "A balanced Stavanger-region hike with moderate climbing and broad ridge views over local lakes.",
    trailhead: {
      label: "Melsheia Parking",
      coordinates: { lat: 58.9016, lng: 5.7812 },
      parkingNote: "Marked lot near ski trails.",
      transitOptions: [
        {
          mode: "bus",
          routeLabel: "Kolumbus bus 25",
          boardAt: "Stavanger bus terminal",
          alightAt: "Melsheia stop",
          walkMinutes: 9,
          durationMinutes: 42,
          frequency: "Every 30 minutes",
          notes: "Reliable urban bus connection with short final walk."
        }
      ],
      qualityConfidence: 0.92,
      source: "Sandnes municipality trails"
    }
  },
  {
    id: "lifjell-sandnes",
    name: "Lifjell Out-and-Back",
    rating: 4.4,
    reviews: 510,
    difficulty: "easy",
    hours: 2.5,
    distanceKm: 5.7,
    highlights: ["Gentle ascent", "Woodland trails", "Great after-work hike"],
    summary:
      "A straightforward Sandnes-area route with steady terrain and rewarding local panorama points.",
    trailhead: {
      label: "Dale trail parking",
      coordinates: { lat: 58.8469, lng: 5.8185 },
      parkingNote: "Free trail parking with limited spaces.",
      transitOptions: [
        {
          mode: "train",
          routeLabel: "Jaren commuter rail + local bus",
          boardAt: "Stavanger Station",
          alightAt: "Sandnes sentrum",
          walkMinutes: 12,
          durationMinutes: 46,
          frequency: "Every 30 minutes",
          notes: "Use local connector bus from Sandnes center during weekend schedules."
        }
      ],
      qualityConfidence: 0.9,
      source: "Rogaland friluftsliv data"
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
  },
  {
    id: "moslifjellet",
    title: "Moslifjellet Ridge",
    rating: 4.5,
    reviewCount: 620,
    difficulty: "moderate",
    estimatedHours: 3,
    distanceKm: 6.3,
    highlights: ["Lake viewpoints", "Gravel ridge", "Half-day route"],
    description:
      "A balanced Stavanger-region hike with moderate climbing and broad ridge views over local lakes.",
    trailhead: {
      name: "Melsheia Parking",
      lat: 58.9016,
      lng: 5.7812,
      parkingNote: "Marked lot near ski trails.",
      transitOptions: [
        {
          mode: "bus",
          routeLabel: "Kolumbus bus 25",
          boardAt: "Stavanger bus terminal",
          alightAt: "Melsheia stop",
          walkMinutes: 9,
          durationMinutes: 42,
          frequency: "Every 30 minutes",
          notes: "Reliable urban bus connection with short final walk."
        }
      ],
      qualityConfidence: 0.92,
      source: "Sandnes municipality trails"
    }
  },
  {
    id: "lifjell-sandnes",
    title: "Lifjell Out-and-Back",
    rating: 4.4,
    reviewCount: 510,
    difficulty: "easy",
    estimatedHours: 2.5,
    distanceKm: 5.7,
    highlights: ["Gentle ascent", "Woodland trails", "Great after-work hike"],
    description:
      "A straightforward Sandnes-area route with steady terrain and rewarding local panorama points.",
    trailhead: {
      name: "Dale trail parking",
      lat: 58.8469,
      lng: 5.8185,
      parkingNote: "Free trail parking with limited spaces.",
      transitOptions: [
        {
          mode: "train",
          routeLabel: "Jaren commuter rail + local bus",
          boardAt: "Stavanger Station",
          alightAt: "Sandnes sentrum",
          walkMinutes: 12,
          durationMinutes: 46,
          frequency: "Every 30 minutes",
          notes: "Use local connector bus from Sandnes center during weekend schedules."
        }
      ],
      qualityConfidence: 0.9,
      source: "Rogaland friluftsliv data"
    }
  }
];

export const globalHikes: Hike[] = [
  {
    id: "table-mountain-platteklip",
    name: "Table Mountain via Platteklip",
    rating: 4.7,
    reviews: 1840,
    difficulty: "hard",
    hours: 4,
    distanceKm: 6,
    highlights: ["City panorama", "Steep stair climb", "Cape coast views"],
    summary: "A steep, direct route to Cape Town's iconic summit plateau with huge city and ocean views.",
    trailhead: {
      label: "Table Mountain lower cable station",
      coordinates: { lat: -33.9628, lng: 18.4105 },
      parkingNote: "Paid parking fills quickly by mid-morning.",
      qualityConfidence: 0.93,
      source: "CapeNature trail notes"
    }
  },
  {
    id: "royal-national-coast-track",
    name: "Royal National Coast Track",
    rating: 4.6,
    reviews: 980,
    difficulty: "moderate",
    hours: 5,
    distanceKm: 9.5,
    highlights: ["Clifftop boardwalks", "Ocean vistas", "Eucalypt forest"],
    summary: "A varied coastal route near Sydney with beaches, bluffs, and forest sections.",
    trailhead: {
      label: "Bundeena Ferry Wharf",
      coordinates: { lat: -34.0832, lng: 151.1494 },
      parkingNote: "Street parking nearby; ferry terminal is walk-in friendly.",
      qualityConfidence: 0.91,
      source: "NSW parks route data"
    }
  },
  {
    id: "montserrat-sant-jeroni",
    name: "Montserrat Sant Jeroni Trail",
    rating: 4.8,
    reviews: 1230,
    difficulty: "moderate",
    hours: 4.5,
    distanceKm: 10.2,
    highlights: ["Rock needle formations", "Monastery views", "Catalonia ridges"],
    summary: "A classic ascent in the Montserrat massif ending at broad ridge-top viewpoints.",
    trailhead: {
      label: "Montserrat Monastery trail access",
      coordinates: { lat: 41.5932, lng: 1.8376 },
      parkingNote: "Monastery parking + train access options.",
      qualityConfidence: 0.95,
      source: "Catalonia hiking federation"
    }
  },
  {
    id: "lycabettus-loop",
    name: "Lycabettus Hill Loop",
    rating: 4.4,
    reviews: 760,
    difficulty: "easy",
    hours: 1.8,
    distanceKm: 4.1,
    highlights: ["Urban summit", "Sunset viewpoint", "Quick access"],
    summary: "A short city-adjacent loop with quick elevation and broad skyline views.",
    trailhead: {
      label: "Lycabettus base path",
      coordinates: { lat: 37.9838, lng: 23.7432 },
      parkingNote: "Prefer transit access; limited street parking.",
      qualityConfidence: 0.9,
      source: "Athens municipality paths"
    }
  },
  {
    id: "sugarloaf-loop-rio",
    name: "Sugarloaf Foothills Loop",
    rating: 4.5,
    reviews: 690,
    difficulty: "easy",
    hours: 2.2,
    distanceKm: 5.2,
    highlights: ["Harbor lookouts", "Tropical foliage", "Short climbs"],
    summary: "A scenic foothill circuit near Rio's harbor viewpoints with moderate terrain.",
    trailhead: {
      label: "Praia Vermelha trail entrance",
      coordinates: { lat: -22.9486, lng: -43.1566 },
      parkingNote: "Beach lot and rideshare drop-off options.",
      qualityConfidence: 0.89,
      source: "Rio trilhas dataset"
    }
  }
];

export const globalRawHikeRecords: RawHikeRecord[] = globalHikes.map((hike) => ({
  id: hike.id,
  title: hike.name,
  rating: hike.rating,
  reviewCount: hike.reviews,
  difficulty: hike.difficulty,
  estimatedHours: hike.hours,
  distanceKm: hike.distanceKm,
  highlights: hike.highlights,
  description: hike.summary,
  trailhead: {
    name: hike.trailhead.label,
    lat: hike.trailhead.coordinates.lat,
    lng: hike.trailhead.coordinates.lng,
    parkingNote: hike.trailhead.parkingNote,
    qualityConfidence: hike.trailhead.qualityConfidence,
    source: hike.trailhead.source
  }
}));