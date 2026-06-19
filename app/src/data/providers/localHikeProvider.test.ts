import { describe, expect, it } from "vitest";
import { localHikeProvider } from "./localHikeProvider";

function toRadians(value: number): number {
  return (value * Math.PI) / 180;
}

function distanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const earthRadiusKm = 6371;
  const deltaLat = toRadians(lat2 - lat1);
  const deltaLng = toRadians(lng2 - lng1);
  const latA = toRadians(lat1);
  const latB = toRadians(lat2);

  const haversine =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(latA) * Math.cos(latB) * Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);

  return 2 * earthRadiusKm * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
}

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

  it("returns Barcelona trails that are all within 30km of Barcelona center", async () => {
    const hikes = await localHikeProvider.listNearbyHikes("Barcelona");

    const overLimit = hikes.filter((hike) => {
      const distance = distanceKm(41.3851, 2.1734, hike.trailhead.coordinates.lat, hike.trailhead.coordinates.lng);
      return distance > 30;
    });

    expect(overLimit).toHaveLength(0);
  });

  it("returns Bergen-relevant hikes for Bergen base location", async () => {
    const hikes = await localHikeProvider.listNearbyHikes("Bergen");

    expect(hikes.map((hike) => hike.name)).toEqual(
      expect.arrayContaining(["Ulriken Summit Loop", "Floyen to Vidden Ridge Approach"])
    );
    expect(hikes.map((hike) => hike.name)).not.toEqual(expect.arrayContaining(["Waihee Ridge Trail"]));
  });

  it("returns no hikes for unsupported manual locations instead of unrelated catalog trails", async () => {
    const hikes = await localHikeProvider.listNearbyHikes("Reykjavik");

    expect(hikes).toHaveLength(0);
  });
});
