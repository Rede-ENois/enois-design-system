// @vitest-environment jsdom
import { act } from "react";

import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import type { CalendarAgendaItemData } from "../../types/domain/calendar/calendar-agenda-item-data.js";
import type { CalendarEntryKind } from "../../types/domain/calendar/calendar-entry-kind.js";
import type { CalendarMonthCellLayout } from "../../types/domain/calendar/calendar-month-cell-layout.js";

import { CalendarMonthView } from "./calendar-month-view.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let host: HTMLDivElement;
let root: Root;

beforeEach(() => {
  host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
});

afterEach(() => {
  act(() => root.render(null));
  host.remove();
});

const TIME_ZONE = "America/Sao_Paulo";

function entry(
  id: string,
  title: string,
  startsAt: string,
  kind: CalendarEntryKind = "MEETING",
): CalendarAgendaItemData {
  const endsAt = new Date(Date.parse(startsAt) + 60 * 60 * 1000).toISOString();
  return {
    entry: {
      id,
      scope: "PROFESSIONAL",
      kind,
      title,
      description: null,
      startsAt,
      endsAt,
      timeZoneId: TIME_ZONE,
      allDay: false,
      cancelledAt: null,
    },
    owner: true,
    participation: null,
  };
}

function render(items: CalendarAgendaItemData[], cellLayout?: CalendarMonthCellLayout) {
  act(() =>
    root.render(
      <CalendarMonthView
        month="2026-11"
        items={items}
        timeZoneId={TIME_ZONE}
        today="2026-11-08"
        itemHref={(id) => `/agenda/${id}`}
        cellLayout={cellLayout}
      />,
    ),
  );
}

const dayCell = (day: string) => host.querySelector<HTMLElement>(`[data-day="${day}"]`);

describe("CalendarMonthView entries", () => {
  it("numbers the entries of a day in order, three days apart from a day without any", () => {
    // The day 23 holds one entry and the day 25 another: each first in its own day, as reported.
    render(
      [
        entry("cal_1", "Retrospectiva", "2026-11-23T13:00:00Z"),
        entry("cal_2", "Planejamento", "2026-11-25T13:00:00Z"),
      ],
      "points",
    );

    expect(dayCell("2026-11-23")?.textContent).toBe("231");
    expect(dayCell("2026-11-25")?.textContent).toBe("251");
  });

  it("numbers the entries of the same day without repeating a number across days", () => {
    render(
      [
        entry("cal_1", "Reunião", "2026-11-24T13:00:00Z"),
        entry("cal_2", "Almoço", "2026-11-24T16:00:00Z", "PERSONAL"),
      ],
      "points",
    );

    expect(dayCell("2026-11-24")?.textContent).toBe("2412");
  });

  it("keeps the title out of the cell of the phone layout and in its spoken name", () => {
    render([entry("cal_1", "Retrospectiva do trimestre", "2026-11-23T13:00:00Z")], "points");

    const cell = dayCell("2026-11-23");
    expect(cell?.textContent).not.toContain("Retrospectiva");

    const link = cell?.querySelector("a");
    expect(link?.textContent).toBe("1");
    expect(link?.getAttribute("aria-label")).toBe("Compromisso 1: Retrospectiva do trimestre");
    expect(link?.getAttribute("href")).toBe("/agenda/cal_1");
    expect(link?.getAttribute("title")).toBe("Retrospectiva do trimestre");
  });

  it("brings the title back, with a dot that stands out from the card", () => {
    render([entry("cal_1", "Retrospectiva do trimestre", "2026-11-23T13:00:00Z")], "titles");

    const cell = dayCell("2026-11-23");
    expect(cell?.textContent).toContain("Retrospectiva do trimestre");

    const dot = cell?.querySelector("li > a > span[aria-hidden]");
    expect(dot?.className).toMatch(/bg-primary|bg-text-subtle/);
    expect(dot?.className).not.toMatch(/bg-primary-soft|bg-surface-3/);
  });
});
