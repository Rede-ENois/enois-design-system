// @vitest-environment jsdom
import { act } from "react";

import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { defaultMessages } from "../../messages/default-messages.js";
import type { TalentBankEditorValues } from "../../types/domain/talent-banks/talent-bank-editor-values.js";
import type { TalentBankSummary } from "../../types/domain/talent-banks/talent-bank-summary.js";

import { TalentBankDiscovery } from "./talent-bank-discovery.js";
import { TalentBankEditor } from "./talent-bank-editor.js";

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

const input = (label: string) =>
  [...document.body.querySelectorAll<HTMLInputElement>("input")].find(
    (element) => element.getAttribute("aria-label") === label,
  );

const select = (label: string) =>
  [...document.body.querySelectorAll<HTMLSelectElement>("select")].find(
    (element) => element.getAttribute("aria-label") === label,
  );

/** Writes into a controlled field the way a person does: the value changes, then the event goes. */
const type = (element: HTMLInputElement | HTMLTextAreaElement, value: string) => {
  const setter = Object.getOwnPropertyDescriptor(
    element instanceof HTMLTextAreaElement
      ? HTMLTextAreaElement.prototype
      : HTMLInputElement.prototype,
    "value",
  )?.set;

  setter?.call(element, value);
  element.dispatchEvent(new Event("input", { bubbles: true }));
};

const recruiter = {
  userId: "user_1",
  name: "Recrutadora de Produto",
  username: "recrutadora",
  avatar: null,
  headline: "Recrutamento de tecnologia",
  location: "Remoto",
};

const banks: TalentBankSummary[] = [
  {
    id: "bank_1",
    href: "/bancos-de-talentos/bank_1",
    title: "Time de produto",
    purpose: "Receber pessoas interessadas em produto digital.",
    focusArea: "Tecnologia",
    desiredSkills: ["Produto"],
    requestedFields: [
      { key: "PROFILE", label: "Perfil profissional", description: "Nome e título." },
      { key: "SKILLS", label: "Competências", description: "Competências registradas." },
    ],
    createdAt: "2026-11-20T12:00:00Z",
    recruiter,
  },
];

const editorValues: TalentBankEditorValues = {
  title: "Time de produto",
  purpose: "Receber pessoas interessadas em produto digital.",
  description: "",
  handlingConditions: "O acesso dura enquanto a inscrição estiver ativa.",
  focusArea: "Tecnologia",
  desiredSkills: "Produto",
  requestedFields: ["PROFILE"],
};

beforeEach(() => {
  host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
});

afterEach(() => {
  act(() => root.unmount());
  host.remove();
});

describe("vitrine de bancos de talentos", () => {
  it("mostra os bancos publicados com quem publica e o que o banco pede", () => {
    render(
      <TalentBankDiscovery
        banks={banks}
        search=""
        onSearchChange={() => {}}
        areas={["Tecnologia"]}
        area=""
        onAreaChange={() => {}}
      />,
    );

    expect(text()).toContain(messages.discovery.title);
    expect(text()).toContain("Time de produto");
    expect(text()).toContain(messages.discovery.byRecruiter(recruiter.name));
    expect(text()).toContain("Perfil profissional");
    expect(text()).toContain("Competências");
  });

  it("não mostra quem está inscrito no banco", () => {
    render(
      <TalentBankDiscovery
        banks={banks}
        search=""
        onSearchChange={() => {}}
        areas={["Tecnologia"]}
        area=""
        onAreaChange={() => {}}
      />,
    );

    expect(text()).not.toContain("Ana Souza");
  });

  it("leva a busca e o filtro de área para a quem chamo", () => {
    const onSearchChange = vi.fn();
    const onAreaChange = vi.fn();

    render(
      <TalentBankDiscovery
        banks={banks}
        search=""
        onSearchChange={onSearchChange}
        areas={["Tecnologia", "Design"]}
        area=""
        onAreaChange={onAreaChange}
      />,
    );

    const search = input(messages.discovery.searchLabel);

    expect(search).toBeDefined();

    act(() => {
      if (search) type(search, "produto");
    });

    expect(onSearchChange).toHaveBeenCalled();

    const area = select(messages.discovery.areaLabel);

    expect(area).toBeDefined();

    act(() => {
      if (!area) return;
      area.value = "Design";
      area.dispatchEvent(new Event("change", { bubbles: true }));
    });

    expect(onAreaChange).toHaveBeenCalledWith("Design");
  });

  it("mostra o estado de carregamento, o de erro e o vazio", () => {
    render(
      <TalentBankDiscovery
        banks={[]}
        search=""
        onSearchChange={() => {}}
        areas={[]}
        area=""
        onAreaChange={() => {}}
        state={{ kind: "loading" }}
      />,
    );

    expect(text()).toContain(messages.discovery.loading);

    act(() =>
      root.render(
        <TalentBankDiscovery
          banks={[]}
          search=""
          onSearchChange={() => {}}
          areas={[]}
          area=""
          onAreaChange={() => {}}
          state={{ kind: "error" }}
          onRetry={() => {}}
        />,
      ),
    );

    expect(text()).toContain(messages.discovery.error);
    expect(button(messages.discovery.retry)).toBeDefined();

    act(() =>
      root.render(
        <TalentBankDiscovery
          banks={[]}
          search=""
          onSearchChange={() => {}}
          areas={[]}
          area=""
          onAreaChange={() => {}}
        />,
      ),
    );

    expect(text()).toContain(messages.discovery.empty);
  });
});

describe("editor do banco de talentos", () => {
  it("marca e desmarca as informações que o banco pede", () => {
    const onChange = vi.fn();

    render(
      <TalentBankEditor
        values={editorValues}
        onChange={onChange}
        discoverable
        onDiscoverableChange={() => {}}
        onSave={() => {}}
        createdAt="2026-11-20T12:00:00Z"
      />,
    );

    const checkbox = [
      ...document.body.querySelectorAll<HTMLInputElement>("input[type=checkbox]"),
    ].find((element) => element.checked);

    expect(checkbox).toBeDefined();

    act(() => {
      checkbox?.click();
    });

    expect(onChange).toHaveBeenCalled();
  });

  it("salva o banco e avisa o que está errado", () => {
    const onSave = vi.fn();

    render(
      <TalentBankEditor
        values={editorValues}
        onChange={() => {}}
        discoverable={false}
        onDiscoverableChange={() => {}}
        onSave={onSave}
        createdAt={null}
        error={messages.editor.error}
      />,
    );

    expect(text()).toContain(messages.editor.error);

    act(() => {
      button(messages.editor.save)?.click();
    });

    expect(onSave).toHaveBeenCalled();
  });
});
