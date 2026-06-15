import { beforeEach, describe, expect, it } from "vitest";
import { clearShortlist, getShortlist, setShortlist } from "./shortlistStore";

describe("shortlistStore", () => {
  beforeEach(() => {
    clearShortlist();
  });

  it("persists shortlist ids", () => {
    setShortlist(["a", "b"]);
    expect(getShortlist()).toEqual(["a", "b"]);
  });

  it("clears stored shortlist ids", () => {
    setShortlist(["a", "b"]);
    clearShortlist();
    expect(getShortlist()).toEqual([]);
  });
});
