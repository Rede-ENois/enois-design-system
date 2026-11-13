// @vitest-environment jsdom
import { act } from "react";

import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

import { MAX_TITLE } from "../../lib/calendar/calendar-entry-draft.js";
import { defaultMessages } from "../../messages/default-messages.js";
import type { CalendarAgendaItemData } from "../../types/domain/calendar/calendar-agenda-item-data.js";
import type { CalendarEntryData } from "../../types/domain/calendar/calendar-entry-data.js";
import type { CalendarEntryFormValues } from "../../types/domain/calendar/calendar-entry-form-values.js";

import { CalendarEntryFormDialog } from "./calendar-entry-form-dialog.js";

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

const form = defaultMessages.calendar.form;
const SP = "America/Sao_Paulo";

let host: HTMLDivElement;
let root: Root;
let saved: CalendarEntryFormValues[];

const openDialog = (props: Partial<Parameters<typeof CalendarEntryFormDialog>[0]> = {}) => {
  act(() => {
    root.render(
      <CalendarEntryFormDialog
        open
        onOpenChange={() => {}}
        timeZoneId={SP}
        onSave={(values) => saved.push(values)}
        {...props}
      />,
    );
  });
};

const field = (suffix: "title" | "description" | "day" | "allDay" | "start" | "end") =>
  document.body.querySelector(`[id$="-${suffix}"]`) as HTMLInputElement | HTMLTextAreaElement;

const switchField = () => document.body.querySelector('[id$="-allDay"]') as HTMLButtonElement;

const recurrenceField = () =>
  document.body.querySelector('[id$="-recurrence"]') as HTMLSelectElement | null;

const choose = (element: HTMLSelectElement, value: string) =>
  act(() => {
    const setter = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, "value")?.set;
    setter?.call(element, value);
    element.dispatchEvent(new Event("change", { bubbles: true }));
  });

const type = (element: HTMLInputElement | HTMLTextAreaElement, text: string) => {
  act(() => {
    const setter = Object.getOwnPropertyDescriptor(
      element instanceof HTMLTextAreaElement
        ? HTMLTextAreaElement.prototype
        : HTMLInputElement.prototype,
      "value",
    )?.set;
    setter?.call(element, text);
    element.dispatchEvent(new Event("input", { bubbles: true }));
  });
};

const click = (element: Element) =>
  act(() => element.dispatchEvent(new MouseEvent("click", { bubbles: true })));

const submit = () => {
  const formEl = document.body.querySelector("form");
  act(() => formEl?.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })));
};

const conflicts = () =>
  [...document.body.querySelectorAll("[role=status]")].map((node) => node.textContent);

const statuses = () =>
  [...document.body.querySelectorAll("[role=status]")].filter((node) =>
    node.textContent?.includes("compromisso"),
  );

const item = (overrides: Partial<CalendarEntryData> = {}): CalendarAgendaItemData => ({
  owner: true,
  participation: null,
  entry: {
    id: "cal_other",
    scope: "SOCIAL",
    kind: "PERSONAL",
    title: "Reunião",
    description: null,
    startsAt: "2026-11-10T15:00:00.000Z",
    endsAt: "2026-11-10T16:00:00.000Z",
    timeZoneId: SP,
    allDay: false,
    cancelledAt: null,
    ...overrides,
  },
});

const alerts = () =>
  [...document.body.querySelectorAll("[role=alert]")].map((node) => node.textContent);

const saveButton = () =>
  [...document.body.querySelectorAll("button")].find((button) =>
    button.textContent?.includes(form.save),
  );

beforeEach(() => {
  host = document.createElement("div");
  document.body.appendChild(host);
  root = createRoot(host);
  saved = [];
});

afterEach(() => {
  act(() => root.unmount());
  host.remove();
});

describe("CalendarEntryFormDialog", () => {
  it("starts a new entry with a usable draft and saves the wire shape", () => {
    openDialog({ defaultDay: "2026-11-10" });

    type(field("title"), "Almoço com a equipe");
    type(field("day"), "10/11/2026");
    type(field("start"), "12:00");
    type(field("end"), "13:30");
    submit();

    expect(saved).toHaveLength(1);
    expect(saved[0]).toMatchObject({
      scope: "SOCIAL",
      kind: "PERSONAL",
      title: "Almoço com a equipe",
      description: null,
      startsAt: "2026-11-10T15:00:00.000Z",
      endsAt: "2026-11-10T16:30:00.000Z",
      timeZoneId: SP,
      allDay: false,
    });
  });

  it("blocks the save for an empty title, even full of spaces", () => {
    openDialog({ defaultDay: "2026-11-10" });

    type(field("title"), "   ");
    type(field("day"), "10/11/2026");
    submit();

    expect(saved).toHaveLength(0);
    expect(alerts()).toContain(form.titleProblem(MAX_TITLE));
    expect(saveButton()?.hasAttribute("disabled")).toBe(true);
  });

  it("rejects a day that does not exist instead of rolling it forward", () => {
    openDialog({ defaultDay: "2026-11-10" });

    type(field("title"), "Dia impossível");
    type(field("day"), "31/02/2027");
    submit();

    expect(saved).toHaveLength(0);
    expect(alerts()).toContain(form.invalidDay);
  });

  it("keeps a half-typed date in the field without erasing the digits", () => {
    openDialog({ defaultDay: "2026-11-10" });

    type(field("title"), "Data pela metade");
    type(field("day"), "15/0");
    expect((field("day") as HTMLInputElement).value).toBe("15/0");
    submit();

    expect(saved).toHaveLength(0);
    expect(alerts()).toContain(form.invalidDay);
  });

  it("blocks the save until the reader tries, then reports the first problem once", () => {
    openDialog({ defaultDay: "2026-11-10" });

    // Nothing typed yet: no error on screen, but the button is already off.
    expect(alerts()).toHaveLength(0);
    expect(saveButton()?.hasAttribute("disabled")).toBe(true);

    type(field("title"), "Título preenchido");
    type(field("day"), "32/13/2026");
    submit();

    const texts = alerts();
    expect(texts).toHaveLength(1);
    expect(texts[0]).toBe(form.invalidDay);
  });

  it("reports the end before the start, not a clock format mistake", () => {
    openDialog({ defaultDay: "2026-11-10" });

    type(field("title"), "Reunião");
    type(field("day"), "10/11/2026");
    type(field("start"), "15:00");
    type(field("end"), "14:00");
    submit();

    expect(saved).toHaveLength(0);
    expect(alerts()).toContain(form.endBeforeStart);
  });

  it("drops the clock fields and saves a whole-day entry", () => {
    openDialog({ defaultDay: "2026-11-10" });

    type(field("title"), "Dia todo");
    type(field("day"), "10/11/2026");
    click(switchField());
    submit();

    expect(saved).toHaveLength(1);
    expect(saved[0]).toMatchObject({
      title: "Dia todo",
      allDay: true,
      startsAt: "2026-11-10T03:00:00.000Z",
      endsAt: "2026-11-11T03:00:00.000Z",
    });
    // The clock fields are out of the form, so no end-before-start can come back from them.
    expect(document.body.querySelector('[id$="-start"]')).toBeNull();
  });

  it("opens an entry to edit filled in with the entry's own zone", () => {
    const entry: CalendarEntryData = {
      id: "e1",
      scope: "PROFESSIONAL",
      kind: "INTERVIEW",
      title: "Entrevista técnica",
      description: "Com o time de produto",
      startsAt: "2026-11-12T18:00:00.000Z",
      endsAt: "2026-11-12T19:00:00.000Z",
      timeZoneId: SP,
      allDay: false,
      cancelledAt: null,
    };
    openDialog({ entry });

    expect(document.body.textContent).toContain(form.editTitle);
    expect((field("title") as HTMLInputElement).value).toBe("Entrevista técnica");
    expect((field("day") as HTMLInputElement).value).toBe("12/11/2026");
    expect((field("start") as HTMLInputElement).value).toBe("15:00");

    type(field("title"), "Entrevista técnica (remota)");
    submit();

    expect(saved).toHaveLength(1);
    expect(saved[0]).toMatchObject({
      scope: "PROFESSIONAL",
      kind: "INTERVIEW",
      title: "Entrevista técnica (remota)",
      startsAt: "2026-11-12T18:00:00.000Z",
    });
  });

  it("shows the server error under the title and keeps the reader's fields", () => {
    openDialog({ defaultDay: "2026-11-10", saveError: "Não foi possível salvar." });

    type(field("title"), "Vai sobreviver ao erro");
    type(field("day"), "10/11/2026");

    expect(alerts()).toContain("Não foi possível salvar.");
    expect((field("title") as HTMLInputElement).value).toBe("Vai sobreviver ao erro");
  });

  it("moves the day along when the next full hour is already tomorrow", () => {
    // 23h30 in São Paulo. Keeping today's date with a 00:00 start would open an entry that has
    // already passed, and an end of 00:00 would read as before the start.
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-11-10T02:30:00.000Z"));
    try {
      openDialog();

      expect((field("day") as HTMLInputElement).value).toBe("10/11/2026");
      expect((field("start") as HTMLInputElement).value).toBe("00:00");
      expect((field("end") as HTMLInputElement).value).toBe("01:00");

      type(field("title"), "Depois da meia-noite");
      submit();

      expect(saved).toHaveLength(1);
      expect(saved[0]).toMatchObject({
        startsAt: "2026-11-10T03:00:00.000Z",
        endsAt: "2026-11-10T04:00:00.000Z",
      });
    } finally {
      vi.useRealTimers();
    }
  });

  it("keeps the end inside the day when the hour after the start is tomorrow", () => {
    // 22h in São Paulo: the start is today at 23h and the hour after it is tomorrow's 00h, which
    // the clock fields cannot express. The end stops at the last minute instead of reading as
    // before the start.
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-11-10T01:00:00.000Z"));
    try {
      openDialog();

      expect((field("day") as HTMLInputElement).value).toBe("09/11/2026");
      expect((field("start") as HTMLInputElement).value).toBe("23:00");
      expect((field("end") as HTMLInputElement).value).toBe("23:59");
    } finally {
      vi.useRealTimers();
    }
  });

  it("warns once about an entry the typed interval touches", () => {
    openDialog({ defaultDay: "2026-11-10", conflicts: [item()] });

    type(field("title"), "Sobreposto");
    type(field("day"), "10/11/2026");
    type(field("start"), "12:00");
    type(field("end"), "13:30");

    expect(statuses()).toHaveLength(1);
    expect(statuses()[0].textContent).toBe(form.conflictWarning(1));
  });

  it("says nothing when the other entry ends exactly when this one starts", () => {
    openDialog({
      defaultDay: "2026-11-10",
      // Ends 13:00 local, and the draft starts at 13:00: touching edges do not clash.
      conflicts: [
        item({ startsAt: "2026-11-10T15:00:00.000Z", endsAt: "2026-11-10T16:00:00.000Z" }),
      ],
    });

    type(field("title"), "Encostado");
    type(field("start"), "13:00");
    type(field("end"), "14:00");

    expect(statuses()).toHaveLength(0);
  });

  it("counts every clash and keeps the save enabled", () => {
    openDialog({
      defaultDay: "2026-11-10",
      conflicts: [
        item({ id: "cal_a" }),
        item({
          id: "cal_b",
          startsAt: "2026-11-10T16:30:00.000Z",
          endsAt: "2026-11-10T17:30:00.000Z",
        }),
      ],
    });

    type(field("title"), "Dois choques");
    type(field("start"), "12:00");
    type(field("end"), "14:30");

    expect(statuses()).toHaveLength(1);
    expect(statuses()[0].textContent).toBe(form.conflictWarning(2));
    expect(saveButton()?.disabled).toBe(false);
  });

  it("never warns about the entry being edited against itself", () => {
    const editing = item({ id: "cal_self" });
    openDialog({
      entry: editing.entry,
      defaultDay: "2026-11-10",
      conflicts: [editing],
    });

    expect(statuses()).toHaveLength(0);
  });

  it("ignores a cancelled entry in the list", () => {
    openDialog({
      defaultDay: "2026-11-10",
      conflicts: [item({ cancelledAt: "2026-11-09T12:00:00.000Z" })],
    });

    type(field("title"), "Cancelado");
    type(field("start"), "12:00");
    type(field("end"), "13:00");

    expect(statuses()).toHaveLength(0);
  });

  it("covers the whole day for an all-day draft", () => {
    openDialog({
      defaultDay: "2026-11-10",
      conflicts: [
        item({ startsAt: "2026-11-10T23:00:00.000Z", endsAt: "2026-11-10T23:30:00.000Z" }),
      ],
    });

    type(field("title"), "Dia inteiro");
    click(switchField());
    type(field("day"), "10/11/2026");

    expect(statuses()).toHaveLength(1);
  });

  it("opens a new entry as a one-off and reports the chosen cadence", () => {
    openDialog({ defaultDay: "2026-11-10" });

    const select = recurrenceField();
    expect(select?.value).toBe("NONE");

    choose(select as HTMLSelectElement, "WEEKLY");
    type(field("title"), "Reunião semanal");
    type(field("day"), "10/11/2026");
    type(field("start"), "12:00");
    type(field("end"), "13:00");
    submit();

    expect(saved).toHaveLength(1);
    expect(saved[0].recurrence).toBe("WEEKLY");
  });

  it("keeps the daily cadence out of the options", () => {
    openDialog({ defaultDay: "2026-11-10" });

    const values = [...(recurrenceField() as HTMLSelectElement).options].map(
      (option) => option.value,
    );
    expect(values).toEqual(["NONE", "WEEKLY", "BIWEEKLY", "MONTHLY"]);
  });

  it("shows the cadence of an entry already in a series", () => {
    openDialog({ entry: item({ recurrence: "MONTHLY" }).entry, defaultDay: "2026-11-10" });

    expect((recurrenceField() as HTMLSelectElement).value).toBe("MONTHLY");
  });

  it("hides the cadence for an entry another module owns", () => {
    // Starting a series is refused with 409 for a sourced entry: the module that owns the fact is
    // the one that repeats it. Offering the choice here would be a button that always fails.
    openDialog({ entry: item({ sourceType: "MENTORING" }).entry, defaultDay: "2026-11-10" });

    expect(recurrenceField()).toBeNull();
  });

  it("does not warn before the draft has a usable interval", () => {
    // Anchored to a fixed day: without `defaultDay` the opening draft starts at the next full hour
    // from the real clock, and between 11:00 and 11:59 in São Paulo that instant lands inside the
    // fixture's 12:00–13:00 entry, warning on open. The clock is not what this test fixes.
    openDialog({ defaultDay: "2026-11-10", conflicts: [item()] });

    expect(statuses()).toHaveLength(0);

    type(field("title"), "Sem horário");
    type(field("start"), "99:99");

    expect(statuses()).toHaveLength(0);
  });
});
