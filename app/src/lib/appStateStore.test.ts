import { describe, expect, it, beforeEach } from "vitest";
import {
  clearAppState,
  getActiveTab,
  getSavedBaseLocation,
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
});
