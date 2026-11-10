import { describe, expect, it } from "vitest";

import { isDay, shiftDay } from "./calendar-dates.js";

describe("isDay", () => {
  it("accepts a real day", () => {
    expect(isDay("2026-11-08")).toBe(true);
    expect(isDay("2024-02-29")).toBe(true);
    expect(isDay("2026-12-31")).toBe(true);
  });

  it("rejects a day that does not exist instead of reading it as the next month's", () => {
    // `Date.parse("2026-02-31T00:00:00Z")` does not fail: it rolls over to 3 March.
    expect(isDay("2026-02-31")).toBe(false);
    expect(isDay("2023-02-29")).toBe(false);
    expect(isDay("2026-04-31")).toBe(false);
    expect(isDay("2026-13-01")).toBe(false);
    expect(isDay("2026-00-10")).toBe(false);
  });

  it("rejects anything that is not a full day", () => {
    expect(isDay("2026-11")).toBe(false);
    expect(isDay("08/11/2026")).toBe(false);
    expect(isDay("")).toBe(false);
  });
});

describe("shiftDay", () => {
  it("moves by whole days across months and years", () => {
    expect(shiftDay("2026-11-30", 1)).toBe("2026-12-01");
    expect(shiftDay("2026-01-01", -1)).toBe("2025-12-31");
    expect(shiftDay("2024-02-28", 1)).toBe("2024-02-29");
  });
});
