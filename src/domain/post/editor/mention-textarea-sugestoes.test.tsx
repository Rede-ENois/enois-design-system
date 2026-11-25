// @vitest-environment jsdom
import { act, createRef, useState } from "react";

import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { StickerSuggestions } from "../../../types/domain/post/sticker-suggestions.js";

import { fieldIn, selectText, typeInto, valueOf } from "./editor.fixture.js";
import { MentionTextarea } from "./mention-textarea.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const ABERTURA = /:([a-z0-9_]{0,24})$/i;

/** O mesmo contrato do app: o `:palavra` só vale no fim de uma palavra. */
function resolve(texto: string, cursor: number) {
  const antes = texto.slice(0, cursor);
  const achado = ABERTURA.exec(antes);
  if (!achado) return null;
  const inicio = antes.lastIndexOf(":");
  if (inicio > 0 && !/\s/.test(antes[inicio - 1] ?? "")) return null;
  return { query: achado[1] ?? "", start: inicio, end: cursor };
}

const container = document.createElement("div");
document.body.append(container);
const root = createRoot(container);
const termo = vi.fn();
const tecla = vi.fn();
const escolhida = vi.fn();

const terminal: unknown[][] = [];
function termoEfetivo(state: unknown) {
  termo(state);
  terminal.push([state, (globalThis as { x?: number }).x]);
}

afterEach(() => {
  act(() => root.render(null));
  termo.mockClear();
  tecla.mockClear();
  escolhida.mockClear();
});

function Field({ comMenu = true, inicial }: { comMenu?: boolean; inicial?: string } = {}) {
  const [value, setText] = useState(inicial ?? "");
  const [aberto, setAberto] = useState(false);
  const sugestoes: StickerSuggestions = {
    resolve,
    render: () =>
      !aberto
        ? null
        : {
            id: "sugestoes",
            opcoes: [{ code: "kekw", nome: "Kekw", src: "/kekw.png", origem: "Comunidade" }],
            destaque: 0,
            loadingLabel: "carregando",
            listLabel: "sugestões",
            onEscolher: escolhida,
            onDestacar: () => undefined,
            anchor: createRef<HTMLElement | null>(),
          },
    onKeyDown: (evento) => {
      tecla(evento.key);
      return evento.key === "Escape" || evento.key === "Enter";
    },
  };
  return (
    <MentionTextarea
      value={value}
      onChange={(next) => setText(next)}
      mentionResults={[]}
      onMentionQueryChange={() => undefined}
      stickerSuggestions={comMenu ? sugestoes : undefined}
      onStickerQueryChange={(state) => {
        termo(state);
        setAberto(state !== null && state.query.length >= 2);
      }}
    />
  );
}

function render(props: Parameters<typeof Field>[0] = {}) {
  act(() => root.render(<Field {...props} />));
  return fieldIn(container);
}

describe("MentionTextarea com autocomplete de figurinhas", () => {
  it("avisa o termo entre os dois-pontos enquanto ele é digitado", () => {
    const field = render();
    typeInto(field, "olha o :ke");
    const ultimo = termo.mock.calls.at(-1)?.[0];
    expect(ultimo).toMatchObject({ query: "ke", end: "olha o :ke".length });
  });

  it("entrega as teclas do menu aberto e não deixa o texto mudar", () => {
    const field = render();
    typeInto(field, "olha o :ke");
    const antes = valueOf(field);
    act(() => {
      field.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    });
    expect(tecla).toHaveBeenCalledWith("Enter");
    expect(valueOf(field)).toBe(antes);
  });

  it("fecha o termo quando o cursor sai de perto do dois-pontos", () => {
    typeInto(render(), "olha :ke");
    // No navegador o clique no texto põe o caret; aqui o `selectText` faz esse papel e os eventos de
    // tecla/mouse do próprio campo (não de `document`, que não chega a ele) pedem a leitura nova.
    const irPara = (offset: number) => {
      act(() => {
        selectText(fieldIn(container), offset, offset);
        document.dispatchEvent(new Event("selectionchange"));
        const caixa = fieldIn(container);
        caixa.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft" }));
        caixa.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
      });
    };
    irPara(0);
    expect(termo.mock.calls.at(-1)?.[0]).toBeNull();
    irPara("olha :ke".length);
    expect(termo.mock.calls.at(-1)?.[0]).toMatchObject({ query: "ke" });
  });

  it("não abre outro menu quando o cursor está no meio do texto", () => {
    typeInto(render(), "olha :ke agora");
    expect(termo.mock.calls.at(-1)?.[0]).toBeNull();
  });

  it("sem o autocomplete do app, o dois-pontos continua sendo texto", () => {
    const field = render({ comMenu: false });
    typeInto(field, "olha o :ke");
    expect(termo).not.toHaveBeenCalled();
    act(() => {
      field.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    });
    expect(tecla).not.toHaveBeenCalled();
  });
});
