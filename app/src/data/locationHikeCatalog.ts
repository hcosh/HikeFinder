import type { Hike } from "../types";
import type { RawHikeRecord } from "./normalizeHike";
import type { Coordinates } from "../types";
import { hikes as mauiHikes } from "./hikes";

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

const athensKeywordMatches = ["athens", "greece", "athina"];
const barcelonaKeywordMatches = ["barcelona", "spain", "catalonia", "madrid"];
const bergenKeywordMatches = ["bergen", "norway", "vestland"];
const sydneyKeywordMatches = ["sydney", "australia", "new south wales", "nsw"];
const tokyoKeywordMatches = ["tokyo", "japan", "kyoto", "osaka"];

const mauiBaseCoordinates: Coordinates = { lat: 20.8893, lng: -156.4729 };
const stavangerBaseCoordinates: Coordinates = { lat: 58.969, lng: 5.7331 };
const athensBaseCoordinates: Coordinates = { lat: 37.9838, lng: 23.7275 };
const barcelonaBaseCoordinates: Coordinates = { lat: 41.3851, lng: 2.1734 };
const bergenBaseCoordinates: Coordinates = { lat: 60.3913, lng: 5.3221 };
const sydneyBaseCoordinates: Coordinates = { lat: -33.8688, lng: 151.2093 };
const tokyoBaseCoordinates: Coordinates = { lat: 35.6762, lng: 139.6503 };

function parseCoordinateLabel(baseLocationLabel: string): Coordinates | null {
  const match = baseLocationLabel
    .trim()
    .match(/^(-?\d{1,3}(?:\.\d+)?)\s*,\s*(-?\d{1,3}(?:\.\d+)?)$/);
  if (!match) {
    return null;
  }

  const lat = Number(match[1]);
  const lng = Number(match[2]);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return null;
  }
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return null;
  }

  return { lat, lng };
}

export function isKnownCatalogLocation(baseLocationLabel: string): boolean {
  const normalized = baseLocationLabel.toLowerCase();
  return (
    isMauiLocation(baseLocationLabel) ||
    isStavangerLocation(baseLocationLabel) ||
    athensKeywordMatches.some((keyword) => normalized.includes(keyword)) ||
    barcelonaKeywordMatches.some((keyword) => normalized.includes(keyword)) ||
    bergenKeywordMatches.some((keyword) => normalized.includes(keyword)) ||
    sydneyKeywordMatches.some((keyword) => normalized.includes(keyword)) ||
    tokyoKeywordMatches.some((keyword) => normalized.includes(keyword)) ||
    Boolean(parseCoordinateLabel(baseLocationLabel))
  );
}

export function isStavangerLocation(baseLocationLabel: string): boolean {
  const normalized = baseLocationLabel.toLowerCase();
  return stavangerKeywordMatches.some((keyword) => normalized.includes(keyword));
}

export function isMauiLocation(baseLocationLabel: string): boolean {
  const normalized = baseLocationLabel.toLowerCase();
  return mauiKeywordMatches.some((keyword) => normalized.includes(keyword));
}

export function resolveLocationCatalog(baseLocationLabel: string): LocationCatalog {
  const normalized = baseLocationLabel.toLowerCase();
  if (isMauiLocation(baseLocationLabel)) {
    return "maui";
  }
  if (isStavangerLocation(baseLocationLabel)) {
    return "stavanger";
  }
  if (
    athensKeywordMatches.some((keyword) => normalized.includes(keyword)) ||
    barcelonaKeywordMatches.some((keyword) => normalized.includes(keyword)) ||
    bergenKeywordMatches.some((keyword) => normalized.includes(keyword)) ||
    sydneyKeywordMatches.some((keyword) => normalized.includes(keyword)) ||
    tokyoKeywordMatches.some((keyword) => normalized.includes(keyword))
  ) {
    return "global";
  }
  return "global";
}

export function getBaseCoordinatesForLocation(baseLocationLabel: string): Coordinates | null {
  const parsedCoordinates = parseCoordinateLabel(baseLocationLabel);
  if (parsedCoordinates) {
    return parsedCoordinates;
  }

  const normalized = baseLocationLabel.toLowerCase();
  if (isMauiLocation(baseLocationLabel)) {
    return mauiBaseCoordinates;
  }
  if (isStavangerLocation(baseLocationLabel)) {
    return stavangerBaseCoordinates;
  }
  if (athensKeywordMatches.some((keyword) => normalized.includes(keyword))) {
    return athensBaseCoordinates;
  }
  if (barcelonaKeywordMatches.some((keyword) => normalized.includes(keyword))) {
    return barcelonaBaseCoordinates;
  }
  if (bergenKeywordMatches.some((keyword) => normalized.includes(keyword))) {
    return bergenBaseCoordinates;
  }
  if (sydneyKeywordMatches.some((keyword) => normalized.includes(keyword))) {
    return sydneyBaseCoordinates;
  }
  if (tokyoKeywordMatches.some((keyword) => normalized.includes(keyword))) {
    return tokyoBaseCoordinates;
  }
  return null;
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
      coordinates: { lat: 41.4227, lng: 2.1186 },
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

export const athensHikes: Hike[] = [
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
    id: "hymettus-traverse",
    name: "Hymettus Ridge Traverse",
    rating: 4.5,
    reviews: 520,
    difficulty: "moderate",
    hours: 3.8,
    distanceKm: 9.4,
    highlights: ["Aegean outlooks", "Pine trails", "Long ridge sections"],
    summary: "A longer ridge walk above Athens with broad views toward the coast.",
    trailhead: {
      label: "Kaisariani Monastery trailhead",
      coordinates: { lat: 37.9638, lng: 23.8031 },
      parkingNote: "Small lot near monastery entrance.",
      qualityConfidence: 0.9,
      source: "Attica outdoor routes"
    }
  },
  {
    id: "filopappou-hills",
    name: "Filopappou Hills Loop",
    rating: 4.3,
    reviews: 690,
    difficulty: "easy",
    hours: 1.4,
    distanceKm: 3.1,
    highlights: ["Acropolis views", "Ancient paths", "Low-commitment route"],
    summary: "A short scenic loop through historic hills with iconic city panoramas.",
    trailhead: {
      label: "Filopappou southwest entrance",
      coordinates: { lat: 37.9678, lng: 23.7168 },
      parkingNote: "Best accessed on foot or metro.",
      qualityConfidence: 0.88,
      source: "Athens trail map"
    }
  },
  {
    id: "parnitha-bafi",
    name: "Parnitha Bafi Route",
    rating: 4.6,
    reviews: 430,
    difficulty: "moderate",
    hours: 4.6,
    distanceKm: 11.3,
    highlights: ["Mountain refuge", "Forest ascents", "Cooler summer climate"],
    summary: "A mountain-day option north of Athens with longer shaded sections.",
    trailhead: {
      label: "Parnitha cable car upper station",
      coordinates: { lat: 38.1575, lng: 23.7346 },
      parkingNote: "Use cable car access and start from the upper station.",
      qualityConfidence: 0.89,
      source: "Greek mountain federation"
    }
  }
];

export const barcelonaHikes: Hike[] = [
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
      coordinates: { lat: 41.4227, lng: 2.1186 },
      parkingNote: "Monastery parking + train access options.",
      qualityConfidence: 0.95,
      source: "Catalonia hiking federation"
    }
  },
  {
    id: "collserola-carretera-aigues",
    name: "Collserola Carretera de les Aigues",
    rating: 4.5,
    reviews: 880,
    difficulty: "easy",
    hours: 2.5,
    distanceKm: 8,
    highlights: ["City overlooks", "Wide gravel paths", "Flexible distance"],
    summary: "A panoramic ridge path above Barcelona with easy grades and skyline views.",
    trailhead: {
      label: "Plaça Mireia access point",
      coordinates: { lat: 41.4037, lng: 2.1147 },
      parkingNote: "Small parking zones around upper access roads.",
      qualityConfidence: 0.9,
      source: "Parc de Collserola"
    }
  },
  {
    id: "montjuic-gardens-loop",
    name: "Montjuic Gardens Loop",
    rating: 4.3,
    reviews: 640,
    difficulty: "easy",
    hours: 1.7,
    distanceKm: 4.4,
    highlights: ["Castle viewpoints", "Garden paths", "Urban-access trail"],
    summary: "A compact hill loop combining greenery, viewpoints, and city landmarks.",
    trailhead: {
      label: "Montjuic funicular upper station",
      coordinates: { lat: 41.3637, lng: 2.1659 },
      parkingNote: "Public transit recommended over driving.",
      qualityConfidence: 0.87,
      source: "Barcelona parks routes"
    }
  },
  {
    id: "la-mola-summit",
    name: "La Mola Summit Trail",
    rating: 4.7,
    reviews: 570,
    difficulty: "moderate",
    hours: 4,
    distanceKm: 9.1,
    highlights: ["Rocky summit", "Monastery ruins", "Regional park terrain"],
    summary: "A rewarding day hike northwest of Barcelona with a broad summit panorama.",
    trailhead: {
      label: "Can Robert trail parking",
      coordinates: { lat: 41.4859, lng: 2.1078 },
      parkingNote: "Arrive early on weekends for parking availability.",
      qualityConfidence: 0.9,
      source: "Sant Llorenc park authority"
    }
  }
];

export const bergenHikes: Hike[] = [
  {
    id: "floyen-vidden-approach",
    name: "Floyen to Vidden Ridge Approach",
    rating: 4.7,
    reviews: 860,
    difficulty: "moderate",
    hours: 4.8,
    distanceKm: 12.1,
    highlights: ["High ridge views", "City-to-mountain transition", "Classic Bergen route"],
    summary: "A signature Bergen mountain traverse segment with broad views over fjords and city hills.",
    trailhead: {
      label: "Floyen upper funicular station",
      coordinates: { lat: 60.3976, lng: 5.3434 },
      parkingNote: "Funicular access is easiest from city center.",
      qualityConfidence: 0.95,
      source: "Bergen hiking council"
    }
  },
  {
    id: "ulriken-summit-loop",
    name: "Ulriken Summit Loop",
    rating: 4.8,
    reviews: 1120,
    difficulty: "moderate",
    hours: 3.6,
    distanceKm: 8.4,
    highlights: ["Steep stone sections", "Cable car access", "Panoramic summit"],
    summary: "A high-value Bergen summit loop with short steep climbs and wide city and sea views.",
    trailhead: {
      label: "Ulriken cable car base",
      coordinates: { lat: 60.3775, lng: 5.3815 },
      parkingNote: "Dedicated parking near cable car station.",
      qualityConfidence: 0.96,
      source: "Bergen mountain trails"
    }
  },
  {
    id: "lyderhorn-coastal-view",
    name: "Lyderhorn Coastal View Trail",
    rating: 4.5,
    reviews: 470,
    difficulty: "easy",
    hours: 2.7,
    distanceKm: 6.2,
    highlights: ["Coastal viewpoints", "Gentle forest ascent", "Short half-day option"],
    summary: "A shorter Bergen west-side climb with rewarding coastal and island views.",
    trailhead: {
      label: "Gravdal trail access",
      coordinates: { lat: 60.3679, lng: 5.2627 },
      parkingNote: "Neighborhood parking near trail signage.",
      qualityConfidence: 0.9,
      source: "Vestland outdoor map"
    }
  },
  {
    id: "damsgardsfjellet-urban-loop",
    name: "Damsgardsfjellet Urban Loop",
    rating: 4.4,
    reviews: 390,
    difficulty: "easy",
    hours: 2.1,
    distanceKm: 5.3,
    highlights: ["City overlook", "Mixed gravel paths", "Quick post-work route"],
    summary: "An accessible urban-adjacent hill loop with quick elevation and city panoramas.",
    trailhead: {
      label: "Melkeplassen access point",
      coordinates: { lat: 60.3659, lng: 5.2931 },
      parkingNote: "Use tram or neighborhood parking where available.",
      qualityConfidence: 0.88,
      source: "Bergen municipality trail network"
    }
  }
];

export const sydneyHikes: Hike[] = [
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
    id: "spit-to-manly",
    name: "Spit to Manly Track",
    rating: 4.7,
    reviews: 1450,
    difficulty: "moderate",
    hours: 4.5,
    distanceKm: 10,
    highlights: ["Harbor coves", "Bushland sections", "Waterfront finish"],
    summary: "An iconic Sydney harbor-side point-to-point hike with varied terrain.",
    trailhead: {
      label: "Spit Bridge southern access",
      coordinates: { lat: -33.8028, lng: 151.248 },
      parkingNote: "Bus access is usually easier than parking.",
      qualityConfidence: 0.94,
      source: "NSW great walks"
    }
  },
  {
    id: "bondi-coogee",
    name: "Bondi to Coogee Coastal Walk",
    rating: 4.8,
    reviews: 2300,
    difficulty: "easy",
    hours: 2,
    distanceKm: 6,
    highlights: ["Beach cliffs", "Lookout points", "High-amenity route"],
    summary: "A classic and accessible Sydney coastal route with frequent viewpoints.",
    trailhead: {
      label: "Bondi Icebergs access stairs",
      coordinates: { lat: -33.8913, lng: 151.2767 },
      parkingNote: "Transit recommended due heavy beach traffic.",
      qualityConfidence: 0.95,
      source: "City of Sydney walks"
    }
  },
  {
    id: "garigal-cascades-loop",
    name: "Garigal Cascades Loop",
    rating: 4.6,
    reviews: 820,
    difficulty: "moderate",
    hours: 3,
    distanceKm: 7.1,
    highlights: ["Creek crossings", "Bushland steps", "North shore viewpoints"],
    summary: "A forested north-shore circuit with water features and short climbs.",
    trailhead: {
      label: "Roseville Bridge trail access",
      coordinates: { lat: -33.7435, lng: 151.1844 },
      parkingNote: "Trail parking near bridge approaches.",
      qualityConfidence: 0.92,
      source: "Northern Beaches bushwalks"
    }
  }
];

export const tokyoHikes: Hike[] = [
  {
    id: "mt-takao-1",
    name: "Mount Takao Trail 1",
    rating: 4.6,
    reviews: 2100,
    difficulty: "easy",
    hours: 2.5,
    distanceKm: 5.6,
    highlights: ["Temple route", "Forest ascent", "Fuji views on clear days"],
    summary: "Tokyo's most popular summit day hike with clear wayfinding and transit access.",
    trailhead: {
      label: "Takaosanguchi Station",
      coordinates: { lat: 35.6251, lng: 139.2437 },
      parkingNote: "Direct train access preferred; parking is limited.",
      qualityConfidence: 0.96,
      source: "Tokyo metro mountains guide"
    }
  },
  {
    id: "mt-mitake-rock-garden",
    name: "Mitake Rock Garden Loop",
    rating: 4.7,
    reviews: 980,
    difficulty: "moderate",
    hours: 4,
    distanceKm: 9,
    highlights: ["River gorge", "Shrine section", "Mossy forest paths"],
    summary: "A longer Okutama-area loop with diverse forest and creek scenery.",
    trailhead: {
      label: "Mitake cable car upper station",
      coordinates: { lat: 35.8066, lng: 139.1494 },
      parkingNote: "Rail + cable car combination is most convenient.",
      qualityConfidence: 0.93,
      source: "Tokyo prefecture trails"
    }
  },
  {
    id: "jinba-to-takao",
    name: "Mount Jinba to Takao Traverse",
    rating: 4.8,
    reviews: 740,
    difficulty: "hard",
    hours: 6,
    distanceKm: 14.2,
    highlights: ["Ridgeline traverse", "Tea house stops", "Long mountain day"],
    summary: "A classic ridge traverse west of Tokyo for hikers wanting a full-day effort.",
    trailhead: {
      label: "Jinba Kogen bus stop",
      coordinates: { lat: 35.6755, lng: 139.1672 },
      parkingNote: "Bus links from Takao area on regular schedule.",
      qualityConfidence: 0.9,
      source: "Okutama mountain registry"
    }
  },
  {
    id: "nokogiriyama-chiba",
    name: "Nokogiriyama Summit Loop",
    rating: 4.5,
    reviews: 650,
    difficulty: "moderate",
    hours: 3.5,
    distanceKm: 7.1,
    highlights: ["Cliff viewpoints", "Temple carvings", "Tokyo Bay outlook"],
    summary: "A Chiba-side mountain loop reachable from Tokyo with dramatic viewpoints.",
    trailhead: {
      label: "Hama-Kanaya station approach",
      coordinates: { lat: 35.1571, lng: 139.8232 },
      parkingNote: "Ferry and rail both available for access.",
      qualityConfidence: 0.89,
      source: "Kanto trails portal"
    }
  }
];

function hikesToRawRecords(records: Hike[]): RawHikeRecord[] {
  return records.map((hike) => ({
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
      transitOptions: hike.trailhead.transitOptions,
      qualityConfidence: hike.trailhead.qualityConfidence,
      source: hike.trailhead.source
    }
  }));
}

export const globalRawHikeRecords: RawHikeRecord[] = hikesToRawRecords(globalHikes);
export const athensRawHikeRecords: RawHikeRecord[] = hikesToRawRecords(athensHikes);
export const barcelonaRawHikeRecords: RawHikeRecord[] = hikesToRawRecords(barcelonaHikes);
export const bergenRawHikeRecords: RawHikeRecord[] = hikesToRawRecords(bergenHikes);
export const sydneyRawHikeRecords: RawHikeRecord[] = hikesToRawRecords(sydneyHikes);
export const tokyoRawHikeRecords: RawHikeRecord[] = hikesToRawRecords(tokyoHikes);

const allCatalogHikes: Hike[] = [
  ...mauiHikes,
  ...stavangerHikes,
  ...athensHikes,
  ...barcelonaHikes,
  ...bergenHikes,
  ...sydneyHikes,
  ...tokyoHikes,
  ...globalHikes
];
const allCatalogRawHikeRecords: RawHikeRecord[] = hikesToRawRecords(allCatalogHikes);

export function getGlobalCatalogHikesForLocation(baseLocationLabel: string): Hike[] {
  const normalized = baseLocationLabel.toLowerCase();
  if (athensKeywordMatches.some((keyword) => normalized.includes(keyword))) {
    return athensHikes;
  }
  if (barcelonaKeywordMatches.some((keyword) => normalized.includes(keyword))) {
    return barcelonaHikes;
  }
  if (bergenKeywordMatches.some((keyword) => normalized.includes(keyword))) {
    return bergenHikes;
  }
  if (sydneyKeywordMatches.some((keyword) => normalized.includes(keyword))) {
    return sydneyHikes;
  }
  if (tokyoKeywordMatches.some((keyword) => normalized.includes(keyword))) {
    return tokyoHikes;
  }
  if (parseCoordinateLabel(baseLocationLabel)) {
    return allCatalogHikes;
  }
  return [];
}

export function getGlobalCatalogRawRecordsForLocation(baseLocationLabel: string): RawHikeRecord[] {
  const normalized = baseLocationLabel.toLowerCase();
  if (athensKeywordMatches.some((keyword) => normalized.includes(keyword))) {
    return athensRawHikeRecords;
  }
  if (barcelonaKeywordMatches.some((keyword) => normalized.includes(keyword))) {
    return barcelonaRawHikeRecords;
  }
  if (bergenKeywordMatches.some((keyword) => normalized.includes(keyword))) {
    return bergenRawHikeRecords;
  }
  if (sydneyKeywordMatches.some((keyword) => normalized.includes(keyword))) {
    return sydneyRawHikeRecords;
  }
  if (tokyoKeywordMatches.some((keyword) => normalized.includes(keyword))) {
    return tokyoRawHikeRecords;
  }
  if (parseCoordinateLabel(baseLocationLabel)) {
    return allCatalogRawHikeRecords;
  }
  return [];
}