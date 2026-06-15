import { useEffect, useRef } from "react";
import L from "leaflet";
import type { Coordinates } from "../types";

interface Props {
  coords: Coordinates;
}

export default function TrailheadMap({ coords }: Props) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletMap = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) {
      return;
    }

    if (!leafletMap.current) {
      leafletMap.current = L.map(mapRef.current, { zoomControl: false }).setView(
        [coords.lat, coords.lng],
        13
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors"
      }).addTo(leafletMap.current);
    } else {
      leafletMap.current.setView([coords.lat, coords.lng], 13);
    }

    const marker = L.marker([coords.lat, coords.lng]).addTo(leafletMap.current);
    return () => {
      marker.remove();
    };
  }, [coords.lat, coords.lng]);

  return <div ref={mapRef} className="map" aria-label="Trailhead map preview" />;
}