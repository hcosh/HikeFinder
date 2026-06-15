import type { BaseLocation } from "../types";

const BASE_LOCATION_KEY = "holiday-hiking-base-location";
const ACTIVE_TAB_KEY = "holiday-hiking-active-tab";

export type ActiveTab = "browse" | "shortlist";

export function getSavedBaseLocation(): BaseLocation | null {
  try {
    const raw = localStorage.getItem(BASE_LOCATION_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as BaseLocation;
    if (!parsed || typeof parsed.label !== "string") {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function setSavedBaseLocation(next: BaseLocation): void {
  localStorage.setItem(BASE_LOCATION_KEY, JSON.stringify(next));
}

export function getActiveTab(): ActiveTab {
  try {
    const raw = localStorage.getItem(ACTIVE_TAB_KEY);
    return raw === "shortlist" ? "shortlist" : "browse";
  } catch {
    return "browse";
  }
}

export function setActiveTab(next: ActiveTab): void {
  localStorage.setItem(ACTIVE_TAB_KEY, next);
}

export function clearAppState(): void {
  localStorage.removeItem(BASE_LOCATION_KEY);
  localStorage.removeItem(ACTIVE_TAB_KEY);
}