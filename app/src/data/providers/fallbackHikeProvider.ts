import type { Hike, HikeProvider } from "../../types";
import { trackEvent } from "../../lib/telemetry";

export class FallbackHikeProvider implements HikeProvider {
  constructor(
    private readonly primary: HikeProvider,
    private readonly fallback: HikeProvider
  ) {}

  async listNearbyHikes(baseLocationLabel: string): Promise<Hike[]> {
    try {
      return await this.primary.listNearbyHikes(baseLocationLabel);
    } catch {
      trackEvent("provider_fallback_used", { base: baseLocationLabel });
      return this.fallback.listNearbyHikes(baseLocationLabel);
    }
  }
}
