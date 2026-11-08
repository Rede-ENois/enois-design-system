// @vitest-environment jsdom
import { act } from "react";

import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";

import { periodOfToday, periodWindow, stepPeriod } from "../../lib/calendar/calendar-period.js";
import type { CalendarAgendaItemData } from "../../types/domain/calendar/calendar-agenda-item-data.js";
import type { CalendarAgendaProps } from "../../types/domain/calendar/calendar-agenda-props.js";

import { CalendarAgenda } from "./calendar-agenda.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const container = document.createElement("div");
document.body.append(container);
const root = createRoot(container);

afterEach(() => act(() => root.render(null)));

const TODAY = "2026-11-08";

const meeting: CalendarAgendaItemData = {
  entry: {
    id: "cal_1",
    scope: "PROFESSIONAL",
    kind: "MEETING",
    title: "Revisão do trimestre",
    description: null,
    startsAt: "2026-11-10T13:00:00Z",
    endsAt: "2026-11-10T14:00:00Z",
    timeZoneId: "America/Sao_Paulo",
    allDay: false,
    cancelledAt: null,
  },
  owner: true,
  participation: null,
};

const invitation: CalendarAgendaItemData = {
  entry: {
    id: "cal_2",
    scope: "SOCIAL",
    kind: "EVENT",
    title: "Jantar da turma",
    description: null,
    startsAt: "2026-11-10T22:00:00Z",
    endsAt: "2026-11-10T23:30:00Z",
    timeZoneId: "America/Sao_Paulo",
    allDay: false,
    cancelledAt: null,
  },
  owner: false,
  participation: "INVITED",
};

function render(props: Partial<CalendarAgendaProps> = {}) {
  act(() =>
    root.render(
      <CalendarAgenda
        view="month"
        onViewChange={() => {}}
        period="2026-11"
        onPeriodChange={() => {}}
        items={[meeting, invitation]}
        timeZoneId="America/Sao_Paulo"
        today={TODAY}
        {...props}
      />,
    ),
  );
  return container;
}

describe("calendar periods", () => {
  it("steps by a month, a week or a day depending on the view", () => {
    expect(stepPeriod("month", "2026-11", 1)).toBe("2026-12");
    expect(stepPeriod("month", "2026-12", 1)).toBe("2027-01");
    expect(stepPeriod("week", "2026-11-11", -1)).toBe("2026-11-04");
    expect(stepPeriod("day", "2026-11-11", 1)).toBe("2026-11-12");
    expect(stepPeriod("list", "2026-11-11", 1)).toBe("2026-11-18");
  });

  it("goes back to the period that holds today", () => {
    expect(periodOfToday("month", TODAY)).toBe("2026-11");
    expect(periodOfToday("week", TODAY)).toBe(TODAY);
  });

  it("gives the API window per view, half-open", () => {
    // The month grid borrows the neighbour days it draws, so the window covers the whole grid.
    expect(periodWindow("month", "2026-11")).toEqual({ from: "2026-11-01", to: "2026-12-06" });
    expect(periodWindow("day", "2026-11-08")).toEqual({ from: "2026-11-08", to: "2026-11-09" });
    expect(periodWindow("week", "2026-11-11")).toEqual({
      from: "2026-11-08",
      to: "2026-11-15",
    });
  });
});

describe("CalendarAgenda", () => {
  it("draws the month, the today mark and the entries of the day", () => {
    const view = render();

    expect(view.querySelectorAll("[data-today]")).toHaveLength(1);
    expect(view.textContent).toContain("Revisão do trimestre");
    expect(view.textContent).toContain("Jantar da turma");
  });

  it("reports the picked day and the changed view without owning them", () => {
    const onSelectDay = vi.fn();
    const onViewChange = vi.fn();
    const view = render({ onSelectDay, onViewChange });

    const dayButton = view.querySelector('button[aria-label="2026-11-10"]');
    act(() => (dayButton as HTMLButtonElement).click());
    expect(onSelectDay).toHaveBeenCalledWith("2026-11-10");

    const weekTab = [...view.querySelectorAll('[role="radio"]')].find(
      (element) => element.textContent === "Semana",
    );
    act(() => (weekTab as HTMLButtonElement).click());
    expect(onViewChange).toHaveBeenCalledWith("week");
  });

  it("moves the period with the arrows and back to today", () => {
    const onPeriodChange = vi.fn();
    const view = render({ onPeriodChange, period: "2026-11" });

    const back = view.querySelector('button[aria-label="Mês anterior"]');
    act(() => (back as HTMLButtonElement).click());
    expect(onPeriodChange).toHaveBeenLastCalledWith("2026-10");

    const forward = view.querySelector('button[aria-label="Próximo mês"]');
    act(() => (forward as HTMLButtonElement).click());
    expect(onPeriodChange).toHaveBeenLastCalledWith("2026-12");

    const today = [...view.querySelectorAll("button")].find(
      (element) => element.textContent === "Hoje",
    );
    act(() => (today as HTMLButtonElement).click());
    expect(onPeriodChange).toHaveBeenLastCalledWith("2026-11");
  });

  it("shows the invitation with its quick answers in the day view", () => {
    const onRespond = vi.fn();
    const view = render({ view: "day", period: "2026-11-10", onRespond });

    expect(view.textContent).toContain("Jantar da turma");
    expect(view.textContent).toContain("Convite");

    const accept = [...view.querySelectorAll("button")].find((element) =>
      element.textContent?.includes("Aceitar"),
    );
    act(() => (accept as HTMLButtonElement).click());
    expect(onRespond).toHaveBeenCalledWith("cal_2", "ACCEPTED");
  });

  it("disables the answer buttons of the entry being answered", () => {
    const view = render({
      view: "day",
      period: "2026-11-10",
      onRespond: () => {},
      respondingId: "cal_2",
    });

    const accept = [...view.querySelectorAll("button")].find((element) =>
      element.textContent?.includes("Aceitar"),
    );
    expect((accept as HTMLButtonElement).disabled).toBe(true);
  });

  it("shows an explicit empty state instead of a blank grid", () => {
    const view = render({ items: [], view: "list", period: "2026-11-01" });
    expect(view.textContent).toContain("Nada na agenda deste período");
  });

  it("shows the load error with a retry the app owns", () => {
    const onRetry = vi.fn();
    const view = render({ error: true, onRetry });

    expect(view.textContent).toContain("Não foi possível carregar a agenda.");
    const retry = [...view.querySelectorAll("button")].find(
      (element) => element.textContent === "Tentar de novo",
    );
    act(() => (retry as HTMLButtonElement).click());
    expect(onRetry).toHaveBeenCalled();
  });

  it("marks a cancelled entry instead of hiding it", () => {
    const cancelled: CalendarAgendaItemData = {
      ...meeting,
      entry: {
        ...meeting.entry,
        id: "cal_3",
        title: "Encontro cancelado",
        cancelledAt: "2026-11-09T00:00:00Z",
      },
    };
    const view = render({ items: [cancelled], view: "list", period: "2026-11-01" });

    expect(view.textContent).toContain("Encontro cancelado");
    expect(view.textContent).toContain("Cancelado");
  });
});
