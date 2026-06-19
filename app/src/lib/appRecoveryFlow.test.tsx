// @vitest-environment jsdom

import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "../App";
import { pushRecentBaseLocation } from "./appStateStore";
import type { Hike } from "../types";

const mocks = vi.hoisted(() => ({
  listNearbyHikesMock: vi.fn(),
  requestLocationMock: vi.fn()
}));

const geolocationState: {
  coords: { lat: number; lng: number } | null;
  error: string;
  loading: boolean;
  requestLocation: () => void;
} = {
  coords: null,
  error: "",
  loading: false,
  requestLocation: mocks.requestLocationMock
};

const mockHikes: Hike[] = [
  {
    id: "mock-ridge-trail",
    name: "Mock Ridge Trail",
    summary: "A test trail used for App recovery-state validation.",
    difficulty: "moderate",
    rating: 4.4,
    reviews: 42,
    hours: 5,
    distanceKm: 11,
    highlights: ["Ridgeline views", "Forest switchbacks"],
    trailhead: {
      label: "Mock Trailhead",
      coordinates: { lat: 58.969, lng: 5.733 },
      qualityConfidence: 0.91,
      source: "mock"
    }
  }
];

const manyMockHikes: Hike[] = Array.from({ length: 6 }, (_, index) => ({
  id: `mock-hike-${index + 1}`,
  name: `Mock Trail ${index + 1}`,
  summary: "Generated test trail",
  difficulty: index % 2 === 0 ? "easy" : "moderate",
  rating: 4.2,
  reviews: 100 + index,
  hours: 2 + index * 0.2,
  distanceKm: 4 + index,
  highlights: ["Viewpoint", "Forest"],
  trailhead: {
    label: `Trailhead ${index + 1}`,
    coordinates: { lat: 40 + index * 0.01, lng: -120 - index * 0.01 },
    qualityConfidence: 0.9,
    source: "mock"
  }
}));

vi.mock("../data/providers", () => ({
  defaultHikeProvider: {
    listNearbyHikes: mocks.listNearbyHikesMock
  }
}));

vi.mock("../hooks/useGeolocation", () => ({
  useGeolocation: () => geolocationState
}));

describe("App recovery states", () => {
  beforeEach(() => {
    localStorage.clear();
    mocks.listNearbyHikesMock.mockReset();
    mocks.requestLocationMock.mockReset();
    geolocationState.coords = null;
    geolocationState.error = "";
    geolocationState.loading = false;
  });

  afterEach(() => {
    cleanup();
  });

  it("retries loading hikes after an initial provider failure", async () => {
    const user = userEvent.setup();

    mocks.listNearbyHikesMock
      .mockRejectedValueOnce(new Error("network"))
      .mockResolvedValueOnce([]);

    render(<App />);

    expect(await screen.findByText("Unable to load hikes right now. Try again.")).toBeTruthy();

    const retryButtons = screen.getAllByRole("button", { name: "Retry loading hikes" });
    await user.click(retryButtons[0]);

    await waitFor(() => {
      expect(mocks.listNearbyHikesMock).toHaveBeenCalledTimes(2);
    });

    await waitFor(() => {
      expect(screen.queryByText("Unable to load hikes right now. Try again.")).toBeNull();
    });
  });

  it("lets users retry location and recover with a recent base location", async () => {
    const user = userEvent.setup();

    geolocationState.error = "Location permission denied. Use manual base location.";
    pushRecentBaseLocation("Stavanger");
    mocks.listNearbyHikesMock.mockResolvedValue([]);

    render(<App />);

    await user.click(screen.getByRole("button", { name: "Try current location again" }));
    expect(mocks.requestLocationMock).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole("button", { name: "Use recent location: Stavanger" }));

    await waitFor(() => {
      expect(mocks.listNearbyHikesMock).toHaveBeenCalledWith("Stavanger");
    });

    expect(await screen.findByText("Top nearby hikes for Stavanger")).toBeTruthy();
  });

  it("broadens filters from the empty browse state to recover hike options", async () => {
    const user = userEvent.setup();
    mocks.listNearbyHikesMock.mockResolvedValue(mockHikes);

    render(<App />);

    expect(await screen.findByRole("heading", { name: "Mock Ridge Trail", level: 3 })).toBeTruthy();

    const minRatingInput = screen.getByLabelText("Minimum rating");
    const maxHoursInput = screen.getByLabelText("Max hours");

    await user.clear(minRatingInput);
    await user.type(minRatingInput, "5");
    await user.clear(maxHoursInput);
    await user.type(maxHoursInput, "2");

    expect(await screen.findByText("No hikes match these filters.")).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "Broaden search" }));

    await waitFor(() => {
      expect(screen.queryByText("No hikes match these filters.")).toBeNull();
    });
    expect(await screen.findByRole("heading", { name: "Mock Ridge Trail", level: 3 })).toBeTruthy();
  });

  it("shows a location no-data state when provider returns zero hikes without an error", async () => {
    const user = userEvent.setup();
    mocks.listNearbyHikesMock.mockResolvedValue([]);

    render(<App />);

    expect(await screen.findByText("No hikes are currently available for Current area.")).toBeTruthy();

    const noDataState = screen.getByText("No hikes are currently available for Current area.").closest("div");
    if (!noDataState) {
      throw new Error("Expected no-data state container");
    }

    await user.click(within(noDataState).getByRole("button", { name: "Use current location" }));
    expect(mocks.requestLocationMock).toHaveBeenCalledTimes(1);
  });

  it("shows retry controls in browse pane when hike loading fails", async () => {
    const user = userEvent.setup();
    mocks.listNearbyHikesMock.mockRejectedValue(new Error("network"));

    render(<App />);

    expect(await screen.findByText("We could not load hikes right now.")).toBeTruthy();

    const retryButtons = screen.getAllByRole("button", { name: "Retry loading hikes" });
    await user.click(retryButtons[0]);

    await waitFor(() => {
      expect(mocks.listNearbyHikesMock).toHaveBeenCalledTimes(2);
    });
  });

  it("shows release QA tab with checklist progress and controls", async () => {
    const user = userEvent.setup();
    mocks.listNearbyHikesMock.mockResolvedValue([]);

    render(<App />);

    await user.click(screen.getByRole("button", { name: /Release QA/ }));

    expect(await screen.findByText("Release readiness")).toBeTruthy();
    expect(screen.getByText("0 of 5 checks complete.")).toBeTruthy();

    await user.click(screen.getByLabelText("iPhone core flow passes end-to-end"));
    expect(screen.getByText("1 of 5 checks complete.")).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "Mark all complete" }));
    expect(screen.getByText("5 of 5 checks complete.")).toBeTruthy();

    await user.selectOptions(screen.getByLabelText("Outcome"), "fail");
    await user.type(screen.getByLabelText("Notes"), "Map handoff failed in split view");
    await user.click(screen.getByRole("button", { name: "Add QA run" }));
    expect(screen.getByText("Logged QA runs: 1 (1 failures)")).toBeTruthy();
    expect(screen.getByText(/Map handoff failed in split view/)).toBeTruthy();
    expect(screen.getByText("QA outcomes: 0 pass · 1 fail · 0 blocked")).toBeTruthy();
    expect(screen.getByRole("button", { name: /Release QA \(5\/5 · 1 open\)/ })).toBeTruthy();

    await user.selectOptions(screen.getByLabelText("Run filter"), "fail");
    expect(screen.getByText(/Map handoff failed in split view/)).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "Copy failed runs" }));
    const copiedFailedMessage = screen.queryByText("Failed QA runs copied to clipboard.");
    const clipboardUnavailableMessage = screen.queryByText("Clipboard is unavailable on this device.");
    expect(Boolean(copiedFailedMessage || clipboardUnavailableMessage)).toBe(true);

    await user.click(screen.getByRole("button", { name: "Mark release ready" }));
    expect(screen.queryByText("Last sign-off: Not signed")).toBeNull();

    await user.click(screen.getByRole("button", { name: "Delete" }));
    expect(screen.getByText("Logged QA runs: 0 (0 failures)")).toBeTruthy();
    expect(screen.getByRole("button", { name: /Release QA \(5\/5\)$/ })).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "Copy QA summary" }));
    const copiedMessage = screen.queryByText("QA summary copied to clipboard.");
    const unavailableMessage = screen.queryByText("Clipboard is unavailable on this device.");
    expect(Boolean(copiedMessage || unavailableMessage)).toBe(true);
  });

  it("lets users increase visible trail count beyond three", async () => {
    const user = userEvent.setup();
    mocks.listNearbyHikesMock.mockResolvedValue(manyMockHikes);

    render(<App />);

    expect(await screen.findByText("Trails shown")).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "3" }));
    expect(screen.queryByRole("heading", { name: "Mock Trail 4", level: 3 })).toBeNull();

    await user.click(screen.getByRole("button", { name: "5" }));
    expect(screen.getByRole("heading", { name: "Mock Trail 5", level: 3 })).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "All" }));
    expect(screen.getByRole("heading", { name: "Mock Trail 6", level: 3 })).toBeTruthy();
  });
});
