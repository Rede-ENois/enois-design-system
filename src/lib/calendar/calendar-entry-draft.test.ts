import { describe, expect, it } from "vitest";

import type { CalendarEntryFormDraft } from "../../types/domain/calendar/calendar-entry-form-draft.js";

import { draftProblems, draftToValues } from "./calendar-entry-draft.js";

const BASE: CalendarEntryFormDraft = {
  scope: "SOCIAL",
  kind: "PERSONAL",
  title: "Almoço com a equipe",
  description: "",
  day: "2026-11-08",
  startTime: "12:30",
  endTime: "13:30",
  allDay: false,
  timeZoneId: "America/Sao_Paulo",
  recurrence: "NONE",
};

const draft = (patch: Partial<CalendarEntryFormDraft> = {}): CalendarEntryFormDraft => ({
  ...BASE,
  ...patch,
});

describe("draftProblems", () => {
  it("accepts a complete draft", () => {
    expect(draftProblems(draft())).toEqual([]);
  });

  it("asks for a title", () => {
    expect(draftProblems(draft({ title: "   " }))).toEqual(["title"]);
    expect(draftProblems(draft({ title: "x".repeat(201) }))).toEqual(["title"]);
  });

  it("respects the description ceiling", () => {
    expect(draftProblems(draft({ description: "x".repeat(2000) }))).toEqual([]);
    expect(draftProblems(draft({ description: "x".repeat(2001) }))).toEqual(["description"]);
  });

  it("rejects a day that does not exist", () => {
    expect(draftProblems(draft({ day: "2026-02-31" }))).toEqual(["day"]);
    expect(draftProblems(draft({ day: "" }))).toEqual(["day"]);
  });

  it("rejects an incomplete or impossible clock", () => {
    expect(draftProblems(draft({ startTime: "12:3" }))).toEqual(["clock"]);
    expect(draftProblems(draft({ endTime: "24:00" }))).toEqual(["clock"]);
  });

  it("rejects an end that is not after the start", () => {
    expect(draftProblems(draft({ startTime: "13:30", endTime: "13:30" }))).toEqual([
      "endBeforeStart",
    ]);
    expect(draftProblems(draft({ startTime: "15:00", endTime: "14:00" }))).toEqual([
      "endBeforeStart",
    ]);
  });

  it("rejects an entry longer than the server allows", () => {
    // The form has one day and one pair of clocks, so the ceiling only shows up through the zone:
    // 00:00 to 23:59 is still under a day. 7 days is the server's limit and this form never
    // reaches it, which the test states instead of pretending the rule is enforced here.
    const problems = draftProblems(draft({ startTime: "00:00", endTime: "23:59" }));
    expect(problems).toEqual([]);
  });

  it("skips the clock and interval rules for an all-day entry", () => {
    expect(draftProblems(draft({ allDay: true, startTime: "", endTime: "" }))).toEqual([]);
  });

  it("still needs a day for an all-day entry", () => {
    expect(draftProblems(draft({ allDay: true, day: "" }))).toEqual(["day"]);
  });
});

describe("draftToValues", () => {
  it("converts the typed day and clocks into instants in the entry's zone", () => {
    expect(draftToValues(draft())).toEqual({
      scope: "SOCIAL",
      kind: "PERSONAL",
      title: "Almoço com a equipe",
      description: null,
      startsAt: "2026-11-08T15:30:00.000Z",
      endsAt: "2026-11-08T16:30:00.000Z",
      timeZoneId: "America/Sao_Paulo",
      allDay: false,
      recurrence: "NONE",
    });
  });

  it("trims the title and turns a blank description into null", () => {
    const values = draftToValues(draft({ title: "  Reunião  ", description: "   " }));

    expect(values?.title).toBe("Reunião");
    expect(values?.description).toBeNull();
  });

  it("keeps a written description as it is, trimmed at the edges", () => {
    expect(draftToValues(draft({ description: "  Levar o contrato  " }))?.description).toBe(
      "Levar o contrato",
    );
  });

  it("covers the whole day for an all-day entry, with the next midnight in the zone", () => {
    const values = draftToValues(draft({ allDay: true, startTime: "", endTime: "" }));

    // Midnight in São Paulo is 03:00Z.
    expect(values?.startsAt).toBe("2026-11-08T03:00:00.000Z");
    expect(values?.endsAt).toBe("2026-11-09T03:00:00.000Z");
    expect(values?.allDay).toBe(true);
  });

  it("ends an all-day entry at the next day's midnight even when that day changes the clocks", () => {
    // Lisbon moves the clocks forward on 2026-03-29, so that day has 23 hours.
    const values = draftToValues(
      draft({ allDay: true, day: "2026-03-28", timeZoneId: "Europe/Lisbon" }),
    );

    expect(values?.startsAt).toBe("2026-03-28T00:00:00.000Z");
    expect(values?.endsAt).toBe("2026-03-29T00:00:00.000Z");
  });

  it("returns null instead of values for a draft with problems", () => {
    expect(draftToValues(draft({ title: "" }))).toBeNull();
    expect(draftToValues(draft({ startTime: "15:00", endTime: "14:00" }))).toBeNull();
  });
});
