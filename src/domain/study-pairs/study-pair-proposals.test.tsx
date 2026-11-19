// @vitest-environment jsdom
import { act, useState } from "react";

import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";

import type { StudyPairIcebreakerField } from "../../types/domain/study-pairs/study-pair-icebreaker-field.js";
import type { StudyPairProposal } from "../../types/domain/study-pairs/study-pair-proposal.js";
import type { StudyPairProposalsProps } from "../../types/domain/study-pairs/study-pair-proposals-props.js";

import { StudyPairProposals } from "./study-pair-proposals.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const container = document.createElement("div");
document.body.append(container);
const root = createRoot(container);

afterEach(() => act(() => root.render(null)));

const fields: StudyPairIcebreakerField[] = [
  { id: "why_now", question: "Por que esse objetivo agora?", required: true, options: [] },
  {
    id: "weekly_time",
    question: "Quanto tempo por semana?",
    required: false,
    options: ["Até 1 hora", "2 a 3 horas"],
  },
];

const proposal: StudyPairProposal = {
  id: "sp1",
  goal: "Aprender Rust",
  partner: { id: "u2", username: "ada", name: "Ada", href: "/u/ada" },
  myAccepted: false,
  partnerAccepted: false,
  partnerIcebreaker: null,
  deadlineLabel: "26 nov",
};

function Harness(props: Partial<StudyPairProposalsProps>) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  return (
    <StudyPairProposals
      proposals={[proposal]}
      fields={fields}
      onAccept={(id, answers) => setErrors({ [id]: JSON.stringify(answers) })}
      onDecline={(id) => setErrors({ [id]: `recusou ${id}` })}
      errors={errors}
      {...props}
    />
  );
}

function render(props: Partial<StudyPairProposalsProps> = {}) {
  act(() => root.render(<Harness {...props} />));
}

const text = () => container.textContent ?? "";
const button = (label: string) =>
  [...container.querySelectorAll("button")].find((b) => b.textContent?.trim() === label);

describe("StudyPairProposals", () => {
  it("sem propostas não renderiza nada", () => {
    render({ proposals: [] });
    expect(text()).toBe("");
  });

  it("mostra o parceiro, o prazo e o estado do aceite", () => {
    render();
    expect(text()).toContain("Ada");
    expect(text()).toContain("@ada");
    expect(text()).toContain("Aprender Rust");
    expect(text()).toContain("Até 26 nov para responder");
    expect(text()).toContain("Ainda não aceitou.");
  });

  it("exige a resposta obrigatória antes de aceitar", () => {
    render();
    act(() => button("Aceitar")!.click());
    expect(text()).toContain("Responda a pergunta obrigatória para aceitar.");
    expect(text()).not.toContain('{"why_now"');
  });

  it("aceita com as respostas do quebra-gelo", () => {
    render();
    const texto = container.querySelector<HTMLTextAreaElement>("textarea")!;
    act(() => {
      const setter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value")!.set!;
      setter.call(texto, "Quero virar dev de sistemas");
      texto.dispatchEvent(new Event("input", { bubbles: true }));
    });
    act(() => button("2 a 3 horas")!.click());
    act(() => button("Aceitar")!.click());
    expect(text()).toContain(
      JSON.stringify({ why_now: "Quero virar dev de sistemas", weekly_time: "2 a 3 horas" }),
    );
  });

  it("recusa pelo id da proposta", () => {
    render();
    act(() => button("Recusar")!.click());
    expect(text()).toContain("recusou sp1");
  });

  it("depois do meu aceite não mostra o formulário nem o botão", () => {
    render({ proposals: [{ ...proposal, myAccepted: true }] });
    expect(text()).toContain("Falta o aceite da outra pessoa");
    expect(container.querySelector("textarea")).toBeNull();
  });

  it("mostra o quebra-gelo da outra pessoa quando ele chega", () => {
    render({
      proposals: [
        { ...proposal, partnerAccepted: true, partnerIcebreaker: { why_now: "Trocar de área" } },
      ],
    });
    expect(text()).toContain("Já aceitou");
    expect(text()).toContain("O quebra-gelo de Ada");
    expect(text()).toContain("Trocar de área");
    expect(text()).toContain("Sem resposta.");
  });
});
