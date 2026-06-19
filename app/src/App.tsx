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
  clearReleaseQaSignoff,
  clearReleaseQaRuns,
  clearAppState,
  getActiveTab,
  getRecentBaseLocations,
  getReleaseQaChecks,
  getReleaseQaRuns,
  getReleaseQaSignoff,
  getSavedBaseLocation,
  pushRecentBaseLocation,
  setReleaseQaChecks,
  setReleaseQaRuns,
  setReleaseQaSignoff,
  setActiveTab,
  setSavedBaseLocation,
  type ActiveTab,
  type ReleaseQaRun
} from "./lib/appStateStore";
import { clearShortlist, getShortlist, setShortlist } from "./lib/shortlistStore";
import { formatTelemetrySummary, getTelemetrySummary } from "./lib/telemetryReport";
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

const releaseQaChecklist = [
  { id: "iphone_core_flow", label: "iPhone core flow passes end-to-end" },
  { id: "maps_handoff_paths", label: "Google Maps handoff works installed and browser fallback" },
  { id: "manual_location_denied", label: "Manual base location works after denied location" },
  { id: "ipad_rotation_split", label: "iPad rotation and split-view keep state intact" },
  { id: "error_recovery_paths", label: "All empty/error states have recovery actions" }
] as const;

const qaDevices = ["iPhone Safari", "iPad Safari", "iPad Split View", "Desktop Safari"] as const;
const qaScenarios = [
  "Core flow",
  "Location denied",
  "Weak network",
  "Portrait and landscape",
  "Split view",
  "Maps handoff"
] as const;

function App() {
  const [baseLocation, setBaseLocation] = useState<BaseLocation>(
    getSavedBaseLocation() ?? { label: "Current area" }
  );
  const [hikeResults, setHikeResults] = useState<Hike[]>([]);
  const [hikesLoading, setHikesLoading] = useState(false);
  const [hikesError, setHikesError] = useState("");
  const [filters, setFilters] = useState<HikeFilters>(defaultFilters);
  const [visibleTrailCount, setVisibleTrailCount] = useState<3 | 5 | 99>(3);
  const [selectedHikeId, setSelectedHikeId] = useState<string>("");
  const [shortlist, setShortlistState] = useState<string[]>([]);
  const [activeTab, setActiveTabState] = useState<ActiveTab>(getActiveTab());
  const [recentBaseLocations, setRecentBaseLocations] = useState<string[]>(() =>
    getRecentBaseLocations()
  );
  const [releaseQaChecks, setReleaseQaChecksState] = useState<Record<string, boolean>>(() =>
    getReleaseQaChecks()
  );
  const [releaseQaSignoff, setReleaseQaSignoffState] = useState<string | null>(() =>
    getReleaseQaSignoff()
  );
  const [releaseQaRuns, setReleaseQaRunsState] = useState<ReleaseQaRun[]>(() => getReleaseQaRuns());
  const [qaRunDevice, setQaRunDevice] = useState<string>(qaDevices[0]);
  const [qaRunScenario, setQaRunScenario] = useState<string>(qaScenarios[0]);
  const [qaRunOutcome, setQaRunOutcome] = useState<"pass" | "fail" | "blocked">("pass");
  const [qaRunNotes, setQaRunNotes] = useState("");
  const [editingQaRunId, setEditingQaRunId] = useState<string | null>(null);
  const [qaRunFilter, setQaRunFilter] = useState<"all" | "pass" | "fail" | "blocked">("all");
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
    setReleaseQaChecks(releaseQaChecks);
  }, [releaseQaChecks]);

  useEffect(() => {
    setReleaseQaRuns(releaseQaRuns);
  }, [releaseQaRuns]);

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
  const displayedTrailCount = Math.min(
    visibleTrailCount === 99 ? filteredHikes.length : visibleTrailCount,
    filteredHikes.length
  );

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
  const telemetrySummary = getTelemetrySummary();
  const qaCompletedCount = releaseQaChecklist.filter((check) => releaseQaChecks[check.id]).length;
  const qaAllComplete = qaCompletedCount === releaseQaChecklist.length;
  const qaPasses = releaseQaRuns.filter((run) => run.outcome === "pass").length;
  const qaFailures = releaseQaRuns.filter((run) => run.outcome === "fail").length;
  const qaBlocked = releaseQaRuns.filter((run) => run.outcome === "blocked").length;
  const canMarkReleaseReady = qaAllComplete && releaseQaRuns.length > 0;
  const visibleQaRuns =
    qaRunFilter === "all" ? releaseQaRuns : releaseQaRuns.filter((run) => run.outcome === qaRunFilter);
  const releaseQaTabLabel =
    qaFailures > 0
      ? `Release QA (${qaCompletedCount}/${releaseQaChecklist.length} · ${qaFailures} open)`
      : `Release QA (${qaCompletedCount}/${releaseQaChecklist.length})`;

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

  const toggleReleaseQaCheck = (checkId: string) => {
    setReleaseQaChecksState((current) => ({
      ...current,
      [checkId]: !current[checkId]
    }));
  };

  const markAllReleaseQaChecks = () => {
    const allChecked = Object.fromEntries(releaseQaChecklist.map((check) => [check.id, true]));
    setReleaseQaChecksState(allChecked);
    setStatusMessage("Release QA checklist marked complete.");
  };

  const resetReleaseQaChecks = () => {
    setReleaseQaChecksState({});
    clearReleaseQaSignoff();
    clearReleaseQaRuns();
    setReleaseQaSignoffState(null);
    setReleaseQaRunsState([]);
    setStatusMessage("Release QA checklist reset.");
  };

  const markReleaseReady = () => {
    const signedAt = new Date().toISOString();
    setReleaseQaSignoff(signedAt);
    setReleaseQaSignoffState(signedAt);
    setStatusMessage("Release QA sign-off captured.");
  };

  const addReleaseQaRun = () => {
    const trimmedNotes = qaRunNotes.trim();

    if (editingQaRunId) {
      setReleaseQaRunsState((current) =>
        current.map((run) =>
          run.id === editingQaRunId
            ? {
                ...run,
                device: qaRunDevice,
                scenario: qaRunScenario,
                outcome: qaRunOutcome,
                notes: trimmedNotes,
                timestampIso: new Date().toISOString()
              }
            : run
        )
      );
      setEditingQaRunId(null);
      setQaRunNotes("");
      setStatusMessage("Release QA run updated.");
      return;
    }

    const nextRun: ReleaseQaRun = {
      id: `qa-${Date.now()}`,
      device: qaRunDevice,
      scenario: qaRunScenario,
      outcome: qaRunOutcome,
      notes: trimmedNotes,
      timestampIso: new Date().toISOString()
    };

    setReleaseQaRunsState((current) => [nextRun, ...current].slice(0, 30));
    setQaRunNotes("");
    setStatusMessage("Release QA run logged.");
  };

  const editReleaseQaRun = (runId: string) => {
    const existing = releaseQaRuns.find((run) => run.id === runId);
    if (!existing) {
      return;
    }
    setEditingQaRunId(runId);
    setQaRunDevice(existing.device);
    setQaRunScenario(existing.scenario);
    setQaRunOutcome(existing.outcome);
    setQaRunNotes(existing.notes);
    setStatusMessage("Editing selected QA run.");
  };

  const cancelEditingReleaseQaRun = () => {
    setEditingQaRunId(null);
    setQaRunDevice(qaDevices[0]);
    setQaRunScenario(qaScenarios[0]);
    setQaRunOutcome("pass");
    setQaRunNotes("");
    setStatusMessage("QA run editing cancelled.");
  };

  const deleteReleaseQaRun = (runId: string) => {
    setReleaseQaRunsState((current) => current.filter((run) => run.id !== runId));
    if (editingQaRunId === runId) {
      cancelEditingReleaseQaRun();
      return;
    }
    setStatusMessage("Release QA run removed.");
  };

  const exportReleaseQaRuns = () => {
    if (releaseQaRuns.length === 0) {
      setStatusMessage("No QA runs to export yet.");
      return;
    }

    try {
      const payload = {
        exportedAt: new Date().toISOString(),
        runs: releaseQaRuns
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "release-qa-runs.json";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setStatusMessage("QA run log exported.");
    } catch {
      setStatusMessage("Unable to export QA run log.");
    }
  };

  const copyFailedQaRuns = async () => {
    const failedRuns = releaseQaRuns.filter((run) => run.outcome === "fail");
    if (failedRuns.length === 0) {
      setStatusMessage("No failed QA runs to copy.");
      return;
    }

    const failedSummary = [
      "Failed QA runs",
      ...failedRuns.map((run) => {
        const notes = run.notes ? ` | Notes: ${run.notes}` : "";
        return `- ${run.timestampIso} | ${run.device} | ${run.scenario}${notes}`;
      })
    ].join("\n");

    if (!navigator.clipboard || !navigator.clipboard.writeText) {
      setStatusMessage("Clipboard is unavailable on this device.");
      return;
    }

    try {
      await navigator.clipboard.writeText(failedSummary);
      setStatusMessage("Failed QA runs copied to clipboard.");
    } catch {
      setStatusMessage("Unable to copy failed QA runs.");
    }
  };

  const copyQaSummary = async () => {
    const checklistLines = releaseQaChecklist.map((check) => {
      const complete = releaseQaChecks[check.id] ? "[x]" : "[ ]";
      return `${complete} ${check.label}`;
    });

    const summaryText = [
      "Release QA Checklist",
      ...checklistLines,
      "",
      formatTelemetrySummary(telemetrySummary),
      `Sign-off: ${releaseQaSignoff ?? "Not signed"}`,
      "",
      "Recent QA runs:",
      ...releaseQaRuns.map((run) => {
        const notes = run.notes ? ` | Notes: ${run.notes}` : "";
        return `- ${run.timestampIso} | ${run.device} | ${run.scenario} | ${run.outcome}${notes}`;
      })
    ].join("\n");

    if (!navigator.clipboard || !navigator.clipboard.writeText) {
      setStatusMessage("Clipboard is unavailable on this device.");
      return;
    }

    try {
      await navigator.clipboard.writeText(summaryText);
      setStatusMessage("QA summary copied to clipboard.");
    } catch {
      setStatusMessage("Unable to copy QA summary.");
    }
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
    setReleaseQaChecksState({});
    setReleaseQaSignoffState(null);
    setReleaseQaRunsState([]);
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
        <button
          type="button"
          className={activeTab === "qa" ? "tab-active" : "secondary"}
          onClick={() => setActiveTabState("qa")}
        >
          {releaseQaTabLabel}
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
            {activeTab === "browse"
              ? `Top nearby hikes for ${baseLocation.label}`
              : activeTab === "shortlist"
                ? "Your shortlist"
                : "Release QA checklist"}
          </h2>
          {activeTab === "browse" && filteredHikes.length > 3 && (
            <section className="card trail-count-controls" aria-label="Trail count controls">
              <p>
                Trails shown: {displayedTrailCount} of {filteredHikes.length}
              </p>
              <div className="trail-count-buttons">
                <button
                  type="button"
                  className={visibleTrailCount === 3 ? "tab-active" : "secondary"}
                  onClick={() => setVisibleTrailCount(3)}
                >
                  3
                </button>
                <button
                  type="button"
                  className={visibleTrailCount === 5 ? "tab-active" : "secondary"}
                  onClick={() => setVisibleTrailCount(5)}
                >
                  5
                </button>
                <button
                  type="button"
                  className={visibleTrailCount === 99 ? "tab-active" : "secondary"}
                  onClick={() => setVisibleTrailCount(99)}
                >
                  All
                </button>
              </div>
            </section>
          )}
          {activeTab === "browse" && hikesLoading ? (
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
              filteredHikes.slice(0, displayedTrailCount).map((hike) => (
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
          ) : activeTab === "shortlist" ? (
            shortlistedHikes.length === 0 ? (
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
            )
          ) : (
            <section className="card qa-checklist">
              <p>
                {qaCompletedCount} of {releaseQaChecklist.length} checks complete.
              </p>
              <p>
                Logged QA runs: {releaseQaRuns.length} ({qaFailures} failures)
              </p>
              <div className="qa-list">
                {releaseQaChecklist.map((check) => (
                  <label key={check.id} className="qa-item">
                    <input
                      type="checkbox"
                      checked={Boolean(releaseQaChecks[check.id])}
                      onChange={() => toggleReleaseQaCheck(check.id)}
                    />
                    <span>{check.label}</span>
                  </label>
                ))}
              </div>
              <div className="empty-state-actions">
                <button type="button" className="secondary" onClick={markAllReleaseQaChecks}>
                  Mark all complete
                </button>
                <button
                  type="button"
                  className="secondary"
                  onClick={markReleaseReady}
                  disabled={!canMarkReleaseReady}
                >
                  Mark release ready
                </button>
                <button type="button" className="secondary" onClick={resetReleaseQaChecks}>
                  Reset checklist
                </button>
              </div>

              <section className="qa-run-form">
                <h3>Log QA run</h3>
                <div className="filter-row">
                  <label>
                    Device
                    <select value={qaRunDevice} onChange={(event) => setQaRunDevice(event.target.value)}>
                      {qaDevices.map((device) => (
                        <option key={device} value={device}>
                          {device}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Scenario
                    <select value={qaRunScenario} onChange={(event) => setQaRunScenario(event.target.value)}>
                      {qaScenarios.map((scenario) => (
                        <option key={scenario} value={scenario}>
                          {scenario}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <label>
                  Outcome
                  <select
                    value={qaRunOutcome}
                    onChange={(event) => setQaRunOutcome(event.target.value as "pass" | "fail" | "blocked")}
                  >
                    <option value="pass">Pass</option>
                    <option value="fail">Fail</option>
                    <option value="blocked">Blocked</option>
                  </select>
                </label>
                <label>
                  Notes
                  <textarea
                    value={qaRunNotes}
                    onChange={(event) => setQaRunNotes(event.target.value)}
                    placeholder="What happened during this run?"
                    rows={3}
                  />
                </label>
                <button type="button" className="secondary" onClick={addReleaseQaRun}>
                  {editingQaRunId ? "Update QA run" : "Add QA run"}
                </button>
                {editingQaRunId && (
                  <button type="button" className="secondary" onClick={cancelEditingReleaseQaRun}>
                    Cancel edit
                  </button>
                )}
              </section>

              {releaseQaRuns.length > 0 && (
                <>
                  <div className="qa-run-controls">
                    <label>
                      Run filter
                      <select
                        value={qaRunFilter}
                        onChange={(event) =>
                          setQaRunFilter(event.target.value as "all" | "pass" | "fail" | "blocked")
                        }
                      >
                        <option value="all">All</option>
                        <option value="pass">Pass</option>
                        <option value="fail">Fail</option>
                        <option value="blocked">Blocked</option>
                      </select>
                    </label>
                    <button type="button" className="secondary" onClick={copyFailedQaRuns}>
                      Copy failed runs
                    </button>
                  </div>
                  <ul className="qa-run-list">
                    {visibleQaRuns.slice(0, 8).map((run) => (
                      <li key={run.id}>
                        <div className="qa-run-row">
                          <span>
                            <strong>{run.device}</strong> · {run.scenario} · {run.outcome}
                            {run.notes ? ` · ${run.notes}` : ""}
                          </span>
                          <div className="qa-run-row-actions">
                            <button type="button" className="secondary" onClick={() => editReleaseQaRun(run.id)}>
                              Edit
                            </button>
                            <button type="button" className="secondary" onClick={() => deleteReleaseQaRun(run.id)}>
                              Delete
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </section>
          )}
        </section>

        {activeTab === "qa" ? (
          <section className="card qa-summary">
            <h2>Release readiness</h2>
            <p>
              Status: {qaAllComplete ? "Ready for release checks" : "Checklist still in progress"}
            </p>
            <p>Total telemetry events: {telemetrySummary.totalEvents}</p>
            <p>Maps handoff events: {telemetrySummary.mapsHandoffCount}</p>
            <p>Provider fallback events: {telemetrySummary.fallbackUsedCount}</p>
            <p>Fallback rate: {telemetrySummary.fallbackRatePercent}%</p>
            <p>
              QA outcomes: {qaPasses} pass · {qaFailures} fail · {qaBlocked} blocked
            </p>
            <p>
              Last sign-off: {releaseQaSignoff ? new Date(releaseQaSignoff).toLocaleString() : "Not signed"}
            </p>
            <button type="button" className="secondary" onClick={copyQaSummary}>
              Copy QA summary
            </button>
            <button type="button" className="secondary" onClick={exportReleaseQaRuns}>
              Export QA runs JSON
            </button>
          </section>
        ) : (
          <HikeDetail
            hike={selectedHike}
            shortlisted={selectedHike ? shortlist.includes(selectedHike.id) : false}
            onToggleShortlist={() => {
              if (selectedHike) {
                toggleShortlist(selectedHike.id);
              }
            }}
          />
        )}
      </section>
    </main>
  );
}

export default App
