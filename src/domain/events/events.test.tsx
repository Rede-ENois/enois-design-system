// @vitest-environment jsdom
import { act } from "react";

import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { EventCardData } from "../../types/domain/events/event-card-data.js";

import { EventCard } from "./event-card.js";
import { EventRecurrenceControl } from "./event-recurrence-control.js";
import { EventRecurrenceField } from "./event-recurrence-field.js";
import { EventRitualsFilter } from "./event-rituals-filter.js";
import { formatDayMonth } from "./recurrence.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const container = document.createElement("div");
document.body.append(container);
const root = createRoot(container);

afterEach(() => act(() => root.render(null)));

const event: EventCardData = {
  id: "e1",
  title: "Show and tell",
  date: "2026-11-06",
  format: "ONLINE",
  host: "Comunidade Énóis",
  attendees: 12,
  cover: null,
  streamUrl: null,
  location: null,
  expired: false,
  attending: false,
  recurrence: "WEEKLY",
  nextOccurrenceDate: "2026-11-13",
};

function renderCard(data: Partial<EventCardData>, highlighted?: boolean) {
  act(() =>
    root.render(
      <EventCard
        event={{ ...event, ...data }}
        dateTimeLabel="6 nov · 19:00"
        attendancePending={false}
        onAttend={() => {}}
        onCancelAttend={() => {}}
        highlighted={highlighted}
      />,
    ),
  );
  return container.querySelector("article")!;
}

function select(element: HTMLSelectElement, value: string) {
  act(() => {
    element.value = value;
    element.dispatchEvent(new Event("change", { bubbles: true }));
  });
}

describe("formatDayMonth", () => {
  it("reads the calendar date as text, without shifting the day", () => {
    expect(formatDayMonth("2026-11-01")).toBe("01/11");
    expect(formatDayMonth("")).toBe("");
  });
});

describe("EventCard", () => {
  it("shows the cadence and the next date of a series", () => {
    const card = renderCard({});
    expect(card.textContent).toContain("Toda semana");
    expect(card.textContent).toContain("Próximo: 13/11");
  });

  it("hides the series line for one-off events and older payloads", () => {
    expect(renderCard({ recurrence: "NONE" }).textContent).not.toContain("Próximo");
    expect(
      renderCard({ recurrence: undefined, nextOccurrenceDate: undefined }).textContent,
    ).not.toContain("Toda semana");
  });

  it("shows the cadence without a next date when the series has none", () => {
    const text = renderCard({ recurrence: "MONTHLY", nextOccurrenceDate: null }).textContent;
    expect(text).toContain("Todo mês");
    expect(text).not.toContain("Próximo");
  });

  it("marks the highlighted card", () => {
    expect(renderCard({}, true).dataset.highlighted).toBe("true");
    expect(renderCard({}).dataset.highlighted).toBeUndefined();
  });

  it("drops unsafe stream links", () => {
    expect(renderCard({ streamUrl: "javascript:alert(1)" }).querySelector("a")).toBeNull();
  });
});

describe("EventRecurrenceField", () => {
  it("emits the picked recurrence and links the hint and the error", () => {
    const onChange = vi.fn();
    act(() =>
      root.render(
        <EventRecurrenceField value="NONE" onChange={onChange} error="Informe o horário." />,
      ),
    );
    const field = container.querySelector("select")!;
    select(field, "BIWEEKLY");
    expect(onChange).toHaveBeenCalledWith("BIWEEKLY");
    expect(field.getAttribute("aria-invalid")).toBe("true");
    expect(container.textContent).toContain("precisam de horário");
    expect(container.querySelector('[role="alert"]')!.textContent).toBe("Informe o horário.");
  });
});

describe("EventRecurrenceControl", () => {
  it("stops the series with NONE", () => {
    const onChange = vi.fn();
    act(() =>
      root.render(<EventRecurrenceControl value="WEEKLY" onChange={onChange} pending={false} />),
    );
    const stop = [...container.querySelectorAll("button")].find(
      (b) => b.textContent === "Parar a série",
    )!;
    act(() => stop.click());
    expect(onChange).toHaveBeenCalledWith("NONE");
    expect(container.textContent).toContain("continuam na lista");
  });

  it("changes the cadence and locks while saving", () => {
    const onChange = vi.fn();
    act(() =>
      root.render(<EventRecurrenceControl value="WEEKLY" onChange={onChange} pending={false} />),
    );
    select(container.querySelector("select")!, "MONTHLY");
    expect(onChange).toHaveBeenCalledWith("MONTHLY");

    act(() =>
      root.render(
        <EventRecurrenceControl
          value="WEEKLY"
          onChange={onChange}
          pending
          error="Não deu certo."
        />,
      ),
    );
    expect(container.querySelector("select")!.disabled).toBe(true);
    expect(container.querySelector("button")!.disabled).toBe(true);
    expect(container.querySelector('[aria-live="polite"]')!.textContent).toBe("Salvando...");
    expect(container.querySelector('[role="alert"]')!.textContent).toBe("Não deu certo.");
  });

  it("has no stop button when the event does not repeat", () => {
    act(() =>
      root.render(<EventRecurrenceControl value="NONE" onChange={() => {}} pending={false} />),
    );
    expect(container.querySelector("button")).toBeNull();
  });
});

describe("EventRitualsFilter", () => {
  it("toggles between all events and rituals", () => {
    const onChange = vi.fn();
    act(() => root.render(<EventRitualsFilter value={false} onChange={onChange} />));
    const [all, rituals] = container.querySelectorAll("button");
    expect(all!.getAttribute("aria-pressed")).toBe("true");
    act(() => rituals!.click());
    expect(onChange).toHaveBeenCalledWith(true);
  });
});
