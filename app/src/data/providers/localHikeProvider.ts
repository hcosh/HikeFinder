import { hikes } from "../hikes";
import type { Hike, HikeProvider } from "../../types";

function cloneForBaseLocation(hike: Hike, baseLocationLabel: string): Hike {
  const suffix = baseLocationLabel.trim();
  if (!suffix) {
    return hike;
  }

  return {
    ...hike,
    summary: `${hike.summary} Suggested for ${suffix}.`,
    trailhead: {
      ...hike.trailhead,
      label: `${hike.trailhead.label} near ${suffix}`,
      source: `${hike.trailhead.source} · matched for ${suffix}`
    }
  };
}

class LocalHikeProvider implements HikeProvider {
  async listNearbyHikes(baseLocationLabel: string): Promise<Hike[]> {
    // Simulates an async provider to keep integration points ready for API-backed data.
    await new Promise((resolve) => setTimeout(resolve, 180));
    return hikes.map((hike) => cloneForBaseLocation(hike, baseLocationLabel));
  }
}

export const localHikeProvider: HikeProvider = new LocalHikeProvider();