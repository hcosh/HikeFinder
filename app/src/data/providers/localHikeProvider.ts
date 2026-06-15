import { hikes } from "../hikes";
import type { Hike, HikeProvider } from "../../types";
import { isStavangerLocation, stavangerHikes } from "../locationHikeCatalog";

class LocalHikeProvider implements HikeProvider {
  async listNearbyHikes(baseLocationLabel: string): Promise<Hike[]> {
    // Simulates an async provider to keep integration points ready for API-backed data.
    await new Promise((resolve) => setTimeout(resolve, 180));
    return isStavangerLocation(baseLocationLabel) ? stavangerHikes : hikes;
  }
}

export const localHikeProvider: HikeProvider = new LocalHikeProvider();