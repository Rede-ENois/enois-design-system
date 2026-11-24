// @vitest-environment jsdom
import { act } from "react";

import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { defaultMessages } from "../../messages/default-messages.js";
import type { TalentBankCandidateFilters } from "../../types/domain/talent-banks/talent-bank-candidate-filters.js";
import type { TalentBankCandidateRow } from "../../types/domain/talent-banks/talent-bank-candidate-row.js";

import { TalentBankCandidateDetail } from "./talent-bank-candidate-detail.js";
import { TalentBankCandidateList } from "./talent-bank-candidate-list.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const messages = defaultMessages.talentBank;

let host: HTMLDivElement;
let root: Root;

const render = (element: React.JSX.Element) => {
  act(() => root.render(element));
};

const text = () => document.body.textContent ?? "";

const button = (label: string) =>
  [...document.body.querySelectorAll<HTMLButtonElement>("button")].find(
    (element) => element.textContent?.trim() === label,
  );

const buttonByLabel = (label: string) =>
  [...document.body.querySelectorAll<HTMLButtonElement>("button")].find(
    (element) => element.getAttribute("aria-label") === label,
  );

const input = (label: string) =>
  [...document.body.querySelectorAll<HTMLInputElement>("input")].find(
    (element) => element.getAttribute("aria-label") === label,
  );

const type = (element: HTMLInputElement, value: string) => {
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;

  setter?.call(element, value);
  element.dispatchEvent(new Event("input", { bubbles: true }));
};

const filters: TalentBankCandidateFilters = {
  search: "",
  state: "",
  skill: "",
  minExperiences: "",
  education: "",
};

const candidates: TalentBankCandidateRow[] = [
  {
    enrollmentId: "enrollment_1",
    state: "ACTIVE",
    userId: "user_2",
    name: "Ana Souza",
    username: "ana",
    headline: "Product manager",
    avatar: null,
    location: "Remoto",
    experienceCount: 3,
    sharedFields: ["PROFILE", "SKILLS"],
    note: null,
    consentedAt: "2026-11-20T13:00:00Z",
    resumeAvailable: true,
    resumeName: "curriculo.pdf",
  },
  {
    enrollmentId: "enrollment_2",
    state: "PENDING",
    userId: "user_3",
    name: null,
    username: "bruno",
    headline: null,
    avatar: null,
    location: null,
    experienceCount: 0,
    sharedFields: [],
    note: null,
    consentedAt: null,
    resumeAvailable: false,
    resumeName: null,
  },
];

beforeEach(() => {
  host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
});

afterEach(() => {
  act(() => root.unmount());
  host.remove();
});

describe("lista de inscritos do recrutador", () => {
  it("mostra os totais e cada inscrição com o estado e o que foi autorizado", () => {
    render(
      <TalentBankCandidateList
        candidates={candidates}
        filters={filters}
        onFiltersChange={() => {}}
        activeTotal={1}
        pendingTotal={1}
        hasMore={false}
        onOpenCandidate={() => {}}
      />,
    );

    expect(text()).toContain(messages.candidates.total(1, 1));
    expect(text()).toContain("Ana Souza");
    expect(text()).toContain(messages.candidates.activeState);
    expect(text()).toContain(messages.candidates.pendingState);
    expect(text()).toContain("Perfil profissional");
  });

  it("leva os filtros para a quem chamou", () => {
    const onFiltersChange = vi.fn();

    render(
      <TalentBankCandidateList
        candidates={candidates}
        filters={filters}
        onFiltersChange={onFiltersChange}
        activeTotal={1}
        pendingTotal={1}
        hasMore={false}
        onOpenCandidate={() => {}}
      />,
    );

    const search = input(messages.candidates.searchLabel);

    expect(search).toBeDefined();

    act(() => {
      if (search) type(search, "ana");
    });

    expect(onFiltersChange).toHaveBeenCalledWith({ ...filters, search: "ana" });
  });

  it("abre a ficha do inscrito", () => {
    const onOpenCandidate = vi.fn();

    render(
      <TalentBankCandidateList
        candidates={candidates}
        filters={filters}
        onFiltersChange={() => {}}
        activeTotal={1}
        pendingTotal={1}
        hasMore={false}
        onOpenCandidate={onOpenCandidate}
      />,
    );

    act(() => {
      buttonByLabel(messages.candidates.open("Ana Souza"))?.click();
    });

    expect(onOpenCandidate).toHaveBeenCalledWith("enrollment_1");
  });

  it("carrega mais inscritos e avisa quando a lista está vazia", () => {
    const onLoadMore = vi.fn();

    render(
      <TalentBankCandidateList
        candidates={candidates}
        filters={filters}
        onFiltersChange={() => {}}
        activeTotal={1}
        pendingTotal={1}
        hasMore
        onLoadMore={onLoadMore}
        onOpenCandidate={() => {}}
      />,
    );

    act(() => {
      button(messages.candidates.loadMore)?.click();
    });

    expect(onLoadMore).toHaveBeenCalled();

    act(() =>
      root.render(
        <TalentBankCandidateList
          candidates={[]}
          filters={filters}
          onFiltersChange={() => {}}
          activeTotal={0}
          pendingTotal={0}
          hasMore={false}
          onOpenCandidate={() => {}}
        />,
      ),
    );

    expect(text()).toContain(messages.candidates.empty);
  });
});

describe("ficha do inscrito", () => {
  it("mostra só os blocos que a pessoa autorizou", () => {
    render(
      <TalentBankCandidateDetail
        candidate={{
          enrollmentId: "enrollment_1",
          state: "ACTIVE",
          sharedFields: ["PROFILE", "SKILLS"],
          consentVersion: "2026-11",
          purposeSnapshot: "Receber pessoas interessadas em produto digital.",
          note: "Gosto muito de produto.",
          consentedAt: "2026-11-20T13:00:00Z",
          identity: {
            name: "Ana Souza",
            username: "ana",
            headline: "Product manager",
            avatar: null,
            location: "Remoto",
          },
          skills: ["Produto"],
          experiences: [
            {
              id: "experience_1",
              title: "Product manager",
              company: "Empresa",
              location: "Remoto",
              description: null,
              startDate: "2024-01-01",
              endDate: null,
            },
          ],
          educations: [],
          certifications: [],
          resumeAuthorized: false,
          resumeAvailable: false,
          resumeName: null,
        }}
      />,
    );

    expect(text()).toContain("Ana Souza");
    expect(text()).toContain("Produto");
    expect(text()).toContain(messages.candidateDetail.experiences);
    expect(text()).not.toContain(messages.candidateDetail.education);
    expect(text()).not.toContain(messages.candidateDetail.certifications);
    expect(text()).not.toContain(messages.candidateDetail.resume);
  });

  it("baixa o currículo autorizado e encerra a inscrição", () => {
    const onDownloadResume = vi.fn();
    const onClose = vi.fn();

    render(
      <TalentBankCandidateDetail
        candidate={{
          enrollmentId: "enrollment_1",
          state: "ACTIVE",
          sharedFields: ["RESUME"],
          consentVersion: "2026-11",
          purposeSnapshot: "Receber pessoas interessadas em produto digital.",
          note: null,
          consentedAt: "2026-11-20T13:00:00Z",
          identity: null,
          skills: [],
          experiences: [],
          educations: [],
          certifications: [],
          resumeAuthorized: true,
          resumeAvailable: true,
          resumeName: "curriculo.pdf",
        }}
        onDownloadResume={onDownloadResume}
        onClose={onClose}
      />,
    );

    act(() => {
      button(messages.candidateDetail.downloadResume)?.click();
    });

    expect(onDownloadResume).toHaveBeenCalled();

    act(() => {
      button(messages.candidateDetail.close)?.click();
    });

    expect(onClose).toHaveBeenCalled();
  });

  it("avisa quando a pessoa não autorizou nada", () => {
    render(
      <TalentBankCandidateDetail
        candidate={{
          enrollmentId: "enrollment_1",
          state: "PENDING",
          sharedFields: [],
          consentVersion: "2026-11",
          purposeSnapshot: "Receber pessoas interessadas em produto digital.",
          note: null,
          consentedAt: null,
          identity: null,
          skills: [],
          experiences: [],
          educations: [],
          certifications: [],
          resumeAuthorized: false,
          resumeAvailable: false,
          resumeName: null,
        }}
      />,
    );

    expect(text()).toContain(messages.candidateDetail.noData);
  });
});
