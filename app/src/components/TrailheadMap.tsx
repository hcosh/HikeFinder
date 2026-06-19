import { useEffect, useRef } from "react";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import type { Coordinates } from "../types";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow
});

interface Props {
  coords: Coordinates;
  routeGeometry?: Coordinates[];
}

export default function TrailheadMap({ coords, routeGeometry }: Props) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletMap = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

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

      layerGroupRef.current = L.layerGroup().addTo(leafletMap.current);
    }

    if (!leafletMap.current || !layerGroupRef.current) {
      return;
    };

    const layerGroup = layerGroupRef.current;
    layerGroup.clearLayers();

    const hasRoute = Boolean(routeGeometry && routeGeometry.length > 1);
    if (hasRoute && routeGeometry) {
      const polyline = L.polyline(
        routeGeometry.map((point) => [point.lat, point.lng] as [number, number]),
        {
          color: "#0e7a5f",
          weight: 4,
          opacity: 0.9
        }
      ).addTo(layerGroup);

      L.circleMarker([coords.lat, coords.lng], {
        radius: 6,
        color: "#0e7a5f",
        fillColor: "#daf4ea",
        fillOpacity: 1,
        weight: 2
      }).addTo(layerGroup);

      leafletMap.current.fitBounds(polyline.getBounds(), {
        padding: [18, 18],
        maxZoom: 14
      });
      return;
    }

    L.marker([coords.lat, coords.lng]).addTo(layerGroup);
    leafletMap.current.setView([coords.lat, coords.lng], 13);
  }, [coords.lat, coords.lng, routeGeometry]);

  return <div ref={mapRef} className="map" aria-label="Trailhead map preview" />;
}