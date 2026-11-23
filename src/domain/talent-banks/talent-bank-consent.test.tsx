// @vitest-environment jsdom
import { type ComponentProps, act } from "react";

import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { defaultMessages } from "../../messages/default-messages.js";
import type { TalentBankDetail } from "../../types/domain/talent-banks/talent-bank-detail.js";
import type { TalentBankEnrollment } from "../../types/domain/talent-banks/talent-bank-enrollment.js";
import type { TalentBankMyEnrollment } from "../../types/domain/talent-banks/talent-bank-my-enrollment.js";

import { TalentBankConsent } from "./talent-bank-consent.js";
import { TalentBankMyEnrollments } from "./talent-bank-my-enrollments.js";

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

const type = (element: HTMLTextAreaElement, value: string) => {
  const setter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value")?.set;

  setter?.call(element, value);
  element.dispatchEvent(new Event("input", { bubbles: true }));
};

const bank: TalentBankDetail = {
  id: "bank_1",
  title: "Time de produto",
  purpose: "Receber pessoas interessadas em produto digital.",
  description: "Respondemos por aqui quando há encaixe.",
  handlingConditions: "O acesso dura enquanto a inscrição estiver ativa.",
  focusArea: "Tecnologia",
  desiredSkills: ["Produto"],
  requestedFields: [
    { key: "PROFILE", label: "Perfil profissional", description: "Nome e título." },
    { key: "SKILLS", label: "Competências", description: "Competências registradas." },
  ],
  consentVersion: "2026-11",
  createdAt: "2026-11-20T12:00:00Z",
  recruiter: {
    userId: "user_1",
    name: "Recrutadora de Produto",
    username: "recrutadora",
    avatar: null,
    headline: "Recrutamento de tecnologia",
    location: "Remoto",
  },
  myState: null,
};

const enrollment: TalentBankEnrollment = {
  id: "enrollment_1",
  state: "ACTIVE",
  sharedFields: ["PROFILE", "SKILLS"],
  requestedAt: "2026-11-20T12:00:00Z",
  consentedAt: "2026-11-20T13:00:00Z",
  revokedAt: null,
  closedAt: null,
};

const consentProps = (overrides: Partial<ComponentProps<typeof TalentBankConsent>> = {}) => ({
  bank,
  selectedFields: [],
  onToggleField: vi.fn(),
  note: "",
  onNoteChange: vi.fn(),
  step: "details" as const,
  enrollment: null,
  onStart: vi.fn(),
  onConfirm: vi.fn(),
  onBack: vi.fn(),
  onRevoke: vi.fn(),
  onErase: vi.fn(),
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

describe("consentimento do banco de talentos", () => {
  it("mostra quem publica, a finalidade e as condições antes de qualquer inscrição", () => {
    render(<TalentBankConsent {...consentProps()} />);

    expect(text()).toContain(bank.recruiter.name);
    expect(text()).toContain(bank.purpose);
    expect(text()).toContain(bank.handlingConditions);
    expect(text()).toContain(messages.consent.noEnrollment);
  });

  it("pede a inscrição e leva o pedido para a quem chamou", () => {
    const onStart = vi.fn();

    render(<TalentBankConsent {...consentProps({ onStart })} />);

    act(() => {
      button(messages.consent.request)?.click();
    });

    expect(onStart).toHaveBeenCalled();
  });

  it("deixa pedir uma nova inscrição depois da revogação", () => {
    const onStart = vi.fn();

    render(
      <TalentBankConsent
        {...consentProps({
          enrollment: {
            ...enrollment,
            state: "REVOKED_BY_CANDIDATE",
            consentedAt: null,
            revokedAt: "2026-11-21T10:00:00Z",
          },
          onStart,
        })}
      />,
    );

    const pedir = button(messages.consent.request);

    expect(pedir?.disabled).toBe(false);

    act(() => {
      pedir?.click();
    });

    expect(onStart).toHaveBeenCalled();
  });

  it("autoriza campo por campo e confirma só o que está marcado", () => {
    const onToggleField = vi.fn();
    const onConfirm = vi.fn();
    const onNoteChange = vi.fn();

    render(
      <TalentBankConsent
        {...consentProps({
          step: "authorize",
          selectedFields: ["PROFILE"],
          onToggleField,
          onConfirm,
          onNoteChange,
        })}
      />,
    );

    const checkboxes = document.body.querySelectorAll<HTMLInputElement>("input[type=checkbox]");

    expect(checkboxes).toHaveLength(2);

    act(() => {
      checkboxes[0]?.click();
    });

    expect(onToggleField).toHaveBeenCalledWith("PROFILE");

    const note = document.body.querySelector<HTMLTextAreaElement>("textarea");

    expect(note).toBeDefined();

    act(() => {
      if (note) type(note, "Quero participar");
    });

    expect(onNoteChange).toHaveBeenCalledWith("Quero participar");

    act(() => {
      button(messages.consent.confirm)?.click();
    });

    expect(onConfirm).toHaveBeenCalled();
  });

  it("não confirma sem nenhuma informação marcada", () => {
    render(<TalentBankConsent {...consentProps({ step: "authorize" })} />);

    expect(button(messages.consent.confirm)?.disabled).toBe(true);
  });

  it("mostra o erro da confirmação", () => {
    render(
      <TalentBankConsent {...consentProps({ step: "authorize", error: messages.consent.error })} />,
    );

    expect(text()).toContain(messages.consent.error);
  });

  it("revoga e pede a exclusão quando a inscrição está ativa", () => {
    const onRevoke = vi.fn();
    const onErase = vi.fn();

    render(<TalentBankConsent {...consentProps({ enrollment, onRevoke, onErase })} />);

    expect(text()).toContain(messages.consent.active);

    act(() => {
      button(messages.consent.revoke)?.click();
    });

    expect(onRevoke).toHaveBeenCalled();

    act(() => {
      button(messages.consent.erase)?.click();
    });

    expect(onErase).toHaveBeenCalled();
  });
});

describe("minhas inscrições", () => {
  const myEnrollments: TalentBankMyEnrollment[] = [
    {
      enrollmentId: "enrollment_1",
      bankId: "bank_1",
      bankTitle: "Time de produto",
      bankPurpose: "Receber pessoas interessadas em produto digital.",
      recruiterName: "Recrutadora de Produto",
      recruiterUsername: "recrutadora",
      state: "ACTIVE",
      sharedFields: ["PROFILE", "SKILLS"],
      requestedAt: "2026-11-20T12:00:00Z",
      consentedAt: "2026-11-20T13:00:00Z",
    },
  ];

  it("mostra o banco, o estado e o que foi autorizado", () => {
    render(<TalentBankMyEnrollments enrollments={myEnrollments} />);

    expect(text()).toContain("Time de produto");
    expect(text()).toContain(messages.myEnrollments.activeState);
    expect(text()).toContain("Perfil profissional");
  });

  it("revoga a inscrição e pede a exclusão dos dados", () => {
    const onRevoke = vi.fn();
    const onErase = vi.fn();

    render(
      <TalentBankMyEnrollments enrollments={myEnrollments} onRevoke={onRevoke} onErase={onErase} />,
    );

    act(() => {
      button(messages.myEnrollments.revoke)?.click();
    });

    expect(onRevoke).toHaveBeenCalledWith("enrollment_1");

    act(() => {
      button(messages.myEnrollments.erase)?.click();
    });

    expect(onErase).toHaveBeenCalledWith("enrollment_1");
  });

  it("avisa quando não há nenhuma inscrição", () => {
    render(<TalentBankMyEnrollments enrollments={[]} />);

    expect(text()).toContain(messages.myEnrollments.empty);
  });
});
