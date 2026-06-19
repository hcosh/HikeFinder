// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import BaseLocationBar from "./BaseLocationBar";

describe("BaseLocationBar", () => {
  afterEach(() => {
    cleanup();
  });

  it("applies manual location when OK button is pressed", async () => {
    const onApplyManualBaseLocation = vi.fn();
    const onApplyRecentBaseLocation = vi.fn();
    const user = userEvent.setup();

    render(
      <BaseLocationBar
        baseLocation={{ label: "Current area" }}
        recentLocations={[]}
        onApplyManualBaseLocation={onApplyManualBaseLocation}
        onApplyRecentBaseLocation={onApplyRecentBaseLocation}
        onUseCurrentLocation={() => {}}
        isKnownLocationLabel={() => true}
        locating={false}
      />
    );

    const input = screen.getByPlaceholderText("Hotel, town, or area");
    const okButton = screen.getByRole("button", { name: "OK" });

    await user.clear(input);
    await user.type(input, "Kapalua");
    await user.click(okButton);

    expect(onApplyManualBaseLocation).toHaveBeenCalledTimes(1);
    expect(onApplyManualBaseLocation).toHaveBeenCalledWith("Kapalua");
  });

  it("applies manual location when Enter is pressed", async () => {
    const onApplyManualBaseLocation = vi.fn();
    const onApplyRecentBaseLocation = vi.fn();
    const user = userEvent.setup();

    render(
      <BaseLocationBar
        baseLocation={{ label: "Current area" }}
        recentLocations={[]}
        onApplyManualBaseLocation={onApplyManualBaseLocation}
        onApplyRecentBaseLocation={onApplyRecentBaseLocation}
        onUseCurrentLocation={() => {}}
        isKnownLocationLabel={() => true}
        locating={false}
      />
    );

    const input = screen.getByPlaceholderText("Hotel, town, or area");
    await user.clear(input);
    await user.type(input, "Wailea{Enter}");

    expect(onApplyManualBaseLocation).toHaveBeenCalledTimes(1);
    expect(onApplyManualBaseLocation).toHaveBeenCalledWith("Wailea");
  });

  it("applies recent location on one tap", async () => {
    const onApplyManualBaseLocation = vi.fn();
    const onApplyRecentBaseLocation = vi.fn();
    const user = userEvent.setup();

    render(
      <BaseLocationBar
        baseLocation={{ label: "Current area" }}
        recentLocations={["Kapalua", "Wailea"]}
        onApplyManualBaseLocation={onApplyManualBaseLocation}
        onApplyRecentBaseLocation={onApplyRecentBaseLocation}
        onUseCurrentLocation={() => {}}
        isKnownLocationLabel={() => true}
        locating={false}
      />
    );

    await user.click(screen.getByRole("button", { name: "Kapalua" }));

    expect(onApplyRecentBaseLocation).toHaveBeenCalledTimes(1);
    expect(onApplyRecentBaseLocation).toHaveBeenCalledWith("Kapalua");
  });

  it("shows location support status while typing", async () => {
    const user = userEvent.setup();
    const isKnownLocationLabel = vi.fn((value: string) => value.toLowerCase().includes("barcelona"));

    render(
      <BaseLocationBar
        baseLocation={{ label: "Current area" }}
        recentLocations={[]}
        onApplyManualBaseLocation={() => {}}
        onApplyRecentBaseLocation={() => {}}
        onUseCurrentLocation={() => {}}
        isKnownLocationLabel={isKnownLocationLabel}
        locating={false}
      />
    );

    const input = screen.getByPlaceholderText("Hotel, town, or area");
    await user.clear(input);
    await user.type(input, "Reykjavik");
    expect(screen.getByText("Location will be looked up when you tap OK.")).toBeTruthy();

    await user.clear(input);
    await user.type(input, "Barcelona");
    expect(screen.getByText("Location recognized.")).toBeTruthy();
    expect(isKnownLocationLabel).toHaveBeenCalled();
  });
});
