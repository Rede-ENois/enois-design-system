// @vitest-environment jsdom
import { act } from "react";

import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

import { defaultMessages } from "../../messages/default-messages.js";
import type { CalendarAgendaItemData } from "../../types/domain/calendar/calendar-agenda-item-data.js";
import type { CalendarAgendaSurfaceProps } from "../../types/domain/calendar/calendar-agenda-surface-props.js";
import type { CalendarEntryData } from "../../types/domain/calendar/calendar-entry-data.js";
import type { CalendarEntryFormValues } from "../../types/domain/calendar/calendar-entry-form-values.js";

import { CalendarAgendaSurface } from "./calendar-agenda-surface.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

// The switch and the dialog position themselves with radix, which asks for a ResizeObserver.
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

beforeAll(() => {
  globalThis.ResizeObserver ??= ResizeObserverStub as unknown as typeof ResizeObserver;
});

const messages = defaultMessages.calendar;
const form = messages.form;
const SP = "America/Sao_Paulo";
const TODAY = "2026-11-08";

const meeting: CalendarEntryData = {
  id: "cal_1",
  scope: "PROFESSIONAL",
  kind: "MEETING",
  title: "Revisão do trimestre",
  description: null,
  startsAt: "2026-11-10T13:00:00Z",
  endsAt: "2026-11-10T14:00:00Z",
  timeZoneId: SP,
  allDay: false,
  cancelledAt: null,
};

const item: CalendarAgendaItemData = { entry: meeting, owner: true, participation: null };

let host: HTMLDivElement;
let root: Root;
let saved: { values: CalendarEntryFormValues; entry: CalendarEntryData | null }[];
let answer: boolean;

const render = (props: Partial<CalendarAgendaSurfaceProps> = {}) => {
  act(() =>
    root.render(
      <CalendarAgendaSurface
        view="month"
        onViewChange={() => {}}
        period="2026-11"
        onPeriodChange={() => {}}
        items={[item]}
        timeZoneId={SP}
        today={TODAY}
        onSave={async (values, entry) => {
          saved.push({ values, entry });
          return answer;
        }}
        {...props}
      />,
    ),
  );
  return host;
};

const button = (label: string) =>
  [...document.body.querySelectorAll("button")].find(
    (element) => element.textContent?.trim() === label,
  ) as HTMLButtonElement | undefined;

const field = (suffix: "title" | "day" | "start" | "end") =>
  document.body.querySelector(`[id$="-${suffix}"]`) as HTMLInputElement;

const type = (element: HTMLInputElement, text: string) => {
  act(() => {
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
    setter?.call(element, text);
    element.dispatchEvent(new Event("input", { bubbles: true }));
  });
};

const click = (element: Element | undefined) => {
  act(() => element?.dispatchEvent(new MouseEvent("click", { bubbles: true })));
};

const pill = (label: string) =>
  [...document.body.querySelectorAll('[role="group"] button')].find(
    (element) => element.textContent?.trim() === label,
  );

const save = () => {
  click(button(form.save));
  // The dialog closes after the app answers, so the promise has to settle inside act.
  return act(async () => {});
};

const dialogOpen = () => document.body.querySelector('[role="dialog"]') !== null;

const alerts = () =>
  [...document.body.querySelectorAll("[role=alert]")].map((node) => node.textContent);

beforeEach(() => {
  host = document.createElement("div");
  document.body.appendChild(host);
  root = createRoot(host);
  saved = [];
  answer = true;
});

afterEach(() => {
  act(() => root.unmount());
  host.remove();
});

describe("CalendarAgendaSurface", () => {
  it("opens the form from the header button closed, and closes it once the save goes through", async () => {
    const view = render();
    expect(dialogOpen()).toBe(false);

    click(button(messages.newEntry));
    expect(dialogOpen()).toBe(true);

    type(field("title"), "Café com a Ana");
    await save();

    expect(saved).toHaveLength(1);
    // The surface opened it on the period on screen, not on "today": the month view shows month
    // days, and a blank entry landing on the first of the month reads as a wrong date.
    expect(saved[0].values.startsAt).toBe("2026-11-08T12:00:00.000Z");
    expect(saved[0].entry).toBeNull();
    expect(saved[0].values).toMatchObject({ title: "Café com a Ana", scope: "SOCIAL" });
    expect(dialogOpen()).toBe(false);
  });

  it("keeps the typed fields and the server error when the save is refused", async () => {
    answer = false;
    render({ saveError: "Não foi possível salvar agora." });

    click(button(messages.newEntry));
    type(field("title"), "Aula de violão");
    await save();

    expect(saved).toHaveLength(1);
    expect(dialogOpen()).toBe(true);
    expect(field("title").value).toBe("Aula de violão");
    expect(alerts()).toContain("Não foi possível salvar agora.");
  });

  it("starts a blank entry on the picked day, not on the first of the month", () => {
    render({ selectedDay: "2026-11-17" });

    click(button(messages.newEntry));

    expect(field("day").value).toBe("17/11/2026");
  });

  it("uses the agenda the surface was told to open, and the reader can still switch it", async () => {
    render({ newEntryScope: "PROFESSIONAL" });

    click(button(messages.newEntry));
    expect(pill(messages.scopes.PROFESSIONAL)?.getAttribute("aria-pressed")).toBe("true");

    type(field("title"), "One-on-one");
    click(pill(messages.scopes.SOCIAL));
    await save();

    expect(saved).toHaveLength(1);
    expect(saved[0].values.scope).toBe("SOCIAL");
  });

  it("opens an entry for editing filled in with its own fields and reports it on save", async () => {
    // The app owns which entry is being edited: it has to clear it on the way out, or the surface
    // would open the same entry again on the next render.
    let editing: CalendarEntryData | null = meeting;
    const view = () => (
      <CalendarAgendaSurface
        view="month"
        onViewChange={() => {}}
        period="2026-11"
        onPeriodChange={() => {}}
        items={[item]}
        timeZoneId={SP}
        today={TODAY}
        editingEntry={editing}
        onEditingChange={(entry) => {
          editing = entry;
          act(() => root.render(view()));
        }}
        onSave={async (values, entry) => {
          saved.push({ values, entry });
          return answer;
        }}
      />
    );
    act(() => root.render(view()));

    expect(dialogOpen()).toBe(true);
    expect(field("title").value).toBe("Revisão do trimestre");
    expect(field("day").value).toBe("10/11/2026");

    await save();

    expect(saved[0].entry).toEqual(meeting);
    expect(saved[0].values).toMatchObject({ title: "Revisão do trimestre", scope: "PROFESSIONAL" });
    expect(editing).toBeNull();
    expect(dialogOpen()).toBe(false);
  });

  it("draws the pending invitations above the agenda and answers them through the same callback", () => {
    const answered: { entryId: string; answer: string }[] = [];
    render({
      pendingInvitations: [
        {
          id: "cal_convite",
          scope: "PROFESSIONAL",
          kind: "INTERVIEW",
          title: "Entrevista na Aurora",
          startsAt: "2026-11-14T13:00:00Z",
          endsAt: "2026-11-14T14:00:00Z",
          allDay: false,
          timeZoneId: SP,
        },
      ],
      onRespond: (entryId, answer) => answered.push({ entryId, answer }),
    });

    expect(document.body.textContent).toContain(messages.pendingInvitations.title);
    expect(document.body.textContent).toContain("Entrevista na Aurora");

    click(button(messages.accept));

    expect(answered).toEqual([{ entryId: "cal_convite", answer: "ACCEPTED" }]);
  });

  it("clears the entry the app asked to edit when the reader opens a new one", () => {
    let editing: CalendarEntryData | null = meeting;
    const view = () => (
      <CalendarAgendaSurface
        view="month"
        onViewChange={() => {}}
        period="2026-11"
        onPeriodChange={() => {}}
        items={[item]}
        timeZoneId={SP}
        today={TODAY}
        editingEntry={editing}
        onEditingChange={(entry) => {
          editing = entry;
          act(() => root.render(view()));
        }}
        onSave={async () => true}
      />
    );
    act(() => root.render(view()));

    click(button(messages.newEntry));

    expect(editing).toBeNull();
    expect((field("title") as HTMLInputElement | null)?.value ?? "").toBe("");
  });
});
