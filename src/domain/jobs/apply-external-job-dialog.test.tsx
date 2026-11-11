// @vitest-environment jsdom
import { act } from "react";

import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { ApplyExternalJobDialogProps } from "../../types/domain/jobs/apply-external-job-dialog-props.js";
import type { ExternalApplicationDraft } from "../../types/domain/jobs/external-application-draft.js";
import type { ExternalApplicationResult } from "../../types/domain/jobs/external-application-result.js";
import { Button } from "../../ui/button.js";

import { ApplyExternalJobDialog } from "./apply-external-job-dialog.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const container = document.createElement("div");
document.body.append(container);
const root = createRoot(container);

afterEach(() => {
  act(() => root.render(null));
  // O diálogo é portalado para o body: limpar entre testes evita que o conteúdo de um vaze no outro.
  document.querySelectorAll('[role="dialog"]').forEach((node) => node.remove());
});

const draft: ExternalApplicationDraft = {
  recipientEmail: "vagas@empresa.com",
  subject: "Candidatura — Pessoa Dev Java (ID 42)",
  body: "Olá! Me chamo Mel e tenho interesse na vaga.",
  resumeAvailable: true,
  resumeName: "curriculo.pdf",
  jobTitle: "Pessoa Dev Java",
  company: "Empresa",
  jobUrl: "https://exemplo.com/vaga/42",
};

const baseProps: ApplyExternalJobDialogProps = {
  children: <Button>Candidatar-se</Button>,
  onOpenChange: () => {},
  draft: null,
  loading: false,
  loadError: null,
  pending: false,
  error: null,
  result: null,
  onConfirm: () => {},
  onOpenMailClient: () => {},
  onRetry: () => {},
};

/** Monta o diálogo e abre pelo gatilho, como a pessoa faria. */
async function open(props: Partial<ApplyExternalJobDialogProps> = {}) {
  act(() => root.render(<ApplyExternalJobDialog {...baseProps} {...props} />));
  const trigger = container.querySelector("button");
  if (!trigger) throw new Error("trigger missing");
  await act(async () => trigger.click());
}

function dialogText(): string {
  return document.querySelector('[role="dialog"]')?.textContent ?? "";
}

function buttonByText(label: string): HTMLButtonElement {
  const found = [...document.querySelectorAll<HTMLButtonElement>('[role="dialog"] button')].find(
    (button) => button.textContent === label,
  );
  if (!found) throw new Error(`button "${label}" missing`);
  return found;
}

describe("ApplyExternalJobDialog", () => {
  it("shows the server draft with recipient, subject and body", async () => {
    await open({ draft });
    const text = dialogText();
    expect(text).toContain("vagas@empresa.com");
    expect(text).toContain("Candidatura — Pessoa Dev Java (ID 42)");
    expect(text).toContain("Olá! Me chamo Mel");
  });

  it("never sends on open: the confirm click is the only path", async () => {
    const onConfirm = vi.fn();
    await open({ draft, onConfirm });
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("sends the optional message on confirm", async () => {
    const onConfirm = vi.fn();
    await open({ draft, onConfirm });
    const textarea = document.querySelector<HTMLTextAreaElement>(
      '[role="dialog"] textarea:not([readonly])',
    );
    if (!textarea) throw new Error("message textarea missing");
    // React 19 rastreia o valor pelo setter nativo: atribuir `.value` direto não dispara o onChange.
    const setValue = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value")?.set;
    await act(async () => {
      setValue?.call(textarea, "Tenho 6 anos de Java.");
      textarea.dispatchEvent(new Event("input", { bubbles: true }));
    });
    await act(async () => buttonByText("Confirmar e enviar").click());
    expect(onConfirm).toHaveBeenCalledWith("Tenho 6 anos de Java.");
  });

  it("says when the resume is really attached", async () => {
    await open({ draft });
    expect(dialogText()).toContain("Currículo anexado: curriculo.pdf");
  });

  it("warns honestly when the profile has no resume", async () => {
    await open({ draft: { ...draft, resumeAvailable: false, resumeName: null } });
    const text = dialogText();
    expect(text).toContain("Sem currículo no perfil");
    expect(text).toContain("sai sem anexo");
  });

  it("reports honestly when the email went out without the attachment", async () => {
    const result: ExternalApplicationResult = {
      recipientEmail: "vagas@empresa.com",
      subject: "Candidatura — Pessoa Dev Java",
      resumeAttached: false,
      resumeName: null,
      status: "SENT",
      appliedAt: "2026-11-10T12:00:00Z",
    };
    await open({ draft, result });
    const text = dialogText();
    expect(text).toContain("sem o currículo");
    expect(text).not.toContain("Currículo anexado");
  });

  it("confirms the attachment in the receipt when it really went", async () => {
    const result: ExternalApplicationResult = {
      recipientEmail: "vagas@empresa.com",
      subject: "Candidatura — Pessoa Dev Java",
      resumeAttached: true,
      resumeName: "curriculo.pdf",
      status: "SENT",
      appliedAt: "2026-11-10T12:00:00Z",
    };
    await open({ draft, result });
    expect(dialogText()).toContain("com o currículo anexado (curriculo.pdf)");
  });

  it("shows the retry path when the draft fails to load", async () => {
    const onRetry = vi.fn();
    await open({ loadError: "Não foi possível preparar a candidatura.", onRetry });
    expect(dialogText()).toContain("Não foi possível preparar a candidatura.");
    await act(async () => buttonByText("Tentar de novo").click());
    expect(onRetry).toHaveBeenCalled();
  });

  it("offers the mail client as an alternative", async () => {
    const onOpenMailClient = vi.fn();
    await open({ draft, onOpenMailClient });
    expect(dialogText()).toContain("Abrir no meu e-mail");
    await act(async () => buttonByText("Abrir no meu e-mail").click());
    expect(onOpenMailClient).toHaveBeenCalled();
  });

  it("shows the loading state while the draft is being prepared", async () => {
    await open({ loading: true });
    expect(dialogText()).toContain("Preparando a candidatura");
  });
});
