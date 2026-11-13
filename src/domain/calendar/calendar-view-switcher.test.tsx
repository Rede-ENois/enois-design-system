// @vitest-environment jsdom
import { act } from "react";

import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { CalendarView } from "../../types/domain/calendar/calendar-view.js";

import { CalendarViewSwitcher } from "./calendar-view-switcher.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let host: HTMLDivElement;
let root: Root;

const render = (value: CalendarView, onChange = vi.fn()) => {
  act(() => root.render(<CalendarViewSwitcher value={value} onChange={onChange} />));
  return onChange;
};

const radios = () => [...document.body.querySelectorAll<HTMLButtonElement>('[role="radio"]')];

const press = (element: HTMLButtonElement | null, key: string) => {
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

describe("CalendarViewSwitcher", () => {
  it("has a single tab stop, on the checked view", () => {
    render("week");

    const stops = radios().filter((radio) => radio.tabIndex === 0);
    expect(stops).toHaveLength(1);
    expect(stops[0].textContent).toBe("Semana");
  });

  it("moves the selection and the focus together on arrows", () => {
    const onChange = render("month");
    const [month, week] = radios();

    press(month, "ArrowRight");

    expect(onChange).toHaveBeenCalledWith("week");
    expect(document.activeElement).toBe(week);
  });

  it("wraps around at both ends", () => {
    const backwards = render("month");
    press(radios()[0], "ArrowLeft");
    expect(backwards).toHaveBeenLastCalledWith("list");

    const forwards = render("list");
    press(radios()[3], "ArrowRight");
    expect(forwards).toHaveBeenLastCalledWith("month");
  });

  it("jumps to the first and last view with Home and End", () => {
    const onChange = render("day");
    const [, , day] = radios();

    press(day, "End");
    expect(onChange).toHaveBeenLastCalledWith("list");

    press(day, "Home");
    expect(onChange).toHaveBeenLastCalledWith("month");
  });

  it("leaves other keys to the page", () => {
    const onChange = render("month");

    press(radios()[0], "Tab");
    press(radios()[0], "Enter");

    expect(onChange).not.toHaveBeenCalled();
  });
});
