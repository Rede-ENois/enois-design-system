// @vitest-environment jsdom
import { act } from "react";

import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { defaultMessages } from "../../messages/default-messages.js";
import type { CalendarInterviewDialogProps } from "../../types/domain/calendar/calendar-interview-dialog-props.js";

import { CalendarInterviewDialog } from "./calendar-interview-dialog.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const messages = defaultMessages.calendar.interviewDialog;
const ZONE = "America/Sao_Paulo";

let host: HTMLDivElement;
let root: Root;

const render = (props: Partial<CalendarInterviewDialogProps> = {}) => {
  act(() =>
    root.render(
      <CalendarInterviewDialog
        open
        onOpenChange={() => {}}
        timeZoneId={ZONE}
        onSave={() => {}}
        {...props}
      />,
    ),
  );
  return host;
};

const text = () => document.body.textContent ?? "";

const button = (label: string) =>
  [...document.body.querySelectorAll<HTMLButtonElement>("button")].find(
    (element) => element.textContent?.trim() === label,
  );

const click = (element: Element | undefined) => {
  act(() => element?.dispatchEvent(new MouseEvent("click", { bubbles: true })));
};

const input = (id: string) => document.body.querySelector<HTMLInputElement>(`#${id}`);

/** The three fields are the only text inputs; the day is first, then the two clocks. */
const fields = () => [...document.body.querySelectorAll<HTMLInputElement>("input")];

const type = (element: HTMLInputElement | null, value: string) => {
  if (!element) throw new Error("input not found");
  act(() => {
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
    setter?.call(element, value);
    element.dispatchEvent(new Event("input", { bubbles: true }));
  });
};

beforeEach(() => {
  host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
});

afterEach(() => {
  act(() => root.unmount());
  host.remove();
});

describe("diálogo de entrevista", () => {
  it("abre com dia e horários preenchidos e o botão habilitado", () => {
    render();

    expect(text()).toContain(messages.createTitle);
    expect(text()).toContain(messages.zoneHint(ZONE));
    expect(button(messages.save)?.disabled).toBe(false);
  });

  it("reagendar abre preenchido com a entrevista atual", () => {
    render({
      interview: {
        id: "jint_1",
        startsAt: "2027-03-10T17:00:00Z",
        endsAt: "2027-03-10T18:00:00Z",
        timeZoneId: ZONE,
        notes: "Leve seu portfólio.",
      },
      candidateName: "Ana",
    });

    expect(text()).toContain(messages.editTitle("Ana"));
    expect(text()).toContain("Leve seu portfólio.");
    // 17:00Z is 14:00 in São Paulo.
    expect(fields().map((field) => field.value)).toContain("14:00");
  });

  it("fim antes do começo é recusado e não chama onSave", () => {
    const onSave = vi.fn();
    render({ onSave });

    const [, start, end] = fields();
    type(start, "15:00");
    type(end, "14:00");
    click(button(messages.save));

    expect(text()).toContain(messages.endBeforeStart);
    expect(onSave).not.toHaveBeenCalled();
  });

  it("duração acima de 8 horas é recusada", () => {
    const onSave = vi.fn();
    render({ onSave });

    const [, start, end] = fields();
    type(start, "08:00");
    type(end, "17:00");
    click(button(messages.save));

    expect(text()).toContain(messages.durationTooLong);
    expect(onSave).not.toHaveBeenCalled();
  });

  it("salvar reporta os instantes no fuso da entrevista", () => {
    const onSave = vi.fn();
    render({ onSave });

    const [day, start, end] = fields();
    type(day, "10/03/2027");
    type(start, "14:00");
    type(end, "15:00");
    click(button(messages.save));

    expect(onSave).toHaveBeenCalledTimes(1);
    const values = onSave.mock.calls[0][0];
    expect(values.timeZoneId).toBe(ZONE);
    // 14:00 in São Paulo is 17:00Z.
    expect(values.startsAt).toBe("2027-03-10T17:00:00.000Z");
    expect(values.endsAt).toBe("2027-03-10T18:00:00.000Z");
    expect(values.notes).toBeNull();
  });

  it("observações vazias viram null e o erro do servidor aparece", () => {
    const onSave = vi.fn();
    render({ onSave, saveError: "A entrevista precisa ser marcada para o futuro." });

    expect(text()).toContain("A entrevista precisa ser marcada para o futuro.");

    const [day, start, end] = fields();
    type(day, "10/03/2027");
    type(start, "14:00");
    type(end, "15:00");
    click(button(messages.save));

    expect(onSave.mock.calls[0][0].notes).toBeNull();
  });

  it("enquanto salva, o botão fica desabilitado e mostra o progresso", () => {
    render({ savePending: true });

    expect(text()).toContain(messages.saving);
    expect(button(messages.saving)?.disabled).toBe(true);
  });
});
