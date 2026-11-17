// @vitest-environment jsdom
import { act } from "react";

import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { defaultMessages } from "../../messages/default-messages.js";
import type { RecruitmentBoardProps } from "../../types/domain/jobs/recruitment-board-props.js";
import type { RecruitmentCandidate } from "../../types/domain/jobs/recruitment-candidate.js";
import type { RecruitmentColumn } from "../../types/domain/jobs/recruitment-column.js";
import type { RecruitmentTableProps } from "../../types/domain/jobs/recruitment-table-props.js";
import type { RecruitmentTableRow } from "../../types/domain/jobs/recruitment-table-row.js";

import { RecruitmentBoard } from "./recruitment-board.js";
import { RecruitmentTable } from "./recruitment-table.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const messages = defaultMessages.recruitment;

let host: HTMLDivElement;
let root: Root;

const render = (element: React.JSX.Element) => {
  act(() => root.render(element));
};

const text = () => document.body.textContent ?? "";

const checkbox = (label: string) =>
  [...document.body.querySelectorAll<HTMLInputElement>("input[type=checkbox]")].find(
    (element) => element.getAttribute("aria-label") === label,
  );

const button = (label: string) =>
  [...document.body.querySelectorAll<HTMLButtonElement>("button")].find(
    (element) => element.textContent?.trim() === label,
  );

const select = (label: string) =>
  [...document.body.querySelectorAll<HTMLSelectElement>("select")].find(
    (element) => element.getAttribute("aria-label") === label,
  );

const choose = (element: HTMLSelectElement, value: string) => {
  element.value = value;
  element.dispatchEvent(new Event("change", { bubbles: true }));
};

const score = {
  total: 78,
  available: true,
  components: [
    { code: "SKILLS", label: "3 de 5 requisitos", points: 45, maxPoints: 75 },
    { code: "IDENTITY", label: "Identidade verificada", points: 25, maxPoints: 25 },
  ],
};

const unavailable = { total: 0, available: false, components: [] };

const card = (overrides: Partial<RecruitmentCandidate> = {}): RecruitmentCandidate => ({
  applicationId: "app_1",
  userId: "user_1",
  name: "Ana Souza",
  avatarUrl: null,
  headline: "Engenheira de software",
  status: "IN_REVIEW",
  statusLabel: "Em análise",
  appliedAt: "2026-11-01T12:00:00Z",
  stageId: "stage_1",
  rejected: false,
  score,
  ...overrides,
});

const stages = [
  { id: "stage_1", name: "Triagem", position: 0 },
  { id: "stage_2", name: "Entrevista", position: 1 },
];

const columns: RecruitmentColumn[] = [
  { stageId: "stage_1", cards: [card()] },
  { stageId: "stage_2", cards: [card({ applicationId: "app_2", name: "Bruno Lima" })] },
];

const boardProps = (overrides: Partial<RecruitmentBoardProps> = {}): RecruitmentBoardProps => ({
  stages,
  columns,
  rejected: [],
  summary: { total: 2, inProcess: 2, rejected: 0 },
  selectedIds: [],
  onToggleSelected: () => {},
  onOpen: () => {},
  onBatchMove: () => {},
  ...overrides,
});

const row = (overrides: Partial<RecruitmentTableRow> = {}): RecruitmentTableRow => ({
  ...card(),
  stageName: "Triagem",
  ...overrides,
});

const tableProps = (overrides: Partial<RecruitmentTableProps> = {}): RecruitmentTableProps => ({
  rows: [row(), row({ applicationId: "app_2", name: "Bruno Lima", stageName: "Entrevista" })],
  stages,
  statusOptions: [
    { value: "APPLIED", label: "Nova" },
    { value: "IN_REVIEW", label: "Em análise" },
  ],
  statusFilter: null,
  onStatusFilter: () => {},
  search: "",
  onSearch: () => {},
  selectedIds: [],
  onToggleSelected: () => {},
  onTogglePage: () => {},
  onOpen: () => {},
  onBatchMove: () => {},
  hasMore: false,
  onLoadMore: () => {},
  ...overrides,
});

beforeEach(() => {
  host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
});

afterEach(() => {
  act(() => root.unmount());
  host.remove();
});

describe("board de recrutamento (kanban)", () => {
  it("mostra os contadores, as colunas por etapa e a coluna de quem saiu", () => {
    render(
      <RecruitmentBoard
        {...boardProps({
          rejected: [
            card({ applicationId: "app_9", name: "Diego Reis", statusLabel: "Não selecionado" }),
          ],
          summary: { total: 3, inProcess: 2, rejected: 1 },
        })}
      />,
    );

    expect(text()).toContain(messages.summaryTotal(3));
    expect(text()).toContain(messages.summaryInProcess(2));
    expect(text()).toContain(messages.summaryRejected(1));
    expect(text()).toContain("Triagem");
    expect(text()).toContain(messages.rejectedColumn);
    expect(text()).toContain("Diego Reis");
  });

  it("a coluna de entrada recebe a candidatura sem etapa configurada", () => {
    render(
      <RecruitmentBoard
        {...boardProps({
          stages: [],
          columns: [{ stageId: null, cards: [card({ stageId: null })] }],
          summary: { total: 1, inProcess: 1, rejected: 0 },
        })}
      />,
    );

    expect(text()).toContain(messages.entranceColumn);
    expect(text()).toContain("Ana Souza");
  });

  it("seleção por caixa nomeada move em lote e devolve o resultado por escrito", () => {
    const onToggleSelected = vi.fn();
    const onBatchMove = vi.fn();
    render(<RecruitmentBoard {...boardProps({ onToggleSelected, onBatchMove })} />);

    const box = checkbox(messages.selectApplication("Ana Souza"));
    expect(box).toBeDefined();
    act(() => box!.click());
    expect(onToggleSelected).toHaveBeenCalledWith("app_1");
  });

  it("mover em lote exige a etapa escolhida e passa o alvo", () => {
    const onBatchMove = vi.fn();
    render(
      <RecruitmentBoard
        {...boardProps({ selectedIds: ["app_1", "app_2"], onBatchMove, pending: false })}
      />,
    );

    expect(text()).toContain(messages.selectedCount(2));
    // O backend recusa avançar sem etapa de destino: o botão só liga depois da escolha.
    const moveButton = button(messages.advance);
    expect(moveButton).toBeDefined();
    expect(moveButton!.disabled).toBe(true);

    const moveSelect = select(messages.moveTo);
    expect(moveSelect).toBeDefined();
    act(() => choose(moveSelect!, "stage_2"));

    expect(button(messages.advance)!.disabled).toBe(false);
    act(() => button(messages.advance)!.click());
    expect(onBatchMove).toHaveBeenCalledWith({ kind: "ADVANCE", stageId: "stage_2" });

    act(() => button(messages.returnTo)!.click());
    expect(onBatchMove).toHaveBeenCalledWith({ kind: "RETURN", stageId: "stage_2" });
  });

  it("sem seleção não há movimento de lote", () => {
    render(<RecruitmentBoard {...boardProps()} />);

    expect(button(messages.selectedCount(0))).toBeUndefined();
    expect(button(messages.advance)).toBeUndefined();
  });

  it("reprovar em lote passa o tipo REJECT e o erro aparece por escrito", () => {
    const onBatchMove = vi.fn();
    render(
      <RecruitmentBoard
        {...boardProps({
          selectedIds: ["app_1"],
          onBatchMove,
          error: "Conte por que a candidatura não seguiu.",
        })}
      />,
    );

    const rejectButton = button(messages.reject);
    expect(rejectButton).toBeDefined();
    act(() => rejectButton!.click());
    expect(onBatchMove).toHaveBeenCalledWith({ kind: "REJECT", stageId: null });
    expect(text()).toContain("Conte por que a candidatura não seguiu.");
  });

  it("score indisponível diz que não há dados, nunca zero", () => {
    render(
      <RecruitmentBoard
        {...boardProps({
          columns: [{ stageId: "stage_1", cards: [card({ score: unavailable })] }],
        })}
      />,
    );

    expect(text()).toContain(messages.scoreUnavailable);
  });
});

describe("tabela de recrutamento (paginada)", () => {
  it("lista a página com estágio, estado e pontuação", () => {
    render(<RecruitmentTable {...tableProps()} />);

    expect(text()).toContain("Ana Souza");
    expect(text()).toContain("Triagem");
    expect(text()).toContain("Em análise");
    expect(text()).toContain(messages.scoreTotal(78));
    expect(text()).toContain(messages.rowsShown(2));
  });

  it("caixa da página marca todas e carrega mais quando há cursor", () => {
    const onTogglePage = vi.fn();
    const onLoadMore = vi.fn();
    render(<RecruitmentTable {...tableProps({ onTogglePage, onLoadMore, hasMore: true })} />);

    const pageBox = checkbox(messages.selectPage);
    expect(pageBox).toBeDefined();
    act(() => pageBox!.click());
    expect(onTogglePage).toHaveBeenCalledWith(true);

    const loadMore = button(messages.loadMore);
    expect(loadMore).toBeDefined();
    act(() => loadMore!.click());
    expect(onLoadMore).toHaveBeenCalled();
  });

  it("sem cursor não oferece carregar mais", () => {
    render(<RecruitmentTable {...tableProps({ hasMore: false })} />);

    expect(button(messages.loadMore)).toBeUndefined();
  });

  it("vazia mostra o estado vazio, não uma tabela sem linhas", () => {
    render(<RecruitmentTable {...tableProps({ rows: [] })} />);

    expect(text()).toContain(messages.empty);
    expect(document.body.querySelector("table")).toBeNull();
  });

  it("carregando não desenha a tabela", () => {
    render(<RecruitmentTable {...tableProps({ loading: true, rows: [] })} />);

    expect(document.body.querySelector("table")).toBeNull();
    expect(text()).toContain(messages.loadingMore);
  });

  it("erro aparece por escrito", () => {
    render(<RecruitmentTable {...tableProps({ error: messages.loadError })} />);

    expect(text()).toContain(messages.loadError);
  });

  it("mover em lote pela tabela segue o mesmo alvo da etapa escolhida", () => {
    const onBatchMove = vi.fn();
    render(<RecruitmentTable {...tableProps({ selectedIds: ["app_1"], onBatchMove })} />);

    expect(text()).toContain(messages.selectedCount(1));
    const returnButton = button(messages.returnTo);
    expect(returnButton).toBeDefined();
    expect(returnButton!.disabled).toBe(true);

    const moveSelect = select(messages.moveTo);
    expect(moveSelect).toBeDefined();
    act(() => choose(moveSelect!, "stage_1"));

    expect(button(messages.returnTo)!.disabled).toBe(false);
    act(() => button(messages.returnTo)!.click());
    expect(onBatchMove).toHaveBeenCalledWith({ kind: "RETURN", stageId: "stage_1" });
  });
});
