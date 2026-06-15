import { describe, expect, it, beforeEach } from "vitest";
import {
  clearAppState,
  getActiveTab,
  getRecentBaseLocations,
  getSavedBaseLocation,
  pushRecentBaseLocation,
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

  it("defaults to browse tab and restores shortlist tab", () => {
    expect(getActiveTab()).toBe("browse");
    setActiveTab("shortlist");
    expect(getActiveTab()).toBe("shortlist");
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
});
