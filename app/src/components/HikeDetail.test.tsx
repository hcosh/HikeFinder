import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import HikeDetail from "./HikeDetail";
import type { Hike } from "../types";

vi.mock("./TrailheadMap", () => ({
  default: () => React.createElement("div", { "data-testid": "trailhead-map" })
}));

const createHike = (coords: { lat: number; lng: number }): Hike => ({
  id: "hike-1",
  name: "Coastal Morning Trail",
  rating: 4.6,
  reviews: 98,
  difficulty: "easy",
  hours: 2,
  distanceKm: 4.3,
  highlights: ["Views", "Cliffs"],
  summary: "Easy coastal hike",
  trailhead: {
    label: "Coastal Trailhead",
    coordinates: coords,
    transitOptions: ["Bus to the trailhead area, then a short walk."],
    qualityConfidence: 0.93,
    source: "test"
  }
});

describe("HikeDetail", () => {
  it("shows Google Maps handoff when coordinates are valid", () => {
    const html = renderToStaticMarkup(
      <HikeDetail hike={createHike({ lat: 20.99, lng: -156.66 })} shortlisted={false} onToggleShortlist={() => {}} />
    );

    expect(html).toContain("Open in Google Maps");
    expect(html).not.toContain("Copy trailhead coordinates");
  });

  it("shows coordinate copy fallback when coordinates are invalid", () => {
    const html = renderToStaticMarkup(
      <HikeDetail hike={createHike({ lat: 999, lng: -156.66 })} shortlisted={false} onToggleShortlist={() => {}} />
    );

    expect(html).toContain("Copy trailhead coordinates");
    expect(html).not.toContain("Open in Google Maps");
  });

  it("shows public transport options when available", () => {
    const html = renderToStaticMarkup(
      <HikeDetail hike={createHike({ lat: 20.99, lng: -156.66 })} shortlisted={false} onToggleShortlist={() => {}} />
    );

    expect(html).toContain("Public transport:");
    expect(html).toContain("Bus to the trailhead area");
  });
});
