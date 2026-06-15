import { useState } from "react";
import type { Hike } from "../types";
import { buildGoogleMapsDirectionsUrl } from "../lib/googleMaps";
import { trackEvent } from "../lib/telemetry";
import TrailheadMap from "./TrailheadMap";

interface Props {
  hike: Hike | null;
  shortlisted: boolean;
  onToggleShortlist: () => void;
}

export default function HikeDetail({ hike, shortlisted, onToggleShortlist }: Props) {
  const [copyStatus, setCopyStatus] = useState("");

  if (!hike) {
    return (
      <section className="card detail empty-state">
        <h2>Select a hike</h2>
        <p>Pick a nearby option to see details, trailhead preview, and Google Maps handoff.</p>
      </section>
    );
  }

  const mapsUrl = buildGoogleMapsDirectionsUrl(hike.trailhead.coordinates);

  const copyCoordinates = async () => {
    const text = `${hike.trailhead.coordinates.lat}, ${hike.trailhead.coordinates.lng}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus("Coordinates copied.");
      trackEvent("trailhead_coords_copied", { hikeId: hike.id });
    } catch {
      setCopyStatus("Unable to copy coordinates.");
    }
  };

  return (
    <section className="card detail">
      <h2>{hike.name}</h2>
      <p>{hike.summary}</p>
      <p>
        Rating {hike.rating.toFixed(1)} ({hike.reviews}) · {hike.difficulty} · {hike.hours}h · {hike.distanceKm}km
      </p>
      <p>Highlights: {hike.highlights.join(" · ")}</p>
      <p>Trailhead: {hike.trailhead.label}</p>
      {hike.trailhead.parkingNote && <p>Parking: {hike.trailhead.parkingNote}</p>}
      {hike.trailhead.transitOptions && hike.trailhead.transitOptions.length > 0 && (
        <div className="transit-block">
          <p>Public transport:</p>
          <ul className="transit-list">
            {hike.trailhead.transitOptions.map((option) => (
              <li key={`${option.routeLabel}-${option.boardAt}-${option.alightAt}`}>
                <p>
                  <strong>{option.routeLabel}</strong> ({option.mode})
                </p>
                <p>
                  {option.boardAt} to {option.alightAt}
                </p>
                <p>
                  ~{option.durationMinutes} min total · {option.frequency} · {option.walkMinutes} min walk
                </p>
                {option.notes && <p>{option.notes}</p>}
              </li>
            ))}
          </ul>
        </div>
      )}
      <p>
        Trailhead confidence: {(hike.trailhead.qualityConfidence * 100).toFixed(0)}% · Source: {hike.trailhead.source}
      </p>

      <TrailheadMap coords={hike.trailhead.coordinates} />

      <div className="actions">
        <button type="button" className="secondary" onClick={onToggleShortlist}>
          {shortlisted ? "Remove shortlist" : "Add shortlist"}
        </button>
        {mapsUrl ? (
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="primary-link"
            onClick={() => trackEvent("maps_handoff_opened", { hikeId: hike.id })}
          >
            Open in Google Maps
          </a>
        ) : (
          <button type="button" className="secondary" onClick={copyCoordinates}>
            Copy trailhead coordinates
          </button>
        )}
      </div>
      {copyStatus && <p className="status-note">{copyStatus}</p>}
    </section>
  );
}