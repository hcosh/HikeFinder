const SHORTLIST_KEY = "holiday-hiking-shortlist";

export function getShortlist(): string[] {
  try {
    const raw = localStorage.getItem(SHORTLIST_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export function setShortlist(ids: string[]): void {
  localStorage.setItem(SHORTLIST_KEY, JSON.stringify(ids));
}

export function clearShortlist(): void {
  localStorage.removeItem(SHORTLIST_KEY);
}