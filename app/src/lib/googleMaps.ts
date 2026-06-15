import type { Coordinates } from "../types";

const ALLOWED_HOSTS = new Set(["www.google.com", "google.com", "maps.google.com"]);

function isValidCoordinates(coords: Coordinates): boolean {
  return (
    Number.isFinite(coords.lat) &&
    Number.isFinite(coords.lng) &&
    coords.lat >= -90 &&
    coords.lat <= 90 &&
    coords.lng >= -180 &&
    coords.lng <= 180
  );
}

export function buildGoogleMapsDirectionsUrl(destination: Coordinates): string | null {
  if (!isValidCoordinates(destination)) {
    return null;
  }

  const dest = `${destination.lat},${destination.lng}`;
  const params = new URLSearchParams({
    api: "1",
    destination: dest,
    travelmode: "driving"
  });

  const url = new URL(`https://www.google.com/maps/dir/?${params.toString()}`);
  if (!ALLOWED_HOSTS.has(url.hostname)) {
    return null;
  }

  return url.toString();
}