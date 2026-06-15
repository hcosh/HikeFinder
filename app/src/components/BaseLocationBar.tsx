import type { BaseLocation } from "../types";
import { useEffect, useState } from "react";

interface Props {
  baseLocation: BaseLocation;
  recentLocations: string[];
  onApplyManualBaseLocation: (label: string) => void;
  onApplyRecentBaseLocation: (label: string) => void;
  onUseCurrentLocation: () => void;
  locating: boolean;
}

export default function BaseLocationBar({
  baseLocation,
  recentLocations,
  onApplyManualBaseLocation,
  onApplyRecentBaseLocation,
  onUseCurrentLocation,
  locating
}: Props) {
  const [draftLabel, setDraftLabel] = useState(baseLocation.label);

  useEffect(() => {
    setDraftLabel(baseLocation.label);
  }, [baseLocation.label]);

  const canApply = draftLabel.trim().length > 1 && draftLabel.trim() !== baseLocation.label;

  return (
    <section className="card base-location">
      <label>
        Base location
        <input
          value={draftLabel}
          onChange={(e) => setDraftLabel(e.target.value.trimStart())}
          placeholder="Hotel, town, or area"
          onKeyDown={(e) => {
            if (e.key === "Enter" && canApply) {
              onApplyManualBaseLocation(draftLabel.trim());
            }
          }}
        />
      </label>
      <button
        type="button"
        onClick={() => onApplyManualBaseLocation(draftLabel.trim())}
        disabled={!canApply}
      >
        OK
      </button>
      <button type="button" onClick={onUseCurrentLocation} disabled={locating}>
        {locating ? "Locating..." : "Use current location"}
      </button>
      {recentLocations.length > 0 && (
        <div className="recent-locations">
          <p className="status-note">Recent:</p>
          <div className="recent-list">
            {recentLocations.map((label) => (
              <button
                key={label}
                type="button"
                className="secondary recent-chip"
                onClick={() => onApplyRecentBaseLocation(label)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}