import { hikes } from "../hikes";
import type { Hike, HikeProvider } from "../../types";
import {
  getGlobalCatalogHikesForLocation,
  resolveLocationCatalog,
  stavangerHikes
} from "../locationHikeCatalog";

class LocalHikeProvider implements HikeProvider {
  async listNearbyHikes(baseLocationLabel: string): Promise<Hike[]> {
    // Simulates an async provider to keep integration points ready for API-backed data.
    await new Promise((resolve) => setTimeout(resolve, 180));
    const catalog = resolveLocationCatalog(baseLocationLabel);
    if (catalog === "maui") {
      return hikes;
    }
    if (catalog === "stavanger") {
      return stavangerHikes;
    }
    return getGlobalCatalogHikesForLocation(baseLocationLabel);
  }
}

export const localHikeProvider: HikeProvider = new LocalHikeProvider();