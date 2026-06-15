import { z } from "zod";
import type { Hike } from "../types";

const RawHikeSchema = z.object({
  id: z.string(),
  title: z.string(),
  rating: z.number().min(0).max(5),
  reviewCount: z.number().int().nonnegative(),
  difficulty: z.enum(["easy", "moderate", "hard"]),
  estimatedHours: z.number().positive(),
  distanceKm: z.number().positive(),
  highlights: z.array(z.string()).min(1),
  description: z.string(),
  trailhead: z.object({
    name: z.string(),
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
    parkingNote: z.string().optional(),
    qualityConfidence: z.number().min(0).max(1),
    source: z.string()
  })
});

export type RawHikeRecord = z.infer<typeof RawHikeSchema>;

export function normalizeRawHike(raw: unknown): Hike {
  const parsed = RawHikeSchema.parse(raw);

  return {
    id: parsed.id,
    name: parsed.title,
    rating: parsed.rating,
    reviews: parsed.reviewCount,
    difficulty: parsed.difficulty,
    hours: parsed.estimatedHours,
    distanceKm: parsed.distanceKm,
    highlights: parsed.highlights,
    summary: parsed.description,
    trailhead: {
      label: parsed.trailhead.name,
      coordinates: {
        lat: parsed.trailhead.lat,
        lng: parsed.trailhead.lng
      },
      parkingNote: parsed.trailhead.parkingNote,
      qualityConfidence: parsed.trailhead.qualityConfidence,
      source: parsed.trailhead.source
    }
  };
}
