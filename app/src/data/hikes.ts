import type { Hike } from "../types";
import { z } from "zod";

const HikeSchema = z.object({
  id: z.string(),
  name: z.string(),
  rating: z.number().min(0).max(5),
  reviews: z.number().int().nonnegative(),
  difficulty: z.enum(["easy", "moderate", "hard"]),
  hours: z.number().positive(),
  distanceKm: z.number().positive(),
  highlights: z.array(z.string()).min(1),
  summary: z.string(),
  trailhead: z.object({
    label: z.string(),
    coordinates: z.object({ lat: z.number(), lng: z.number() }),
    parkingNote: z.string().optional(),
      transitOptions: z
        .array(
          z.object({
            mode: z.enum(["bus", "ferry", "train", "shuttle", "mixed"]),
            routeLabel: z.string(),
            boardAt: z.string(),
            alightAt: z.string(),
            walkMinutes: z.number().int().nonnegative(),
            durationMinutes: z.number().int().positive(),
            frequency: z.string(),
            notes: z.string().optional()
          })
        )
        .optional(),
    qualityConfidence: z.number().min(0).max(1),
    source: z.string()
  })
});

const rawHikes: Hike[] = [
  {
    id: "waihee-ridge",
    name: "Waihee Ridge Trail",
    rating: 4.8,
    reviews: 1240,
    difficulty: "moderate",
    hours: 3.5,
    distanceKm: 7.2,
    highlights: ["Ridge views", "Cloud forest", "Great sunrise"],
    summary:
      "A lush ridge climb with dramatic valley and ocean views. Best in the morning for clear conditions.",
    trailhead: {
      label: "Waihee Ridge Trailhead",
      coordinates: { lat: 20.9423, lng: -156.5416 },
      parkingNote: "Small lot. Arrive early.",
      transitOptions: [
        {
          mode: "mixed",
          routeLabel: "Maui Bus 39 + taxi",
          boardAt: "Queen Kaahumanu Center",
          alightAt: "Wailuku Transfer Point",
          walkMinutes: 4,
          durationMinutes: 55,
          frequency: "Every 60 minutes",
          notes: "From Wailuku, use a short taxi or rideshare for the last mountain section."
        }
      ],
      qualityConfidence: 0.95,
      source: "Maui County trail directory"
    }
  },
  {
    id: "lahaina-pali",
    name: "Lahaina Pali Trail",
    rating: 4.6,
    reviews: 890,
    difficulty: "hard",
    hours: 4.5,
    distanceKm: 8.7,
    highlights: ["Historic route", "Sweeping coast", "Windy ridgelines"],
    summary:
      "A rugged, exposed trail with steep sections and broad coastal views. Bring sun protection.",
    trailhead: {
      label: "Lahaina Pali Trail (Maalaea side)",
      coordinates: { lat: 20.7905, lng: -156.4978 },
      parkingNote: "Limited shoulder parking.",
      transitOptions: [
        {
          mode: "mixed",
          routeLabel: "Maui Bus 15 + rideshare",
          boardAt: "Wharf Cinema Center (Lahaina)",
          alightAt: "Maalaea Harbor stop",
          walkMinutes: 8,
          durationMinutes: 45,
          frequency: "Every 60 minutes",
          notes: "Use a rideshare for the final segment along Honoapiilani Hwy shoulder."
        }
      ],
      qualityConfidence: 0.88,
      source: "Hiking community dataset"
    }
  },
  {
    id: "kapalua-coastal",
    name: "Kapalua Coastal Trail",
    rating: 4.7,
    reviews: 1520,
    difficulty: "easy",
    hours: 1.5,
    distanceKm: 4.0,
    highlights: ["Ocean cliffs", "Easy terrain", "Family friendly"],
    summary:
      "A scenic coastal walk with minimal elevation gain and excellent ocean views.",
    trailhead: {
      label: "Kapalua Coastal Trail Start",
      coordinates: { lat: 20.9959, lng: -156.6662 },
      parkingNote: "Resort-area parking nearby.",
      transitOptions: [
        {
          mode: "bus",
          routeLabel: "Maui Bus 29",
          boardAt: "Whalers Village stop",
          alightAt: "Kapalua West Maui Airport stop",
          walkMinutes: 12,
          durationMinutes: 35,
          frequency: "Every 60 minutes",
          notes: "Mostly flat coastal walk from the stop to trail access."
        }
      ],
      qualityConfidence: 0.93,
      source: "Destination trail map"
    }
  },
  {
    id: "makawao-forest-loop",
    name: "Makawao Forest Loop",
    rating: 4.5,
    reviews: 540,
    difficulty: "easy",
    hours: 2,
    distanceKm: 5.3,
    highlights: ["Cool forest", "Shaded path", "Great for warm days"],
    summary:
      "A mellow forest route with shade and softer terrain, ideal for a low-stress morning.",
    trailhead: {
      label: "Makawao Forest Reserve Entrance",
      coordinates: { lat: 20.8543, lng: -156.3043 },
      parkingNote: "Parking lot at reserve entrance.",
      transitOptions: [
        {
          mode: "mixed",
          routeLabel: "Maui Bus 35 + taxi",
          boardAt: "Kahului Transit Center",
          alightAt: "Makawao Library stop",
          walkMinutes: 6,
          durationMinutes: 50,
          frequency: "Every 90 minutes",
          notes: "Last section to the reserve gate is best completed by taxi/rideshare."
        }
      ],
      qualityConfidence: 0.91,
      source: "State reserve metadata"
    }
  }
];

export const hikes = rawHikes.map((hike) => HikeSchema.parse(hike));