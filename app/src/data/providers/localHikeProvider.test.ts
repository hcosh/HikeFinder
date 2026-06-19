import { describe, expect, it } from "vitest";
import { localHikeProvider } from "./localHikeProvider";

describe("localHikeProvider", () => {
  it("returns Stavanger-area hikes for Stavanger base location", async () => {
    const hikes = await localHikeProvider.listNearbyHikes("Stavanger");

    expect(hikes.map((hike) => hike.name)).toEqual(
      expect.arrayContaining(["Preikestolen Trail", "Kjeragbolten Trail", "Dalsnuten Loop"])
    );
    expect(hikes[0]?.trailhead.coordinates.lat).toBeGreaterThan(58);
  });

  it("returns Maui hikes for Maui base location", async () => {
    const hikes = await localHikeProvider.listNearbyHikes("Kapalua, Maui");

    expect(hikes.map((hike) => hike.name)).toEqual(
      expect.arrayContaining(["Waihee Ridge Trail", "Kapalua Coastal Trail", "Makawao Forest Loop"])
    );
  });

  it("returns Barcelona-relevant hikes for Barcelona base location", async () => {
    const hikes = await localHikeProvider.listNearbyHikes("Barcelona");

    expect(hikes.map((hike) => hike.name)).toEqual(
      expect.arrayContaining(["Montserrat Sant Jeroni Trail", "Collserola Carretera de les Aigues"])
    );
    expect(hikes.map((hike) => hike.name)).not.toEqual(expect.arrayContaining(["Waihee Ridge Trail"]));
  });
});
