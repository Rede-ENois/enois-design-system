import { describe, expect, it } from "vitest";

import { isClock, maskTime } from "./time-input.js";

describe("maskTime", () => {
  it("inserts the colon as the reader types", () => {
    expect(maskTime("1")).toBe("1");
    expect(maskTime("19")).toBe("19");
    expect(maskTime("193")).toBe("19:3");
    expect(maskTime("1930")).toBe("19:30");
  });

  it("reads one digit above 2 as the hour alone", () => {
    expect(maskTime("9")).toBe("09");
    expect(maskTime("9:30")).toBe("09:30");
  });

  it("refuses an hour or a minute that does not exist while typing", () => {
    expect(maskTime("29")).toBe("2");
    expect(maskTime("2999")).toBe("2");
    expect(maskTime("1970")).toBe("19:7");
    expect(maskTime("1960")).toBe("19:6");
  });

  it("keeps only digits and stops at four", () => {
    expect(maskTime("19h30")).toBe("19:30");
    expect(maskTime("193000")).toBe("19:30");
    expect(maskTime("abc")).toBe("");
  });

  it("accepts the edges of the day", () => {
    expect(maskTime("0000")).toBe("00:00");
    expect(maskTime("2359")).toBe("23:59");
  });
});

describe("isClock", () => {
  it("accepts a complete 24-hour clock", () => {
    expect(isClock("00:00")).toBe(true);
    expect(isClock("23:59")).toBe(true);
    expect(isClock("09:05")).toBe(true);
  });

  it("rejects partial, 24-hour and malformed values", () => {
    expect(isClock("9:05")).toBe(false);
    expect(isClock("24:00")).toBe(false);
    expect(isClock("19:60")).toBe(false);
    expect(isClock("1930")).toBe(false);
    expect(isClock("")).toBe(false);
  });
});
