// @vitest-environment jsdom
import { act } from "react";

import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ThemeSellDialog } from "./theme-sell-dialog.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

/**
 * Venda de tema com amostra ao vivo (épico "preview do tema ao criar e antes de comprar"):
 * quem vende precisa ver o RESULTADO dentro do diálogo — a aparência ativa é o que se vende,
 * e o ThemePreview desenha com os tokens reais dela. O botão de publicar segue bloqueado
 * até nome válido e preço mínimo.
 */
describe("ThemeSellDialog", () => {
  let root: Root;
  let host: HTMLDivElement;

  beforeEach(() => {
    host = document.createElement("div");
    document.body.appendChild(host);
    root = createRoot(host);
  });

  afterEach(() => {
    act(() => root.unmount());
    host.remove();
  });

  const render = (overrides: Record<string, unknown> = {}) => {
    act(() =>
      root.render(
        <ThemeSellDialog
          open
          onOpenChange={() => {}}
          defaultName="Meu tema"
          parsePrice={(text) => (Number(text) > 0 ? Number(text) * 1000 : null)}
          formatPrice={(value) => String(value / 1000)}
          onSubmit={() => {}}
          {...overrides}
        />,
      ),
    );
    return host;
  };

  const button = (host: HTMLElement, label: RegExp) =>
    [...host.querySelectorAll("button")].find((b) => label.test(b.textContent ?? ""));

  it("mostra a amostra ao vivo da aparência ativa dentro do diálogo", async () => {
    const host = render();
    await act(async () => {});
    // O rótulo da amostra e o cartão do ThemePreview (os textos do mock de post) no corpo
    // renderizado (o conteúdo do diálogo é portado para o body).
    const tudo = document.body.textContent ?? "";
    expect(tudo).toContain("Amostra ao vivo");
    expect(tudo).toContain("Marina Rocha");
  });

  it("publicar fica bloqueado sem nome válido", async () => {
    const host = render({ defaultName: "" });
    await act(async () => {});
    const submit = button(document.body, /Publicar e vender/);
    expect(submit?.disabled).toBe(true);
  });
});
