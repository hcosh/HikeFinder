import type { Hike } from "../types";

interface Props {
  hike: Hike;
  selected: boolean;
  shortlisted: boolean;
  onSelect: () => void;
  onToggleShortlist: () => void;
}

export default function HikeCard({
  hike,
  selected,
  shortlisted,
  onSelect,
  onToggleShortlist
}: Props) {
  return (
    <article className={`card hike-card ${selected ? "selected" : ""}`}>
      <button type="button" className="hike-main" onClick={onSelect}>
        <h3>{hike.name}</h3>
        <p>
          {hike.rating.toFixed(1)} ({hike.reviews}) · {hike.difficulty} · {hike.hours}h · {hike.distanceKm}
          km
        </p>
        <p>{hike.highlights.slice(0, 2).join(" · ")}</p>
      </button>
      <button type="button" className="secondary" onClick={onToggleShortlist}>
        {shortlisted ? "Remove shortlist" : "Shortlist"}
      </button>
    </article>
  );
}