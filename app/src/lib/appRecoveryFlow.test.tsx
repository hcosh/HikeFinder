// @vitest-environment jsdom

import { cleanup, render, screen, waitFor } from "@testing-library/react";
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

    await user.click(screen.getByRole("button", { name: "Retry loading hikes" }));

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
});
