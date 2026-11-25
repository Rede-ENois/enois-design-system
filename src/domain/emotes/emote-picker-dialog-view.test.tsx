// @vitest-environment jsdom
import { act } from "react";

import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { defaultMessages } from "../../messages/default-messages.js";
import type { EmotePickerDialogViewProps } from "../../types/domain/emotes/emote-picker-dialog-view-props.js";

import { EmotePickerDialogView, EmotePickerTriggerButton } from "./emote-picker-dialog-view.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const messages = defaultMessages.emotePickerDialog;

const TABS = [
  { value: "recent", label: messages.tabRecent },
  { value: "enois", label: messages.tabEnois },
  { value: "all", label: messages.tabThirdParty },
];

const ITEMS = [{ code: "KEKW", src: "/emotes/image/KEKW?variant=thumb" }, { code: "GONE" }];

let host: HTMLDivElement;
let root: Root;

const escolhidos: string[] = [];
const paginaPedida: number[] = [];
const buscaDigitada: string[] = [];
const abaEscolhida: string[] = [];

function render(overrides: Partial<EmotePickerDialogViewProps> = {}) {
  act(() =>
    root.render(
      <EmotePickerDialogView
        open
        onOpenChange={() => {}}
        onSelect={(item) => escolhidos.push(item.code)}
        query=""
        onQueryChange={(query) => buscaDigitada.push(query)}
        tab="all"
        onTabChange={(tab) => abaEscolhida.push(tab)}
        tabs={TABS}
        items={ITEMS}
        total={ITEMS.length}
        onPageChange={(page) => paginaPedida.push(page)}
        {...overrides}
      />,
    ),
  );
}

const cell = (code: string) => document.querySelector<HTMLButtonElement>(`button[title="${code}"]`);

function botao(rotulo: string) {
  return document.querySelector<HTMLButtonElement>(`button[aria-label="${rotulo}"]`);
}

beforeEach(() => {
  host = document.createElement("div");
  document.body.appendChild(host);
  root = createRoot(host);
});

afterEach(() => {
  act(() => root.unmount());
  host.remove();
  escolhidos.length = 0;
  paginaPedida.length = 0;
  buscaDigitada.length = 0;
  abaEscolhida.length = 0;
});

describe("EmotePickerDialogView", () => {
  it("desenha título, busca, abas, grade, contagem e dica", () => {
    render();

    expect(document.body.textContent).toContain(messages.title);
    expect(
      document.querySelector(`input[placeholder="${messages.searchPlaceholder}"]`),
    ).not.toBeNull();
    expect(document.body.textContent).toContain(messages.tabEnois);
    expect(cell("KEKW")).not.toBeNull();
    expect(document.body.textContent).toContain(messages.count(ITEMS.length));
    expect(document.body.textContent).toContain(messages.hint);
  });

  it("a figurinha sem imagem continua listada", () => {
    render();

    expect(cell("KEKW")?.querySelector("img")?.getAttribute("src")).toBe(
      "/emotes/image/KEKW?variant=thumb",
    );
    expect(cell("GONE")?.querySelector("img")).toBeNull();
  });

  it("a grade cabe no diálogo e rola por dentro, sem crescer com a lista", () => {
    // O seletor ocupa a tela inteira quando a lista é longa; a rolagem é da grade, não do
    // diálogo, para header, busca, abas e rodapé continuarem no lugar.
    render({
      items: Array.from({ length: 80 }, (_, indice) => ({ code: `G${indice}` })),
      total: 80,
    });

    const grade = cell("G0")?.closest<HTMLElement>(".overflow-y-auto");

    expect(grade).not.toBeNull();
    expect(grade?.className).toContain("max-h-52");
    expect(grade?.className).toContain("overflow-y-auto");
    expect(cell("G79")?.closest(".overflow-y-auto")).toBe(grade);
    // O diálogo não é quem rola: o limite dele é só a tela.
    const dialogo = grade?.closest<HTMLElement>('[role="dialog"]');
    expect(dialogo?.className).not.toContain("overflow-y-auto");
    // E a grade tem altura limitada: numa linha automática ela esticaria até o conteúdo, e o
    // `max-h-52` dela não valeria — o diálogo cresceria e nada rolaria. A linha da grade é a que
    // recebe o espaço que sobra.
    expect(dialogo?.className).toContain("grid-rows-[auto_auto_auto_minmax(0,1fr)_auto]");
  });

  it("o clique na figurinha devolve o item", () => {
    render();

    act(() => cell("KEKW")?.click());

    expect(escolhidos).toEqual(["KEKW"]);
  });

  it("trocar de aba avisa o app", () => {
    render();
    const aba = [...document.querySelectorAll<HTMLButtonElement>("button")].find(
      (item) => item.textContent === messages.tabEnois,
    )!;

    act(() => {
      aba.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
      aba.click();
    });

    expect(abaEscolhida).toContain("enois");
  });

  it("a busca é controlada pelo app", () => {
    render();
    const campo = document.querySelector<HTMLInputElement>(
      `input[placeholder="${messages.searchPlaceholder}"]`,
    )!;
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;

    act(() => {
      setter?.call(campo, "kek");
      campo.dispatchEvent(new Event("input", { bubbles: true }));
    });

    expect(buscaDigitada).toEqual(["kek"]);
  });

  it("busca numa aba de recentes mostra o catálogo como ativo", () => {
    render({ tab: "recent", query: "kek", items: [] });

    expect(document.querySelector<HTMLButtonElement>('[data-state="active"]')?.textContent).toBe(
      messages.tabThirdParty,
    );
  });

  it("carregando, erro e vazio têm cada um o seu aviso", () => {
    render({ items: [], total: 0, loading: true });
    expect(document.body.textContent).toContain(messages.loading);

    render({ items: [], total: 0, error: true });
    expect(document.body.textContent).toContain(messages.error);

    render({ items: [], total: 0 });
    expect(document.body.textContent).toContain(messages.empty);
  });

  it("pagina: página atual, extremos travados e aviso ao app", () => {
    render({ page: 1, totalPages: 3 });

    expect(document.body.textContent).toContain(messages.page(1, 3));
    expect(botao(messages.previous)?.disabled).toBe(true);
    expect(botao(messages.next)?.disabled).toBe(false);

    act(() => botao(messages.next)?.click());
    expect(paginaPedida).toEqual([2]);
  });

  it("uma página só não mostra os botões", () => {
    render({ page: 1, totalPages: 1 });

    expect(botao(messages.previous)).toBeNull();
    expect(botao(messages.next)).toBeNull();
  });

  it("aba local vazia mostra o aviso; com itens, só a contagem", () => {
    render({ tab: "enois", localTab: true, items: [], total: 0 });
    expect(document.body.textContent).toContain(messages.empty);

    render({
      tab: "enois",
      localTab: true,
      items: [{ code: "enois_like", src: "/emojis/enois/like.webp" }],
      total: 0,
    });

    expect(cell("enois_like")).not.toBeNull();
    expect(document.body.textContent).toContain(messages.count(1));
    expect(document.body.textContent).not.toContain(messages.loading);
  });

  it("o gatilho nasce fora do diálogo e abre por onOpen (não explode o Radix)", () => {
    // Regressão: o gatilho era um DialogTrigger do Radix, que exige o contexto de um <Dialog> pai.
    // Irmão na árvore (o app põe o botão na barra do campo), renderizar quebrava em runtime com
    // "DialogTrigger must be used within Dialog" — e nenhum teste cobria o botão sozinho.
    const aberturas: number[] = [];
    act(() =>
      root.render(
        <>
          <EmotePickerTriggerButton
            id="seletor"
            trigger={<span>x</span>}
            label="Figurinhas"
            onOpen={() => aberturas.push(1)}
          />
          <EmotePickerDialogView
            id="seletor"
            open={false}
            onOpenChange={() => {}}
            onSelect={() => {}}
            query=""
            onQueryChange={() => {}}
            tab="all"
            onTabChange={() => {}}
            tabs={TABS}
            items={[]}
          />
        </>,
      ),
    );

    const gatilho = document.querySelector<HTMLButtonElement>('button[aria-controls="seletor"]');
    expect(gatilho).not.toBeNull();
    act(() => gatilho!.click());
    expect(aberturas).toHaveLength(1);
  });
});
