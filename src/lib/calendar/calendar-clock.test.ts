import { describe, expect, it } from "vitest";

import { instantOf, wallClockOf } from "./calendar-clock.js";

const SAO_PAULO = "America/Sao_Paulo";
const NEW_YORK = "America/New_York";
const LISBON = "Europe/Lisbon";

describe("wallClockOf", () => {
  it("reads the day and the time in the zone, not in the machine's zone", () => {
    // 2026-11-08T22:30Z is 19:30 in São Paulo and still the 8th; in Lisbon it is 22:30, also the 8th.
    expect(wallClockOf("2026-11-08T22:30:00Z", SAO_PAULO)).toEqual({
      day: "2026-11-08",
      time: "19:30",
    });
    expect(wallClockOf("2026-11-08T22:30:00Z", LISBON)).toEqual({
      day: "2026-11-08",
      time: "22:30",
    });
  });

  it("crosses the day when the zone is behind UTC", () => {
    // 01:00Z on the 9th is 22:00 on the 8th in São Paulo.
    expect(wallClockOf("2026-11-09T01:00:00Z", SAO_PAULO)).toEqual({
      day: "2026-11-08",
      time: "22:00",
    });
  });

  it("shows 00:00 as 00:00 instead of 24:00", () => {
    // Midnight in São Paulo is 03:00Z.
    expect(wallClockOf("2026-11-09T03:00:00Z", SAO_PAULO)).toEqual({
      day: "2026-11-09",
      time: "00:00",
    });
  });

  it("returns an empty clock for an unparseable instant instead of a wrong time", () => {
    expect(wallClockOf("not a date", SAO_PAULO)).toEqual({ day: "", time: "" });
  });
});

describe("instantOf", () => {
  it("turns a day and a time in the zone into the instant on the wire", () => {
    expect(instantOf("2026-11-08", "19:30", SAO_PAULO)).toBe("2026-11-08T22:30:00.000Z");
    expect(instantOf("2026-11-08", "22:30", LISBON)).toBe("2026-11-08T22:30:00.000Z");
  });

  it("round-trips every wall clock it is given", () => {
    const cases = [
      ["2026-03-01", "00:00", SAO_PAULO],
      ["2026-12-31", "23:59", SAO_PAULO],
      ["2026-11-01", "01:30", NEW_YORK],
      ["2026-10-25", "02:30", LISBON],
      ["2026-03-29", "02:30", LISBON],
    ] as const;

    for (const [day, time, zone] of cases) {
      const instant = instantOf(day, time, zone);
      // The days these zones skip an hour are excluded on purpose and covered by their own test;
      // every clock that exists must come back exactly as it went in.
      const expected = time;
      expect(wallClockOf(instant, zone), `${day} ${time} ${zone}`).toEqual({
        day,
        time: expected,
      });
    }
  });

  it("keeps the date of the organizer when the zone is ahead of UTC", () => {
    // 00:30 in Lisbon on the 9th is 00:30Z on the 9th, not the 8th.
    expect(instantOf("2026-01-09", "00:30", LISBON)).toBe("2026-01-09T00:30:00.000Z");
  });

  it("lands on a valid hour inside the summer-time gap, in either hemisphere's calendar", () => {
    // New York jumps 01:59 to 03:00 on 2026-03-08; 02:30 does not exist that day.
    expect(wallClockOf(instantOf("2026-03-08", "02:30", NEW_YORK), NEW_YORK)).toEqual({
      day: "2026-03-08",
      time: "03:30",
    });
    // Lisbon jumps 00:59 to 02:00 on 2026-03-29; 01:30 does not exist that day.
    expect(wallClockOf(instantOf("2026-03-29", "01:30", LISBON), LISBON)).toEqual({
      day: "2026-03-29",
      time: "02:30",
    });
  });

  it("picks the earlier instant when the zone repeats an hour", () => {
    // New York repeats 01:00 to 01:59 on 2026-11-01; the earlier reading is the daylight-time one.
    expect(instantOf("2026-11-01", "01:30", NEW_YORK)).toBe("2026-11-01T05:30:00.000Z");
    // Lisbon repeats 01:00 to 01:59 on 2026-10-25.
    expect(instantOf("2026-10-25", "01:30", LISBON)).toBe("2026-10-25T00:30:00.000Z");
  });

  it("returns an empty string instead of an invalid instant", () => {
    expect(instantOf("", "19:30", SAO_PAULO)).toBe("");
    expect(instantOf("2026-02-31", "19:30", SAO_PAULO)).toBe("");
    expect(instantOf("2026-11-08", "24:00", SAO_PAULO)).toBe("");
    expect(instantOf("2026-11-08", "7:5", SAO_PAULO)).toBe("");
    expect(instantOf("2026-11-08", "19:30", "Mars/Olympus")).toBe("");
  });
});
