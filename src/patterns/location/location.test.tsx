// @vitest-environment jsdom
import { act } from "react";

import { createRoot } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";

import { BRAZIL_STATES } from "./brazil-states.js";
import { CityStateField } from "./city-state-field.js";
import { formatLocation, validateCityState } from "./city-state.js";
import { LocationLine } from "./location-line.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const container = document.createElement("div");
document.body.append(container);
const root = createRoot(container);

afterEach(() => act(() => root.render(null)));

const setInput = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!;
const setSelect = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, "value")!.set!;

describe("validateCityState", () => {
  it("accepts both or neither", () => {
    expect(validateCityState({ city: "", state: "" })).toBeNull();
    expect(validateCityState({ city: "Belo Horizonte", state: "MG" })).toBeNull();
  });

  it("rejects half a location, a whitespace city included", () => {
    expect(validateCityState({ city: "Belo Horizonte", state: "" })).toBe("CITY_STATE_INCOMPLETE");
    expect(validateCityState({ city: "  ", state: "MG" })).toBe("CITY_STATE_INCOMPLETE");
  });

  it("rejects an unknown UF and a city over 80 characters", () => {
    expect(validateCityState({ city: "X", state: "ZZ" })).toBe("INVALID_STATE");
    expect(validateCityState({ city: "a".repeat(81), state: "MG" })).toBe("CITY_TOO_LONG");
  });

  it("lists the 27 UFs once each", () => {
    expect(new Set(BRAZIL_STATES.map((uf) => uf.code)).size).toBe(27);
  });
});

describe("LocationLine", () => {
  it("formats city and state, or the state alone", () => {
    expect(formatLocation("Belo Horizonte", "MG")).toBe("Belo Horizonte, MG");
    expect(formatLocation(null, "MG")).toBe("MG");
    expect(renderToStaticMarkup(<LocationLine city="Recife" state="PE" />)).toContain("Recife, PE");
  });

  it("renders nothing without a location", () => {
    expect(renderToStaticMarkup(<LocationLine city={null} state={null} />)).toBe("");
  });
});

describe("CityStateField", () => {
  it("reports city and state changes as a whole value", () => {
    const onChange = vi.fn();
    act(() => root.render(<CityStateField value={{ city: "", state: "" }} onChange={onChange} />));

    const input = container.querySelector("input")!;
    act(() => {
      setInput.call(input, "Contagem");
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });
    expect(onChange).toHaveBeenLastCalledWith({ city: "Contagem", state: "" });

    const select = container.querySelector("select")!;
    act(() => {
      setSelect.call(select, "MG");
      select.dispatchEvent(new Event("change", { bubbles: true }));
    });
    expect(onChange).toHaveBeenLastCalledWith({ city: "", state: "MG" });
    expect(select.options).toHaveLength(28);
  });

  it("shows the error in place of the hint and marks the inputs invalid", () => {
    act(() =>
      root.render(
        <CityStateField
          value={{ city: "Contagem", state: "" }}
          onChange={() => undefined}
          error="Informe a cidade e o estado juntos, ou deixe os dois em branco."
        />,
      ),
    );

    expect(container.textContent).toContain("Informe a cidade e o estado juntos");
    expect(container.textContent).not.toContain("Opcional.");
    expect(container.querySelector("input")!.getAttribute("aria-invalid")).toBe("true");
  });
});
