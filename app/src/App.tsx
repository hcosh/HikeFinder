import { useEffect, useMemo, useState } from "react";
import BaseLocationBar from "./components/BaseLocationBar";
import FiltersBar from "./components/FiltersBar";
import HikeCard from "./components/HikeCard";
import HikeDetail from "./components/HikeDetail";
import { defaultHikeProvider } from "./data/providers";
import { useGeolocation } from "./hooks/useGeolocation";
import {
  clearTelemetryEvents,
  downloadTelemetryEvents,
  getTelemetryEvents,
  trackEvent
} from "./lib/telemetry";
import { filterAndSortHikes } from "./lib/filterHikes";
import {
  clearAppState,
  getActiveTab,
  getRecentBaseLocations,
  getSavedBaseLocation,
  pushRecentBaseLocation,
  setActiveTab,
  setSavedBaseLocation,
  type ActiveTab
} from "./lib/appStateStore";
import { clearShortlist, getShortlist, setShortlist } from "./lib/shortlistStore";
import type { BaseLocation, Hike, HikeFilters } from "./types";

const defaultFilters: HikeFilters = {
  maxHours: 8,
  maxDistanceKm: 30,
  difficulty: "all",
  minRating: 4
};

const broadenedFilters: HikeFilters = {
  maxHours: 12,
  maxDistanceKm: 30,
  difficulty: "all",
  minRating: 3.5
};

function App() {
  const [baseLocation, setBaseLocation] = useState<BaseLocation>(
    getSavedBaseLocation() ?? { label: "Current area" }
  );
  const [hikeResults, setHikeResults] = useState<Hike[]>([]);
  const [hikesLoading, setHikesLoading] = useState(false);
  const [hikesError, setHikesError] = useState("");
  const [filters, setFilters] = useState<HikeFilters>(defaultFilters);
  const [selectedHikeId, setSelectedHikeId] = useState<string>("");
  const [shortlist, setShortlistState] = useState<string[]>([]);
  const [activeTab, setActiveTabState] = useState<ActiveTab>(getActiveTab());
  const [recentBaseLocations, setRecentBaseLocations] = useState<string[]>(() =>
    getRecentBaseLocations()
  );
  const [statusMessage, setStatusMessage] = useState("");
  const [loadAttempt, setLoadAttempt] = useState(0);
  const { coords, error, loading, requestLocation } = useGeolocation();

  useEffect(() => {
    setShortlistState(getShortlist());
  }, []);

  useEffect(() => {
    setShortlist(shortlist);
  }, [shortlist]);

  useEffect(() => {
    setSavedBaseLocation(baseLocation);
  }, [baseLocation]);

  useEffect(() => {
    setActiveTab(activeTab);
  }, [activeTab]);

  useEffect(() => {
    if (coords) {
      setBaseLocation({
        label: `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`,
        coordinates: coords
      });
      setRecentBaseLocations(pushRecentBaseLocation(`${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`));
      trackEvent("base_location_set_current", {
        lat: Number(coords.lat.toFixed(4)),
        lng: Number(coords.lng.toFixed(4))
      });
    }
  }, [coords]);

  useEffect(() => {
    let cancelled = false;

    const loadHikes = async () => {
      setHikesLoading(true);
      setHikesError("");
      setStatusMessage(`Loading hikes for ${baseLocation.label}...`);
      try {
        const result = await defaultHikeProvider.listNearbyHikes(baseLocation.label);
        if (!cancelled) {
          setHikeResults(result);
          setSelectedHikeId((prev) => prev || result[0]?.id || "");
          trackEvent("hikes_loaded", { count: result.length, base: baseLocation.label });
          setStatusMessage(`Loaded hikes for ${baseLocation.label}.`);
        }
      } catch {
        if (!cancelled) {
          setHikesError("Unable to load hikes right now. Try again.");
          trackEvent("hikes_load_failed", { base: baseLocation.label });
          setStatusMessage(`Failed to load hikes for ${baseLocation.label}.`);
        }
      } finally {
        if (!cancelled) {
          setHikesLoading(false);
        }
      }
    };

    loadHikes();
    return () => {
      cancelled = true;
    };
  }, [baseLocation.label, loadAttempt]);

  const filteredHikes = useMemo(() => {
    return filterAndSortHikes(hikeResults, filters);
  }, [filters, hikeResults]);

  const selectedHike: Hike | null =
    filteredHikes.find((h) => h.id === selectedHikeId) ?? filteredHikes[0] ?? null;

  const searchAlreadyBroad =
    filters.difficulty === broadenedFilters.difficulty &&
    filters.minRating <= broadenedFilters.minRating &&
    filters.maxHours >= broadenedFilters.maxHours &&
    filters.maxDistanceKm >= broadenedFilters.maxDistanceKm;

  useEffect(() => {
    if (!selectedHike && filteredHikes[0]) {
      setSelectedHikeId(filteredHikes[0].id);
    }
  }, [selectedHike, filteredHikes]);

  const shortlistedHikes = useMemo(
    () => hikeResults.filter((hike) => shortlist.includes(hike.id)),
    [shortlist, hikeResults]
  );

  const toggleShortlist = (id: string) => {
    setShortlistState((prev) =>
      prev.includes(id) ? prev.filter((existingId) => existingId !== id) : [...prev, id]
    );
    trackEvent("shortlist_toggled", { hikeId: id });
  };

  const applyManualBaseLocation = (label: string) => {
    setBaseLocation({ label });
    setRecentBaseLocations(pushRecentBaseLocation(label));
    trackEvent("base_location_set_manual", { label });
  };

  const applyRecentBaseLocation = (label: string) => {
    setBaseLocation({ label });
    setRecentBaseLocations(pushRecentBaseLocation(label));
    trackEvent("base_location_set_recent", { label });
  };

  const exportTelemetry = () => {
    const eventCount = getTelemetryEvents().length;
    const success = downloadTelemetryEvents();
    trackEvent("telemetry_exported", { success, eventCount });
    setStatusMessage(success ? "Telemetry export downloaded." : "Unable to export telemetry.");
  };

  const retryHikeLoad = () => {
    setLoadAttempt((current) => current + 1);
    setStatusMessage(`Retrying hikes for ${baseLocation.label}...`);
    trackEvent("hikes_reload_requested", { base: baseLocation.label });
  };

  const broadenSearch = () => {
    setFilters((current) => ({
      difficulty: "all",
      minRating: Math.min(current.minRating, broadenedFilters.minRating),
      maxHours: Math.max(current.maxHours, broadenedFilters.maxHours),
      maxDistanceKm: Math.max(current.maxDistanceKm, broadenedFilters.maxDistanceKm)
    }));
    setStatusMessage("Broadened filters to surface more hike options.");
    trackEvent("filters_broadened", { base: baseLocation.label });
  };

  const clearAllLocalData = () => {
    const confirmed = window.confirm("Clear all local app data on this device?");
    if (!confirmed) {
      return;
    }

    clearAppState();
    clearShortlist();
    clearTelemetryEvents();

    setBaseLocation({ label: "Current area" });
    setShortlistState([]);
    setActiveTabState("browse");
    setFilters(defaultFilters);
    setSelectedHikeId("");
    setRecentBaseLocations([]);
    setStatusMessage("Local data cleared.");
  };

  return (
    <main className="app-shell">
      <header>
        <h1>Holiday Hiking Planner</h1>
        <p>Find a highly rated nearby hike and hand off directions to Google Maps.</p>
        <div className="header-actions">
          <button type="button" className="secondary" onClick={exportTelemetry}>
            Export telemetry JSON
          </button>
          <button type="button" className="secondary" onClick={clearAllLocalData}>
            Clear local data
          </button>
        </div>
        {statusMessage && <p className="status-note">{statusMessage}</p>}
      </header>

      <section className="tab-row" aria-label="Planner sections">
        <button
          type="button"
          className={activeTab === "browse" ? "tab-active" : "secondary"}
          onClick={() => setActiveTabState("browse")}
        >
          Browse
        </button>
        <button
          type="button"
          className={activeTab === "shortlist" ? "tab-active" : "secondary"}
          onClick={() => setActiveTabState("shortlist")}
        >
          Shortlist ({shortlist.length})
        </button>
      </section>

      <BaseLocationBar
        baseLocation={baseLocation}
        recentLocations={recentBaseLocations}
        onApplyManualBaseLocation={applyManualBaseLocation}
        onApplyRecentBaseLocation={applyRecentBaseLocation}
        onUseCurrentLocation={requestLocation}
        locating={loading}
      />

      {error && (
        <div className="error error-stack">
          <p>{error}</p>
          <button type="button" className="secondary" onClick={requestLocation}>
            Try current location again
          </button>
          {recentBaseLocations[0] && (
            <button
              type="button"
              className="secondary"
              onClick={() => applyRecentBaseLocation(recentBaseLocations[0])}
            >
              Use recent location: {recentBaseLocations[0]}
            </button>
          )}
        </div>
      )}
      {hikesError && (
        <div className="error error-stack">
          <p>{hikesError}</p>
          <button type="button" className="secondary" onClick={retryHikeLoad}>
            Retry loading hikes
          </button>
        </div>
      )}

      {activeTab === "browse" && (
        <FiltersBar
          filters={filters}
          onChange={setFilters}
          onReset={() => setFilters(defaultFilters)}
        />
      )}

      <section className="layout">
        <section className="list-pane">
          <h2>
            {activeTab === "browse" ? `Top nearby hikes for ${baseLocation.label}` : "Your shortlist"}
          </h2>
          {hikesLoading ? (
            <div className="card empty-state">
              <p>Loading hikes for {baseLocation.label}...</p>
            </div>
          ) : activeTab === "browse" ? (
            hikesError ? (
              <div className="card empty-state">
                <p>We could not load hikes right now.</p>
                <button type="button" className="secondary" onClick={retryHikeLoad}>
                  Retry loading hikes
                </button>
              </div>
            ) : hikeResults.length === 0 ? (
              <div className="card empty-state">
                <p>No hikes are currently available for {baseLocation.label}.</p>
                <p>Try another nearby town or use current location to search again.</p>
                <div className="empty-state-actions">
                  <button type="button" className="secondary" onClick={requestLocation}>
                    Use current location
                  </button>
                  <button type="button" className="secondary" onClick={retryHikeLoad}>
                    Retry loading hikes
                  </button>
                </div>
              </div>
            ) : filteredHikes.length === 0 ? (
              <div className="card empty-state">
                <p>No hikes match these filters.</p>
                <p>Try relaxing one of these constraints:</p>
                <ul className="empty-state-list">
                  <li>Lower minimum rating by 0.5</li>
                  <li>Increase max hours to include full-day trails</li>
                  <li>Switch difficulty to All</li>
                </ul>
                <div className="empty-state-actions">
                  <button
                    type="button"
                    className="secondary"
                    onClick={broadenSearch}
                    disabled={searchAlreadyBroad}
                  >
                    Broaden search
                  </button>
                  <button type="button" className="secondary" onClick={() => setFilters(defaultFilters)}>
                    Reset filters
                  </button>
                </div>
              </div>
            ) : (
              filteredHikes.map((hike) => (
                <HikeCard
                  key={hike.id}
                  hike={hike}
                  selected={selectedHike?.id === hike.id}
                  shortlisted={shortlist.includes(hike.id)}
                  onSelect={() => setSelectedHikeId(hike.id)}
                  onToggleShortlist={() => toggleShortlist(hike.id)}
                />
              ))
            )
          ) : shortlistedHikes.length === 0 ? (
            <div className="card empty-state">
              <p>Your shortlist is empty.</p>
              <button type="button" className="secondary" onClick={() => setActiveTabState("browse")}>
                Browse hikes
              </button>
            </div>
          ) : (
            shortlistedHikes.map((hike) => (
              <HikeCard
                key={hike.id}
                hike={hike}
                selected={selectedHike?.id === hike.id}
                shortlisted={shortlist.includes(hike.id)}
                onSelect={() => setSelectedHikeId(hike.id)}
                onToggleShortlist={() => toggleShortlist(hike.id)}
              />
            ))
          )}
        </section>

        <HikeDetail
          hike={selectedHike}
          shortlisted={selectedHike ? shortlist.includes(selectedHike.id) : false}
          onToggleShortlist={() => {
            if (selectedHike) {
              toggleShortlist(selectedHike.id);
            }
          }}
        />
      </section>
    </main>
  );
}

export default App
