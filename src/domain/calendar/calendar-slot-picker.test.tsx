// @vitest-environment jsdom
import { act } from "react";

import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { defaultMessages } from "../../messages/default-messages.js";
import type { CalendarSlotPickerProps } from "../../types/domain/calendar/calendar-slot-picker-props.js";
import type { CalendarSlot } from "../../types/domain/calendar/calendar-slot.js";

import { CalendarSlotPicker } from "./calendar-slot-picker.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const messages = defaultMessages.calendar.slotPicker;

const SLOTS: CalendarSlot[] = [
  { id: "slot_a", startsAt: "2026-11-20T14:00:00Z" },
  { id: "slot_b", startsAt: "2026-11-21T16:30:00Z" },
  { id: "slot_c", startsAt: "não é data" },
];

let host: HTMLDivElement;
let root: Root;

const render = (props: Partial<CalendarSlotPickerProps> = {}) => {
  act(() =>
    root.render(<CalendarSlotPicker slots={SLOTS} value={null} onChange={() => {}} {...props} />),
  );
  return host;
};

const text = () => document.body.textContent ?? "";

const radios = () => [...document.body.querySelectorAll<HTMLButtonElement>('[role="radio"]')];

const press = (element: HTMLButtonElement | undefined, key: string) => {
  act(() => {
    element?.focus();
    element?.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true }));
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

describe("seletor de horário do mentor", () => {
  it("desenha um rádio por horário, com o rótulo no fuso de quem lê", () => {
    render();

    expect(radios()).toHaveLength(3);
    // O inválido aparece cru: esconderia um horário que o mentor publicou.
    expect(text()).toContain("não é data");
  });

  it("marca a escolha com aria-checked e o resto fica solto", () => {
    render({ value: "slot_b" });

    expect(radios()[1].getAttribute("aria-checked")).toBe("true");
    expect(radios()[0].getAttribute("aria-checked")).toBe("false");
    expect(radios()[1].getAttribute("tabindex")).toBe("0");
    expect(radios()[0].getAttribute("tabindex")).toBe("-1");
  });

  it("clicar escolhe; clicar de novo no escolhido desfaz", () => {
    const onChange = vi.fn();
    render({ onChange });

    act(() => radios()[0].dispatchEvent(new MouseEvent("click", { bubbles: true })));
    expect(onChange).toHaveBeenLastCalledWith("slot_a");

    render({ value: "slot_a", onChange });
    act(() => radios()[0].dispatchEvent(new MouseEvent("click", { bubbles: true })));
    expect(onChange).toHaveBeenLastCalledWith(null);
  });

  it("as setas reportam o vizinho e o foco acompanha", () => {
    const onChange = vi.fn();
    render({ value: "slot_a", onChange });

    press(radios()[0], "ArrowDown");
    expect(onChange).toHaveBeenLastCalledWith("slot_b");
    expect(document.activeElement).toBe(radios()[1]);

    press(radios()[1], "ArrowUp");
    expect(onChange).toHaveBeenLastCalledWith("slot_a");
  });

  it("o erro de reserva aparece dentro do grupo e o escolhido fica marcado", () => {
    render({ value: "slot_a", error: "Reserva recusada" });

    expect(text()).toContain("Reserva recusada");
    expect(document.body.querySelector('[role="alert"]')).toBeTruthy();
    expect(radios()[0].getAttribute("aria-checked")).toBe("true");
  });

  it("reservando, os horários ficam desabilitados e o erro sai", () => {
    render({ value: "slot_a", error: "Reserva recusada", disabled: true });

    expect(radios().every((radio) => radio.disabled)).toBe(true);
    expect(text()).not.toContain("Reserva recusada");
  });
});
