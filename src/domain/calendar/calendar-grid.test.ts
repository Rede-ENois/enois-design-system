import { describe, expect, it } from "vitest";

import {
  addMonths,
  dayOfMonth,
  monthEnd,
  shiftDay,
  timeLabel,
  todayIn,
  weekdayOf,
} from "../../lib/calendar/calendar-dates.js";
import {
  entryDay,
  groupByDay,
  monthGrid,
  monthWindow,
  weekOf,
} from "../../lib/calendar/calendar-grid.js";
import type { CalendarAgendaItemData } from "../../types/domain/calendar/calendar-agenda-item-data.js";

const item = (id: string, startsAt: string, endsAt = startsAt): CalendarAgendaItemData => ({
  entry: {
    id,
    scope: "SOCIAL",
    kind: "PERSONAL",
    title: id,
    description: null,
    startsAt,
    endsAt,
    timeZoneId: "America/Sao_Paulo",
    allDay: false,
    cancelledAt: null,
  },
  owner: true,
  participation: null,
});

describe("calendar dates", () => {
  it("steps months across the year and back", () => {
    expect(addMonths({ year: 2026, month: 12 }, 1)).toEqual({ year: 2027, month: 1 });
    expect(addMonths({ year: 2026, month: 1 }, -1)).toEqual({ year: 2025, month: 12 });
    expect(addMonths({ year: 2026, month: 11 }, -14)).toEqual({ year: 2025, month: 9 });
  });

  it("finds the last day of February in a leap and a common year", () => {
    expect(monthEnd({ year: 2028, month: 2 })).toBe("2028-02-29");
    expect(monthEnd({ year: 2026, month: 2 })).toBe("2026-02-28");
    expect(monthEnd({ year: 2026, month: 12 })).toBe("2026-12-31");
  });

  it("today comes from the zone, not from UTC", () => {
    // 02:30 UTC on the 9th is still the 8th in São Paulo (UTC-3).
    const instant = new Date("2026-11-09T02:30:00Z");
    expect(todayIn("America/Sao_Paulo", instant)).toBe("2026-11-08");
    expect(todayIn("UTC", instant)).toBe("2026-11-09");
  });

  it("formats the time in the reading zone", () => {
    expect(timeLabel("2026-11-09T02:30:00Z", "America/Sao_Paulo")).toBe("23:30");
    expect(timeLabel("2026-11-09T02:30:00Z", "UTC")).toBe("02:30");
    expect(timeLabel("not a date", "UTC")).toBe("");
  });

  it("moves days and reads weekdays", () => {
    expect(shiftDay("2026-11-08", 1)).toBe("2026-11-09");
    expect(shiftDay("2026-03-01", -1)).toBe("2026-02-28");
    expect(weekdayOf("2026-11-08")).toBe(0);
    expect(dayOfMonth("2026-11-08")).toBe("8");
    expect(() => shiftDay("08/11/2026", 1)).toThrow(/YYYY-MM-DD/);
  });
});

describe("month grid", () => {
  it("borrows whole weeks and marks the days that belong to the month", () => {
    const cells = monthGrid("2026-11", [], "America/Sao_Paulo");
    expect(cells.length % 7).toBe(0);
    expect(cells[0].date).toBe("2026-11-01");
    expect(cells[0].weekday).toBe(0);
    expect(cells.every((cell) => cell.inMonth === cell.date.startsWith("2026-11"))).toBe(true);
    expect(cells[0].dayOfMonth).toBe("1");
  });

  it("starts the first row before the month when the 1st is not a Sunday", () => {
    // 2026-10-01 is a Thursday.
    const cells = monthGrid("2026-10", [], "America/Sao_Paulo");
    expect(cells[0].date).toBe("2026-09-27");
    expect(cells[4].date).toBe("2026-10-01");
    expect(cells.length).toBe(35);
  });

  it("places each entry on its day and points out the borrowed days", () => {
    // 2026-11-01 is a Sunday, so the grid borrows days at the end, not at the start.
    const entries = [
      item("outubro", "2026-10-31T15:00:00Z"),
      item("novembro", "2026-11-01T15:00:00Z"),
      item("dezembro", "2026-12-02T15:00:00Z"),
    ];
    const cells = monthGrid("2026-11", entries, "America/Sao_Paulo");
    const inside = cells.find((cell) => cell.date === "2026-11-01");
    const borrowed = cells.find((cell) => cell.date === "2026-12-02");
    expect(inside?.items.map((entry) => entry.entry.id)).toEqual(["novembro"]);
    expect(borrowed?.inMonth).toBe(false);
    expect(borrowed?.items.map((entry) => entry.entry.id)).toEqual(["dezembro"]);
    expect(cells.some((cell) => cell.date === "2026-10-31")).toBe(false);
  });

  it("places a late instant on the reader's day, not on the UTC day", () => {
    // 02:30 UTC on the 9th is 23:30 on the 8th in São Paulo.
    expect(entryDay("2026-11-09T02:30:00Z", "America/Sao_Paulo")).toBe("2026-11-08");
    expect(entryDay("2026-11-09T02:30:00Z", "UTC")).toBe("2026-11-09");
  });

  it("returns the week that holds the day, Sunday first", () => {
    expect(weekOf("2026-11-11")).toEqual([
      "2026-11-08",
      "2026-11-09",
      "2026-11-10",
      "2026-11-11",
      "2026-11-12",
      "2026-11-13",
      "2026-11-14",
    ]);
  });

  it("gives the API window the full grid the reader sees, half-open at the end", () => {
    // November 2026 starts on a Sunday and October 2026 on a Thursday.
    expect(monthWindow("2026-11")).toEqual({ from: "2026-11-01", to: "2026-12-06" });
    expect(monthWindow("2026-10")).toEqual({ from: "2026-09-27", to: "2026-11-01" });
  });
});

describe("grouping", () => {
  it("orders the days ascending and the entries by start inside each day", () => {
    const entries = [
      item("tarde", "2026-11-09T17:00:00Z"),
      item("outro dia", "2026-11-10T12:00:00Z"),
      item("manha", "2026-11-09T11:00:00Z"),
    ];
    const groups = groupByDay(entries, "America/Sao_Paulo");
    expect(groups.map((group) => group.date)).toEqual(["2026-11-09", "2026-11-10"]);
    expect(groups[0].items.map((entry) => entry.entry.id)).toEqual(["manha", "tarde"]);
  });

  it("drops an entry whose start cannot be read instead of guessing a day", () => {
    const groups = groupByDay([item("quebrado", "amanha")], "UTC");
    expect(groups).toEqual([]);
  });
});
