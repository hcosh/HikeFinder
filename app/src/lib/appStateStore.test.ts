import { describe, expect, it, beforeEach } from "vitest";
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
  setSavedBaseLocation
} from "./appStateStore";

describe("appStateStore", () => {
  beforeEach(() => {
    clearAppState();
  });

  it("persists and restores base location", () => {
    setSavedBaseLocation({ label: "Kapalua" });
    expect(getSavedBaseLocation()).toEqual({ label: "Kapalua" });
  });

  it("defaults to browse tab and restores shortlist/qa tabs", () => {
    expect(getActiveTab()).toBe("browse");
    setActiveTab("shortlist");
    expect(getActiveTab()).toBe("shortlist");
    setActiveTab("qa");
    expect(getActiveTab()).toBe("qa");
  });

  it("stores recent base locations with newest first and deduped", () => {
    pushRecentBaseLocation("Kapalua");
    pushRecentBaseLocation("Wailea");
    pushRecentBaseLocation("Kapalua");

    expect(getRecentBaseLocations()).toEqual(["Kapalua", "Wailea"]);
  });

  it("limits recent base locations to max items", () => {
    pushRecentBaseLocation("A", 3);
    pushRecentBaseLocation("B", 3);
    pushRecentBaseLocation("C", 3);
    pushRecentBaseLocation("D", 3);

    expect(getRecentBaseLocations()).toEqual(["D", "C", "B"]);
  });

  it("persists release qa checklist values", () => {
    setReleaseQaChecks({ core_flow: true, ipad_rotation: false });
    expect(getReleaseQaChecks()).toEqual({ core_flow: true, ipad_rotation: false });
  });

  it("persists and clears release qa sign-off timestamp", () => {
    expect(getReleaseQaSignoff()).toBeNull();
    setReleaseQaSignoff("2026-06-16T00:00:00.000Z");
    expect(getReleaseQaSignoff()).toBe("2026-06-16T00:00:00.000Z");
    clearReleaseQaSignoff();
    expect(getReleaseQaSignoff()).toBeNull();
  });

  it("persists and clears release qa run logs", () => {
    setReleaseQaRuns([
      {
        id: "run-1",
        device: "iPhone Safari",
        scenario: "Location denied",
        outcome: "pass",
        notes: "Manual entry worked",
        timestampIso: "2026-06-16T00:00:00.000Z"
      }
    ]);

    expect(getReleaseQaRuns()).toEqual([
      {
        id: "run-1",
        device: "iPhone Safari",
        scenario: "Location denied",
        outcome: "pass",
        notes: "Manual entry worked",
        timestampIso: "2026-06-16T00:00:00.000Z"
      }
    ]);

    clearReleaseQaRuns();
    expect(getReleaseQaRuns()).toEqual([]);
  });
});
