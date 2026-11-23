// @vitest-environment jsdom
import { act } from "react";

import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { EnoisProvider } from "../../messages/enois-provider.js";
import type { ReportsSectionProps } from "../../types/domain/moderation/reports-section-props.js";
import { ReportsSection } from "../index.js";

import { reportsStoryData } from "./reports.fixture.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let host: HTMLDivElement;
let root: Root;
let props: ReportsSectionProps;

beforeEach(() => {
  host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
  props = {
    reports: reportsStoryData,
    admin: true,
    loading: false,
    error: false,
    pending: false,
    onRetry: vi.fn(),
    onVote: vi.fn(),
  };
});

afterEach(() => {
  act(() => root.unmount());
  host.remove();
});

function render(overrides: Partial<ReportsSectionProps> = {}) {
  props = { ...props, ...overrides };
  act(() =>
    root.render(
      <EnoisProvider>
        <ReportsSection {...props} />
      </EnoisProvider>,
    ),
  );
}

function button(label: string, scope: ParentNode = document.body) {
  const element = [...scope.querySelectorAll("button")].find((item) => item.textContent === label);
  if (!(element instanceof HTMLButtonElement)) throw new Error(`Botão não encontrado: ${label}`);
  return element;
}

function click(element: HTMLElement) {
  act(() => {
    element.focus();
    element.click();
  });
}

function chaveDoCartao(element: HTMLElement) {
  const fibra = Object.keys(element).find((key) => key.startsWith("__reactFiber"));
  if (!fibra) return null;
  let no = (element as unknown as Record<string, { return: unknown; memoizedProps: unknown }>)[
    fibra
  ];
  for (let passo = 0; passo < 8 && no; passo++) {
    const props = no.memoizedProps as Partial<ReportsSectionProps> | null;
    if (props && typeof props.onVote === "function" && "pending" in props) {
      return props as Required<Pick<ReportsSectionProps, "onVote">>;
    }
    no = no.return as typeof no;
  }
  return null;
}

async function settle() {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
}

describe("ReportsSection", () => {
  it("compõe os cartões com o voto coletivo e sem link de revisão para quem não é admin", () => {
    render({ admin: false });
    expect(host.textContent).toContain("Denúncia denuncia-ficticia-1");
    expect(host.textContent).toContain("Quórum necessário: 3");
    expect(host.querySelector("a")).toBeNull();
    click(button("Votar para punir", host));
    expect(props.onVote).toHaveBeenCalledWith("denuncia-ficticia-1", "PUNISH");
    click(button("Votar para descartar", host));
    expect(props.onVote).toHaveBeenCalledWith("denuncia-ficticia-1", "DISMISS");
  });

  it("respeita o href de revisão recebido quando a seção é administrativa", () => {
    render();
    expect(host.querySelector("a")?.getAttribute("href")).toBe("#revisao-ficticia-1");
  });

  it("não transforma carregamento em fila vazia", () => {
    render({ reports: [], loading: true });
    expect(host.querySelector('[role="status"]')?.getAttribute("aria-label")).toBe(
      "Carregando denúncias",
    );
    expect(host.textContent).not.toContain("Nenhuma denúncia aguardando");
    expect(host.querySelector("select")).toBeNull();
  });

  it("distingue falha de consulta da fila vazia e só tenta de novo pelo callback", () => {
    render({ reports: [], error: true });
    expect(host.querySelector('[role="alert"]')?.textContent).toContain(
      "Não foi possível carregar",
    );
    expect(host.textContent).not.toContain("Nenhuma denúncia aguardando");
    click(button("Tentar novamente", host));
    expect(props.onRetry).toHaveBeenCalledOnce();
    expect(props.onVote).not.toHaveBeenCalled();
    render({ error: false });
    expect(host.textContent).toContain("Nenhuma denúncia aguardando análise.");
    expect(host.querySelector('[role="alert"]')).toBeNull();
  });

  it("pending bloqueia o envio de voto e desabilita a nova tentativa", () => {
    const onVote = vi.fn();
    render({ pending: true, onVote });
    expect(button("Votar para punir", host).disabled).toBe(true);
    const cartao = chaveDoCartao(button("Votar para punir", host));
    if (!cartao) throw new Error("Props do cartão não encontradas");
    // O jsdom descarta o clique de botão que nasce desabilitado, então a guarda do componente é
    // exercitada pela própria prop do cartão, como o clique real chegaria depois do desbloqueio.
    act(() => cartao.onVote("denuncia-ficticia-1", "PUNISH"));
    expect(onVote).not.toHaveBeenCalled();
    render({ pending: true, reports: [], error: true });
    expect(button("Tentar novamente", host).disabled).toBe(true);
    const chefe = host.querySelector("section");
    if (!chefe) throw new Error("Seção não encontrada");
    expect(chefe.getAttribute("aria-busy")).toBe("true");
  });

  it.each(["callback", "refetch"])(
    "devolve foco ao título quando o voto remove o cartão no %s",
    async (timing) => {
      const onVote = vi.fn(() => {
        if (timing === "callback") render({ reports: reportsStoryData.slice(1) });
      });
      render({ onVote });
      click(button("Votar para punir", host));
      if (timing === "refetch") {
        await settle();
        render({ reports: reportsStoryData.slice(1) });
      }
      await settle();
      expect(document.activeElement).toBe(host.querySelector("h2"));
      expect(onVote).toHaveBeenCalledExactlyOnceWith("denuncia-ficticia-1", "PUNISH");
      expect(props.onRetry).not.toHaveBeenCalled();
    },
  );

  it("não rouba o foco que o usuário moveu antes da atualização da fila", async () => {
    render();
    click(button("Votar para descartar", host));
    const search = host.querySelector("input");
    search?.focus();
    render({ reports: reportsStoryData.slice(1) });
    await settle();
    expect(document.activeElement).toBe(search);
    expect(props.onVote).toHaveBeenCalledExactlyOnceWith("denuncia-ficticia-1", "DISMISS");
  });

  it("mantém o foco no botão votado quando o cartão continua na fila", async () => {
    render();
    const trigger = button("Votar para punir", host);
    click(trigger);
    render({ reports: reportsStoryData.map((report) => ({ ...report, myVote: "PUNISH" })) });
    await settle();
    expect(document.activeElement).toBe(trigger);
    expect(document.activeElement).not.toBe(host.querySelector("h2"));
  });
});
