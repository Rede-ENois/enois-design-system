// @vitest-environment jsdom
import { act } from "react";

import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { defaultMessages } from "../../messages/default-messages.js";
import type { EmoteActionDialogViewProps } from "../../types/domain/emotes/emote-action-dialog-view-props.js";

import { EmoteActionDialogView } from "./emote-action-dialog-view.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const messages = defaultMessages.emoteActionDialog;

const ITEM = { code: "KEKW", src: "/emotes/image/KEKW?variant=thumb" };

let host: HTMLDivElement;
let root: Root;

const denuncias: string[] = [];
const banimentos: string[] = [];
const desbanimentos: string[] = [];
const aberturas: boolean[] = [];

function render(overrides: Partial<EmoteActionDialogViewProps> = {}) {
  act(() =>
    root.render(
      <EmoteActionDialogView
        open
        onOpenChange={(proximo) => aberturas.push(proximo)}
        item={ITEM}
        {...overrides}
      />,
    ),
  );
}

function botaoPorTexto(texto: string) {
  return [...document.querySelectorAll<HTMLButtonElement>("button")].find((botao) =>
    botao.textContent?.includes(texto),
  );
}

function motivo() {
  return document.querySelector<HTMLTextAreaElement>("textarea");
}

function escrever(valor: string) {
  const campo = motivo();
  act(() => {
    const definidor = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value")?.set;
    definidor?.call(campo, valor);
    campo?.dispatchEvent(new Event("input", { bubbles: true }));
  });
}

beforeEach(() => {
  host = document.createElement("div");
  document.body.appendChild(host);
  root = createRoot(host);
});

afterEach(() => {
  act(() => root.unmount());
  host.remove();
  denuncias.length = 0;
  banimentos.length = 0;
  desbanimentos.length = 0;
  aberturas.length = 0;
});

describe("EmoteActionDialogView", () => {
  it("abre com a figurinha e a pergunta", () => {
    render({ onReport: () => denuncias.push("KEKW") });

    expect(document.body.textContent).toContain("KEKW");
    expect(document.body.textContent).toContain(messages.description);
    expect(document.querySelector(`img[alt="KEKW"]`)?.getAttribute("src")).toBe(ITEM.src);
    expect(botaoPorTexto(messages.report)).toBeDefined();
    // Sem `onBan`, não há campo de motivo: quem não é admin não recebe a ação.
    expect(motivo()).toBeNull();
  });

  it("denunciar chama o app e cancelar fecha", () => {
    render({ onReport: () => denuncias.push("KEKW") });

    act(() => botaoPorTexto(messages.report)?.click());
    act(() => botaoPorTexto(messages.cancel)?.click());

    expect(denuncias).toEqual(["KEKW"]);
    expect(aberturas).toEqual([false]);
  });

  it("banir só acontece com motivo no mínimo e sem espaços nas pontas", () => {
    render({ onBan: (texto) => banimentos.push(texto) });

    act(() => botaoPorTexto(messages.ban)?.click());
    expect(banimentos).toEqual([]);
    expect(document.body.textContent).toContain(messages.reasonRequired);

    escrever("   curto   ");
    act(() => botaoPorTexto(messages.ban)?.click());
    expect(banimentos).toEqual([]);

    escrever("  Imagem usada para assediar  ");
    act(() => botaoPorTexto(messages.ban)?.click());
    expect(banimentos).toEqual(["Imagem usada para assediar"]);
  });

  it("com a figurinha já banida, a ação é desfazer o banimento", () => {
    render({ onUnban: () => desbanimentos.push("KEKW"), banned: true });

    expect(document.body.textContent).toContain(messages.banned);
    expect(botaoPorTexto(messages.ban)).toBeUndefined();

    act(() => botaoPorTexto(messages.unban)?.click());
    expect(desbanimentos).toEqual(["KEKW"]);
  });

  it("o pacote É Nóis chega sem ação e o diálogo diz por quê", () => {
    render({ item: { code: "enois_like" } });

    expect(document.body.textContent).toContain(messages.official);
    expect(botaoPorTexto(messages.report)).toBeUndefined();
    expect(botaoPorTexto(messages.ban)).toBeUndefined();
  });

  it("com requisição em andamento, as ações ficam desabilitadas", () => {
    render({ onBan: (texto) => banimentos.push(texto), pending: true });

    expect(botaoPorTexto(messages.ban)?.disabled).toBe(true);
    expect(motivo()?.disabled).toBe(true);
  });
});
