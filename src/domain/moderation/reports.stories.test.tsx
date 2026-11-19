// @vitest-environment jsdom
import { act } from "react";

import { composeStory } from "@storybook/react-vite";
import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import meta, { FalhaNaAcao } from "./reports.stories.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const Story = composeStory(FalhaNaAcao, meta);
let host: HTMLDivElement;
let root: Root;

beforeEach(() => {
  vi.useFakeTimers();
  host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
});

afterEach(() => {
  act(() => root.unmount());
  host.remove();
  vi.useRealTimers();
});

function button(label: string, scope: ParentNode = document.body): HTMLButtonElement {
  const element = [...scope.querySelectorAll("button")].find((item) => item.textContent === label);
  if (!(element instanceof HTMLButtonElement)) throw new Error(`Botão não encontrado: ${label}`);
  return element;
}

function click(element: HTMLElement) {
  act(() => element.click());
}

function dialog(): HTMLElement {
  const element = document.querySelector('[role="dialog"]');
  if (!(element instanceof HTMLElement)) throw new Error("Confirmação não encontrada");
  return element;
}

describe("demonstração de falha na ação da fila", () => {
  it("não anuncia erro de uma tentativa cancelada ao abrir outra denúncia", async () => {
    act(() => root.render(<Story />));
    click(button("Punir agora", host));
    click(button("Punir agora", dialog()));
    await act(async () => {
      await vi.advanceTimersByTimeAsync(650);
    });
    expect(dialog().querySelector('[role="alert"]')).not.toBeNull();
    click(button("Cancelar", dialog()));
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1);
    });
    expect(document.querySelector('[role="dialog"]')).toBeNull();
    const next = [...host.querySelectorAll("li")].find((item) =>
      item.textContent?.includes("Denúncia denuncia-ficticia-2"),
    );
    if (!next) throw new Error("Segunda denúncia não encontrada");
    click(button("Enviar advertência", next));
    expect(dialog().textContent).toContain("denuncia-ficticia-2");
    expect(dialog().querySelector('[role="alert"]')).toBeNull();
  });
});
