import type { BaseLocation } from "../types";

const BASE_LOCATION_KEY = "holiday-hiking-base-location";
const ACTIVE_TAB_KEY = "holiday-hiking-active-tab";
const RECENT_BASE_LOCATIONS_KEY = "holiday-hiking-recent-base-locations";
const RELEASE_QA_CHECKS_KEY = "holiday-hiking-release-qa-checks";
const RELEASE_QA_SIGNOFF_KEY = "holiday-hiking-release-qa-signoff";
const RELEASE_QA_RUNS_KEY = "holiday-hiking-release-qa-runs";

export type ActiveTab = "browse" | "shortlist" | "qa";
export type ReleaseQaChecks = Record<string, boolean>;
export type ReleaseQaRun = {
  id: string;
  device: string;
  scenario: string;
  outcome: "pass" | "fail" | "blocked";
  notes: string;
  timestampIso: string;
};

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
    if (raw === "shortlist" || raw === "qa") {
      return raw;
    }
    return "browse";
  } catch {
    return "browse";
  }
}

export function setActiveTab(next: ActiveTab): void {
  localStorage.setItem(ACTIVE_TAB_KEY, next);
}

export function getRecentBaseLocations(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_BASE_LOCATIONS_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter((value): value is string => typeof value === "string" && value.length > 0);
  } catch {
    return [];
  }
}

export function pushRecentBaseLocation(label: string, maxItems = 5): string[] {
  const normalized = label.trim();
  if (!normalized) {
    return getRecentBaseLocations();
  }

  const current = getRecentBaseLocations();
  const deduped = [normalized, ...current.filter((value) => value !== normalized)].slice(0, maxItems);
  localStorage.setItem(RECENT_BASE_LOCATIONS_KEY, JSON.stringify(deduped));
  return deduped;
}

export function getReleaseQaChecks(): ReleaseQaChecks {
  try {
    const raw = localStorage.getItem(RELEASE_QA_CHECKS_KEY);
    if (!raw) {
      return {};
    }
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }

    const sanitized: ReleaseQaChecks = {};
    for (const [key, value] of Object.entries(parsed)) {
      if (typeof value === "boolean") {
        sanitized[key] = value;
      }
    }
    return sanitized;
  } catch {
    return {};
  }
}

export function setReleaseQaChecks(next: ReleaseQaChecks): void {
  localStorage.setItem(RELEASE_QA_CHECKS_KEY, JSON.stringify(next));
}

export function getReleaseQaSignoff(): string | null {
  try {
    const raw = localStorage.getItem(RELEASE_QA_SIGNOFF_KEY);
    if (!raw || typeof raw !== "string") {
      return null;
    }
    return raw;
  } catch {
    return null;
  }
}

export function setReleaseQaSignoff(timestampIso: string): void {
  localStorage.setItem(RELEASE_QA_SIGNOFF_KEY, timestampIso);
}

export function clearReleaseQaSignoff(): void {
  localStorage.removeItem(RELEASE_QA_SIGNOFF_KEY);
}

export function getReleaseQaRuns(): ReleaseQaRun[] {
  try {
    const raw = localStorage.getItem(RELEASE_QA_RUNS_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (value): value is ReleaseQaRun =>
        value &&
        typeof value === "object" &&
        typeof value.id === "string" &&
        typeof value.device === "string" &&
        typeof value.scenario === "string" &&
        (value.outcome === "pass" || value.outcome === "fail" || value.outcome === "blocked") &&
        typeof value.notes === "string" &&
        typeof value.timestampIso === "string"
    );
  } catch {
    return [];
  }
}

export function setReleaseQaRuns(next: ReleaseQaRun[]): void {
  localStorage.setItem(RELEASE_QA_RUNS_KEY, JSON.stringify(next));
}

export function clearReleaseQaRuns(): void {
  localStorage.removeItem(RELEASE_QA_RUNS_KEY);
}

export function clearAppState(): void {
  localStorage.removeItem(BASE_LOCATION_KEY);
  localStorage.removeItem(ACTIVE_TAB_KEY);
  localStorage.removeItem(RECENT_BASE_LOCATIONS_KEY);
  localStorage.removeItem(RELEASE_QA_CHECKS_KEY);
  localStorage.removeItem(RELEASE_QA_SIGNOFF_KEY);
  localStorage.removeItem(RELEASE_QA_RUNS_KEY);
}