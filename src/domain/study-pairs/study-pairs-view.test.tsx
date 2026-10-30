// @vitest-environment jsdom
import { act } from "react";

import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { StudyPair } from "../../types/domain/study-pairs/study-pair.js";
import type { StudyPairsViewProps } from "../../types/domain/study-pairs/study-pairs-view-props.js";

import { StudyPairsView } from "./study-pairs-view.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const container = document.createElement("div");
document.body.append(container);
const root = createRoot(container);

afterEach(() => act(() => root.render(null)));

const pair: StudyPair = {
  id: "p1",
  goal: "Aprender Rust",
  sinceLabel: "2 de outubro",
  partner: { id: "u2", username: "marina", name: "Marina Souza", href: "/u/marina" },
  myCheckin: null,
  partnerCheckin: "Travei em lifetimes.",
  history: [{ weekKey: "w1", label: "Semana de 19 out", myNote: "", partnerNote: null }],
};

function render(props: Partial<StudyPairsViewProps> = {}) {
  act(() =>
    root.render(
      <StudyPairsView
        pairs={[]}
        openRequest={null}
        onRetry={() => {}}
        onRequest={() => {}}
        onCancelRequest={() => {}}
        onSaveCheckin={() => {}}
        onEndPair={() => {}}
        {...props}
      />,
    ),
  );
}

const text = () => container.textContent ?? "";
const button = (label: string) =>
  [...container.querySelectorAll("button")].find((b) => b.textContent === label)!;

function type(el: HTMLInputElement | HTMLTextAreaElement, value: string) {
  const proto = Object.getPrototypeOf(el) as object;
  Object.getOwnPropertyDescriptor(proto, "value")!.set!.call(el, value);
  el.dispatchEvent(new Event("input", { bubbles: true }));
}

describe("StudyPairsView", () => {
  it("requests a pair with the trimmed goal and the chosen topic", () => {
    const onRequest = vi.fn();
    render({ onRequest, topics: [{ value: "prog", label: "Programação" }] });

    act(() => type(container.querySelector("input")!, "  Aprender Go  "));
    const select = container.querySelector("select")!;
    act(() => {
      select.value = "prog";
      select.dispatchEvent(new Event("change", { bubbles: true }));
    });
    act(() => button("Procurar um par").click());

    expect(onRequest).toHaveBeenCalledWith({ goal: "Aprender Go", topic: "prog" });
  });

  it("asks for a goal instead of sending an empty request", () => {
    const onRequest = vi.fn();
    render({ onRequest });

    act(() => button("Procurar um par").click());

    expect(onRequest).not.toHaveBeenCalled();
    expect(container.querySelector('[role="alert"]')!.textContent).toContain(
      "Escreva seu objetivo",
    );
    expect(container.querySelector("input")!.getAttribute("aria-invalid")).toBe("true");
  });

  it("fills the form from a popular goal chip", () => {
    const onRequest = vi.fn();
    render({
      onRequest,
      topics: [{ value: "prog", label: "Programação" }],
      popularGoals: [{ goalKey: "rust", goal: "Aprender Rust", topic: "prog", openRequests: 12 }],
    });

    const chip = container.querySelector<HTMLButtonElement>(
      '[aria-label="12 pessoas querendo par para: Aprender Rust"]',
    )!;
    act(() => chip.click());
    act(() => button("Procurar um par").click());

    expect(onRequest).toHaveBeenCalledWith({ goal: "Aprender Rust", topic: "prog" });
  });

  it("explains backend errors and links the fix when there is one", () => {
    render({ requestError: "BIRTH_DATE_REQUIRED", birthDateHref: "/settings/account" });

    expect(text()).toContain("data de nascimento");
    expect(container.querySelector('a[href="/settings/account"]')).not.toBeNull();
  });

  it("shows the waiting state with cancel instead of the form", () => {
    const onCancelRequest = vi.fn();
    render({ openRequest: { goal: "Aprender Rust" }, onCancelRequest });

    expect(text()).toContain("Procurando alguém com o mesmo objetivo");
    expect(container.querySelector("form")).toBeNull();
    act(() => button("Cancelar pedido").click());
    expect(onCancelRequest).toHaveBeenCalled();
  });

  it("hides the form at the pair limit", () => {
    render({ pairs: [pair, { ...pair, id: "p2" }] });

    expect(text()).toContain("Você já tem 2 pares de estudo");
    expect(button("Procurar um par")).toBeUndefined();
  });

  it("shows both check-in statuses and saves this week's note", () => {
    const onSaveCheckin = vi.fn();
    render({ pairs: [pair], onSaveCheckin });

    expect(text()).toContain("Você ainda não contou como foi a semana");
    expect(text()).toContain("Marina já contou como foi a semana");

    act(() => type(container.querySelector("textarea")!, "Estudei traits."));
    act(() => button("Salvar check-in").click());

    expect(onSaveCheckin).toHaveBeenCalledWith("p1", "Estudei traits.");
  });

  it("closes the editor once saved and announces it", () => {
    render({ pairs: [pair], checkinStatus: { p1: "saving" } });
    expect(button("Salvando…").disabled).toBe(true);

    render({ pairs: [{ ...pair, myCheckin: "Estudei traits." }], checkinStatus: { p1: "saved" } });

    expect(container.querySelector("textarea")).toBeNull();
    expect(text()).toContain("Estudei traits.");
    expect(container.querySelector("[aria-live]")!.textContent).toBe("Check-in salvo");
  });

  it("lists previous weeks with who wrote what", () => {
    render({ pairs: [pair] });

    const history = container.querySelector("details")!.textContent;
    expect(history).toContain("Semana de 19 out");
    expect(history).toContain("Fez o check-in sem comentário");
    expect(history).toContain("Não fez check-in");
  });

  it("ends a pair only after the inline confirm", () => {
    const onEndPair = vi.fn();
    render({ pairs: [pair], onEndPair });

    act(() => button("Encerrar par").click());
    expect(onEndPair).not.toHaveBeenCalled();
    act(() => button("Manter par").click());
    act(() => button("Encerrar par").click());
    act(() => button("Encerrar").click());

    expect(onEndPair).toHaveBeenCalledWith("p1");
  });

  it("shows a retry notice when loading fails", () => {
    const onRetry = vi.fn();
    render({ loadError: true, onRetry });

    act(() => button("Tentar de novo").click());
    expect(onRetry).toHaveBeenCalled();
  });
});
