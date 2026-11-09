// @vitest-environment jsdom
import { act, createRef, useEffect, useState } from "react";

import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { defaultMessages } from "../messages/default-messages.js";
import type { TimeTextInputProps } from "../types/components/ui/time-text-input-props.js";

import { TimeTextInput } from "./time-text-input.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let host: HTMLDivElement;
let root: Root;

const visible = () => host.querySelector<HTMLInputElement>('input[type="text"]')!;
const hidden = () => host.querySelector<HTMLInputElement>('input[type="hidden"]');

function type(value: string) {
  act(() => {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!.call(
      visible(),
      value,
    );
    visible().dispatchEvent(new Event("input", { bubbles: true }));
  });
}

const render = (props: Partial<TimeTextInputProps> = {}) =>
  act(() => root.render(<TimeTextInput {...props} />));

beforeEach(() => {
  host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
});

afterEach(() => {
  act(() => root.unmount());
  host.remove();
});

describe("TimeTextInput", () => {
  it("masks the digits into a clock as the reader types", () => {
    render();
    type("1930");

    expect(visible().value).toBe("19:30");
  });

  it("opens the numeric keypad and starts from the clock it was given", () => {
    render({ defaultValue: "09:05" });

    expect(visible().value).toBe("09:05");
    expect(visible().getAttribute("inputmode")).toBe("numeric");
    expect(visible().getAttribute("placeholder")).toBe(defaultMessages.timeTextInput.placeholder);
  });

  it("reports a complete clock and the partial text while typing", () => {
    const onValueChange = vi.fn();
    render({ onValueChange });

    type("1");
    expect(onValueChange).toHaveBeenLastCalledWith("1");

    type("19:3");
    expect(onValueChange).toHaveBeenLastCalledWith("19:3");

    type("1930");
    expect(onValueChange).toHaveBeenLastCalledWith("19:30");
  });

  it("flags an incomplete clock as invalid and clears the flag once it is complete", () => {
    render();
    type("19:3");

    expect(visible().validationMessage).toBe(defaultMessages.timeTextInput.invalid);

    type("1930");
    expect(visible().validationMessage).toBe("");
  });

  it("mirrors a value changed outside the field", () => {
    function Controlled({ value }: { value: string }) {
      const [clock, setClock] = useState(value);
      useEffect(() => setClock(value), [value]);
      return <TimeTextInput value={clock} onValueChange={setClock} />;
    }

    act(() => root.render(<Controlled value="08:00" />));
    expect(visible().value).toBe("08:00");

    act(() => root.render(<Controlled value="21:45" />));
    expect(visible().value).toBe("21:45");
  });

  it("carries the clock to the form data only when it is complete", () => {
    render({ name: "startsAt" });
    type("19:3");
    expect(hidden()?.value).toBe("");

    type("1930");
    expect(hidden()?.value).toBe("19:30");
  });

  it("forwards the ref to the visible input", () => {
    const ref = createRef<HTMLInputElement>();
    render({ ref });

    expect(ref.current).toBe(visible());
  });
});
