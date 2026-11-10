// @vitest-environment jsdom
import { act } from "react";

import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { defaultMessages } from "../../messages/default-messages.js";
import type { CalendarReminderMinutes } from "../../types/domain/calendar/calendar-reminder-minutes.js";
import type { CalendarReminderSelectorProps } from "../../types/domain/calendar/calendar-reminder-selector-props.js";

import { CalendarReminderSelector } from "./calendar-reminder-selector.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const messages = defaultMessages.calendar.reminder;

let host: HTMLDivElement;
let root: Root;

const render = (props: Partial<CalendarReminderSelectorProps> = {}) => {
  act(() => root.render(<CalendarReminderSelector value={null} onChange={() => {}} {...props} />));
  return host;
};

const text = () => document.body.textContent ?? "";

const radios = () => [...document.body.querySelectorAll<HTMLButtonElement>('[role="radio"]')];

const option = (label: string) =>
  radios().find((element) => element.textContent?.trim().includes(label));

const click = (element: Element | undefined) => {
  act(() => element?.dispatchEvent(new MouseEvent("click", { bubbles: true })));
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

describe("seletor de lembrete", () => {
  it("oferece «não avisar» mais as cinco antecedências do servidor", () => {
    render();

    expect(text()).toContain(messages.title);
    expect(radios()).toHaveLength(6);
    expect(radios()[0].textContent).toContain(messages.none);
    for (const minutes of [5, 15, 30, 60, 1440] as CalendarReminderMinutes[]) {
      expect(option(messages.minutes(minutes))).toBeTruthy();
    }
  });

  it("1440 minutos aparece como «1 dia antes», não como número", () => {
    render();

    expect(text()).toContain("1 dia antes");
    expect(text()).not.toContain("1440");
  });

  it("marca só a opção escolhida", () => {
    render({ value: 30 });

    const checked = radios().filter((element) => element.getAttribute("aria-checked") === "true");
    expect(checked).toHaveLength(1);
    expect(checked[0].textContent).toContain(messages.minutes(30));
  });

  it("sem lembrete, «não avisar» é a opção marcada", () => {
    render({ value: null });

    const checked = radios().filter((element) => element.getAttribute("aria-checked") === "true");
    expect(checked).toHaveLength(1);
    expect(checked[0].textContent).toContain(messages.none);
  });

  it("escolher avisa o app com os minutos; escolher «não avisar» avisa com null", () => {
    const onChange = vi.fn();
    render({ value: 5, onChange });

    click(option(messages.minutes(60)));
    expect(onChange).toHaveBeenLastCalledWith(60);

    click(option(messages.none));
    expect(onChange).toHaveBeenLastCalledWith(null);
  });

  it("enquanto salva, todas as opções ficam desabilitadas e diz que está salvando", () => {
    render({ value: 30, saving: true });

    expect(radios().every((element) => element.disabled)).toBe(true);
    expect(text()).toContain(messages.saving);
  });

  it("erro do servidor aparece como alerta e não inventa escolha nova", () => {
    render({ value: 30, error: "Compromisso cancelado não aceita lembrete." });

    const alert = document.body.querySelector('[role="alert"]');
    expect(alert?.textContent).toContain("cancelado");
    const checked = radios().filter((element) => element.getAttribute("aria-checked") === "true");
    expect(checked[0].textContent).toContain(messages.minutes(30));
  });

  it("o grupo tem nome acessível e declara o estado de salvamento", () => {
    render({ saving: true });

    const group = document.body.querySelector('[role="radiogroup"]');
    expect(group?.getAttribute("aria-label")).toBe(messages.title);
    expect(group?.getAttribute("aria-busy")).toBe("true");
  });
});
