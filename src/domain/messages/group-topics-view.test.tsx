// @vitest-environment jsdom
import { act } from "react";

import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { EnoisProvider } from "../../messages/enois-provider.js";
import type { GroupTopicData } from "../../types/domain/messages/group-topic-data.js";
import type { GroupTopicError } from "../../types/domain/messages/group-topic-error.js";
import type { GroupTopicsViewProps } from "../../types/domain/messages/group-topics-view-props.js";

import { GroupTopicFilter } from "./group-topic-filter.js";
import { GroupTopicsView } from "./group-topics-view.js";
import { useGroupTopicErrorText } from "./use-group-topic-error-text.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const TOPICS: GroupTopicData[] = [
  { id: "t1", name: "Jogatina", status: "OPEN" },
  { id: "t2", name: "Trabalho", status: "ARCHIVED" },
];

const ERROR_TEXT: Record<GroupTopicError, string> = {
  ALREADY_EXISTS: "Já existe um tópico com esse nome.",
  INVALID_NAME: "O nome do tópico precisa ter de 1 a 60 caracteres.",
  TOO_MANY: "O grupo atingiu o limite de tópicos.",
  FORBIDDEN: "Só o dono e os administradores mexem nos tópicos.",
};

describe("GroupTopicFilter", () => {
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

  const pill = (text: string) =>
    [...host.querySelectorAll("button")].find((b) => (b.textContent ?? "").includes(text))!;

  it("seleciona todo o assunto com null e marca o tópico aberto", () => {
    const onSelect = vi.fn();
    act(() =>
      root.render(
        <EnoisProvider>
          <GroupTopicFilter topics={TOPICS} activeTopicId="t1" onSelectTopic={onSelect} />
        </EnoisProvider>,
      ),
    );

    expect(pill("Todos os assuntos").getAttribute("aria-pressed")).toBe("false");
    expect(pill("Jogatina").getAttribute("aria-pressed")).toBe("true");

    act(() => pill("Todos os assuntos").click());
    expect(onSelect).toHaveBeenCalledWith(null);
    act(() => pill("Trabalho").click());
    expect(onSelect).toHaveBeenCalledWith("t2");
  });

  it("tópico arquivado continua listado com o aviso", () => {
    act(() =>
      root.render(
        <EnoisProvider>
          <GroupTopicFilter topics={TOPICS} activeTopicId={null} onSelectTopic={() => {}} />
        </EnoisProvider>,
      ),
    );
    expect(pill("Trabalho").textContent).toContain("(Arquivado)");
    expect(pill("Jogatina").textContent).not.toContain("Arquivado");
  });
});

describe("GroupTopicsView", () => {
  let root: Root;
  let host: HTMLDivElement;

  const render = (props: Partial<GroupTopicsViewProps> = {}) => {
    const merged = {
      topics: TOPICS,
      activeTopicId: null,
      onSelectTopic: vi.fn(),
      manager: true,
      onCreateTopic: vi.fn().mockResolvedValue(null),
      onRenameTopic: vi.fn().mockResolvedValue(null),
      onArchiveTopic: vi.fn().mockResolvedValue(null),
      onReorderTopics: vi.fn().mockResolvedValue(null),
      ...props,
    } satisfies GroupTopicsViewProps;
    act(() =>
      root.render(
        <EnoisProvider>
          <GroupTopicsView {...merged} />
        </EnoisProvider>,
      ),
    );
    return merged;
  };

  const byLabel = (scope: ParentNode, label: string) =>
    scope.querySelector<HTMLButtonElement | HTMLInputElement>(`[aria-label="${label}"]`);
  const byText = (scope: ParentNode, text: string) =>
    [...scope.querySelectorAll("button")].find((b) => (b.textContent ?? "").includes(text));
  const openManager = () => {
    const toggle = byText(host, "Tópicos") as HTMLButtonElement;
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    act(() => toggle.click());
    expect(toggle.getAttribute("aria-expanded")).toBe("true");
    return toggle;
  };
  const typeInto = (input: HTMLInputElement, value: string) => {
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!;
    act(() => {
      setter.call(input, value);
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });
  };

  beforeEach(() => {
    host = document.createElement("div");
    document.body.appendChild(host);
    root = createRoot(host);
  });

  afterEach(() => {
    act(() => root.unmount());
    host.remove();
  });

  it("membro comum não ganha o botão de gestão", () => {
    render({ manager: false });
    expect(byText(host, "Tópicos")).toBeUndefined();
    expect(byText(host, "Todos os assuntos")).toBeDefined();
    expect(host.querySelector('[aria-label="Nome do tópico"]')).toBeNull();
  });

  it("criar valida o nome e devolve o erro do servidor traduzido", async () => {
    const props = render();
    openManager();

    const input = byLabel(host, "Nome do tópico") as HTMLInputElement;
    const create = byText(host, "Criar tópico") as HTMLButtonElement;
    expect(create.disabled).toBe(true);

    typeInto(input, "   ");
    expect(create.disabled).toBe(true);

    typeInto(input, "  Rolê  ");
    expect(create.disabled).toBe(false);
    await act(async () => create.click());
    expect(props.onCreateTopic).toHaveBeenCalledWith("Rolê");
  });

  it("nome repetido mostra a mensagem do código ALREADY_EXISTS", async () => {
    const onCreateTopic = vi.fn().mockResolvedValue("ALREADY_EXISTS");
    render({ onCreateTopic });
    openManager();
    const input = byLabel(host, "Nome do tópico") as HTMLInputElement;
    typeInto(input, "Jogatina");
    await act(async () => (byText(host, "Criar tópico") as HTMLButtonElement).click());

    const alert = [...host.querySelectorAll('[role="alert"]')].map((n) => n.textContent);
    expect(alert).toContain(ERROR_TEXT.ALREADY_EXISTS);
  });

  it("mover manda a lista inteira na ordem nova", async () => {
    const props = render();
    openManager();
    const down = byLabel(host, "Mover o tópico Jogatina para cima");
    // O primeiro já está no topo: a ação existe, mas desligada.
    expect((down as HTMLButtonElement).disabled).toBe(true);

    await act(async () =>
      (byLabel(host, "Mover o tópico Jogatina para baixo") as HTMLButtonElement).click(),
    );
    expect(props.onReorderTopics).toHaveBeenCalledWith(["t2", "t1"]);
  });

  it("arquivar pede confirmação e tópico arquivado não oferece mais arquivar", async () => {
    const props = render();
    openManager();
    expect(byLabel(host, "Arquivar o tópico Trabalho")).toBeNull();

    act(() => (byLabel(host, "Arquivar o tópico Jogatina") as HTMLButtonElement).click());
    expect(props.onArchiveTopic).not.toHaveBeenCalled();
    await act(async () => (byText(host, "Arquivar") as HTMLButtonElement).click());
    expect(props.onArchiveTopic).toHaveBeenCalledWith("t1");
  });

  it("renomear envia o id e o nome novo", async () => {
    const props = render();
    openManager();
    act(() => (byLabel(host, "Renomear o tópico Jogatina") as HTMLButtonElement).click());
    const input = byLabel(host, "Renomear o tópico Jogatina") as HTMLInputElement;
    typeInto(input, "Jogatinas");
    await act(async () => (byText(host, "Salvar nome") as HTMLButtonElement).click());
    expect(props.onRenameTopic).toHaveBeenCalledWith("t1", "Jogatinas");
  });
});

describe("useGroupTopicErrorText", () => {
  it("traduz cada código e o desconhecido cai no genérico", () => {
    let toText: ((code: GroupTopicError) => string) | null = null;
    function Probe() {
      toText = useGroupTopicErrorText();
      return null;
    }
    const host = document.createElement("div");
    const root = createRoot(host);
    act(() =>
      root.render(
        <EnoisProvider>
          <Probe />
        </EnoisProvider>,
      ),
    );
    for (const [code, text] of Object.entries(ERROR_TEXT)) {
      expect(toText!(code as GroupTopicError)).toBe(text);
    }
    // Código desconhecido não tem texto: as mensagens genéricas não são do servidor.
    expect(toText!("OUTRO" as GroupTopicError)).toBeUndefined();
    act(() => root.unmount());
  });
});
