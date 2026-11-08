// @vitest-environment jsdom
import { act } from "react";

import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

import { MAX_TITLE } from "../../lib/calendar/calendar-entry-draft.js";
import { defaultMessages } from "../../messages/default-messages.js";
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
});
