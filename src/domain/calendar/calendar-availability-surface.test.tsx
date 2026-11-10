// @vitest-environment jsdom
import { act } from "react";

import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

import { defaultMessages } from "../../messages/default-messages.js";
import type { CalendarAvailabilitySurfaceProps } from "../../types/domain/calendar/calendar-availability-surface-props.js";

import { CalendarAvailabilitySurface } from "./calendar-availability-surface.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

beforeAll(() => {
  globalThis.ResizeObserver ??= ResizeObserverStub as unknown as typeof ResizeObserver;
});

const messages = defaultMessages.calendar.availability;
const SP = "America/Sao_Paulo";

const week = [
  { id: "ava_1", dayOfWeek: 1, startsAt: "09:00", endsAt: "12:00", timezone: SP },
  { id: "ava_2", dayOfWeek: 3, startsAt: "14:00", endsAt: "18:00", timezone: SP },
];

let host: HTMLDivElement;
let root: Root;
let saved: { windows: unknown[]; resolve: boolean }[];
let serverWeek: {
  id: string;
  dayOfWeek: number;
  startsAt: string;
  endsAt: string;
  timezone: string;
}[];

const render = (props: Partial<CalendarAvailabilitySurfaceProps> = {}) => {
  act(() =>
    root.render(
      <CalendarAvailabilitySurface
        windows={serverWeek}
        timeZoneId={SP}
        onSave={async (windows) => {
          saved.push({ windows, resolve: true });
          return true;
        }}
        {...props}
      />,
    ),
  );
  return host;
};

const button = (label: string) =>
  [...document.body.querySelectorAll("button")].find(
    (element) =>
      element.getAttribute("aria-label")?.includes(label) || element.textContent?.trim() === label,
  ) as HTMLButtonElement | undefined;

const clockField = (suffix: string) =>
  [...document.body.querySelectorAll("input")].find((element) => element.id?.endsWith(suffix)) as
    HTMLInputElement | undefined;

const type = (element: HTMLInputElement, text: string) => {
  act(() => {
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
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

beforeEach(() => {
  host = document.body.appendChild(document.createElement("div"));
  root = createRoot(host);
  saved = [];
  serverWeek = week.map((window) => ({ ...window }));
});

afterEach(() => {
  act(() => root.unmount());
  host.remove();
  vi.restoreAllMocks();
});

describe("CalendarAvailabilitySurface", () => {
  it("desenha a semana do servidor como linhas editáveis", () => {
    render();

    expect(document.body.querySelectorAll("li").length).toBe(2);
    expect(document.body.textContent).toContain(messages.dayLabel(1));
    expect(document.body.textContent).toContain(messages.dayLabel(3));
  });

  it("salva a semana no formato da API", () => {
    render();
    submit();

    expect(saved).toHaveLength(1);
    expect(saved[0].windows).toEqual([
      { dayOfWeek: 1, startsAt: "09:00", endsAt: "12:00", timezone: SP },
      { dayOfWeek: 3, startsAt: "14:00", endsAt: "18:00", timezone: SP },
    ]);
  });

  it("adicionar uma janela nova nasce em branco e entra no salvamento", () => {
    // A janela nova nasce na segunda: a base da semana não pode ter segunda, senão o salvar é
    // bloqueado por sobreposição — o que é o comportamento certo, testado mais abaixo.
    serverWeek = [{ id: "ava_1", dayOfWeek: 2, startsAt: "14:00", endsAt: "18:00", timezone: SP }];
    render();
    click(button(messages.addWindow)!);
    submit();

    expect(saved[0].windows).toHaveLength(2);
    expect(saved[0].windows[1]).toEqual({
      dayOfWeek: 1,
      startsAt: "09:00",
      endsAt: "12:00",
      timezone: SP,
    });
  });

  it("remover uma janela a tira do salvamento", () => {
    render();
    const remove = document.body.querySelector(
      '[aria-label^="' + messages.removeWindow("").slice(0, 8) + '"]',
    );
    click(remove!);
    submit();

    expect(saved[0].windows).toHaveLength(1);
    expect(saved[0].windows[0]).toMatchObject({ dayOfWeek: 3 });
  });

  it("semana nova vinda do app substitui o rascunho", () => {
    render();
    click(button(messages.addWindow)!);
    expect(document.body.querySelectorAll("li").length).toBe(3);

    serverWeek = [{ id: "ava_9", dayOfWeek: 5, startsAt: "08:00", endsAt: "09:00", timezone: SP }];
    render();

    expect(document.body.querySelectorAll("li").length).toBe(1);
    expect(document.body.textContent).toContain(messages.dayLabel(5));
  });

  it("salvar recusado mantém o que a pessoa digitou", () => {
    serverWeek = [{ id: "ava_1", dayOfWeek: 2, startsAt: "14:00", endsAt: "18:00", timezone: SP }];
    render({
      onSave: async () => false,
    });
    const start = clockField("-window-0-start")!;
    type(start, "08:00");
    submit();

    expect(saved).toHaveLength(0);
    expect(clockField("-window-0-start")!.value).toBe("08:00");
  });

  it("mudar o começo para depois do fim bloqueia o salvar e mostra o problema", () => {
    render();
    const start = clockField("-window-0-start")!;
    type(start, "13:00");
    submit();

    expect(alerts()).toContain(messages.endBeforeStartProblem);
    expect(
      [...document.body.querySelectorAll("button")].find((element) =>
        element.textContent?.includes(messages.save),
      ),
    ).toHaveProperty("disabled", true);
  });

  it("janelas encostadas no mesmo dia não são sobreposição", () => {
    serverWeek = [{ id: "ava_1", dayOfWeek: 1, startsAt: "09:00", endsAt: "10:00", timezone: SP }];
    render();
    click(button(messages.addWindow)!);
    const start = clockField("-window-1-start")!;
    const end = clockField("-window-1-end")!;
    type(start, "10:00");
    type(end, "12:00");
    submit();

    expect(alerts()).not.toContain(messages.overlapsProblem);
    expect(saved).toHaveLength(1);
  });

  it("sobreposição no mesmo dia bloqueia o salvar", () => {
    serverWeek = [{ id: "ava_1", dayOfWeek: 1, startsAt: "09:00", endsAt: "12:00", timezone: SP }];
    render();
    click(button(messages.addWindow)!);
    const start = clockField("-window-1-start")!;
    type(start, "11:00");
    submit();

    expect(alerts()).toContain(messages.overlapsProblem);
    expect(saved).toHaveLength(0);
  });

  it("problemas só aparecem depois da primeira tentativa de salvar", () => {
    render();
    const start = clockField("-window-0-start")!;
    type(start, "13:00");

    expect(alerts()).toHaveLength(0);
  });

  it("saveError do servidor aparece sem limpar o digitado", () => {
    render({ saveError: "Não foi possível salvar a disponibilidade." });
    expect(alerts()).toContain("Não foi possível salvar a disponibilidade.");
  });

  it("savePending troca o rótulo do botão", () => {
    render({ savePending: true });

    expect(
      [...document.body.querySelectorAll("button")].find((element) =>
        element.textContent?.includes(messages.saving),
      ),
    ).toBeDefined();
  });
});
