// @vitest-environment jsdom
import { act } from "react";

import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { defaultMessages } from "../../messages/default-messages.js";
import type { CalendarEntryDetailData } from "../../types/domain/calendar/calendar-entry-detail-data.js";
import type { CalendarEntryDetailProps } from "../../types/domain/calendar/calendar-entry-detail-props.js";

import { CalendarEntryDetail } from "./calendar-entry-detail.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const messages = defaultMessages.calendar;
const detail = messages.detail;
const SP = "America/Sao_Paulo";

const entry: CalendarEntryDetailData = {
  id: "cal_1",
  scope: "PROFESSIONAL",
  kind: "MEETING",
  title: "Revisão do trimestre",
  description: "Trazer os números do mês.",
  day: "2026-11-10",
  start: "10:00",
  end: "11:00",
  timeZoneId: SP,
  allDay: false,
  cancelledAt: null,
};

let host: HTMLDivElement;
let root: Root;

const render = (props: Partial<CalendarEntryDetailProps> = {}) => {
  act(() =>
    root.render(
      <CalendarEntryDetail
        entry={entry}
        owner
        participation={null}
        participants={null}
        backLabel="Voltar"
        onBack={() => {}}
        {...props}
      />,
    ),
  );
  return host;
};

const text = () => document.body.textContent ?? "";

const button = (label: string) =>
  [...document.body.querySelectorAll("button")].find(
    (element) => element.textContent?.trim() === label,
  ) as HTMLButtonElement | undefined;

const click = (element: Element | undefined) => {
  act(() => element?.dispatchEvent(new MouseEvent("click", { bubbles: true })));
};

const type = (element: HTMLInputElement, value: string) => {
  act(() => {
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
    setter?.call(element, value);
    element.dispatchEvent(new Event("input", { bubbles: true }));
  });
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

describe("detalhe do compromisso", () => {
  it("mostra título, horário no fuso do compromisso e descrição", () => {
    render();

    expect(text()).toContain("Revisão do trimestre");
    expect(text()).toContain(detail.when("10:00", "11:00"));
    expect(text()).toContain(detail.zoneHint(SP));
    expect(text()).toContain("Trazer os números do mês.");
    expect(text()).toContain(messages.kinds.MEETING);
    expect(text()).toContain(messages.scopes.PROFESSIONAL);
  });

  it("compromisso de dia inteiro não inventa horário", () => {
    render({ entry: { ...entry, allDay: true, start: null, end: null } });

    expect(text()).toContain(detail.whenAllDay);
    expect(text()).not.toContain(detail.when("10:00", "11:00"));
  });

  it("sem descrição diz que não há, em vez de deixar um vazio", () => {
    render({ entry: { ...entry, description: null } });

    expect(text()).toContain(detail.descriptionEmpty);
  });

  it("cancelado mostra a marca e esconde editar, cancelar e responder", () => {
    const onEdit = vi.fn();
    const onCancel = vi.fn();
    const onRespond = vi.fn();
    render({
      entry: { ...entry, cancelledAt: "2026-11-09T12:00:00Z" },
      owner: false,
      participation: "INVITED",
      onEdit,
      onCancel,
      onRespond,
    });

    expect(text()).toContain(detail.cancelledAt);
    expect(button(detail.edit)).toBeUndefined();
    expect(button(detail.cancel)).toBeUndefined();
    expect(button(messages.accept)).toBeUndefined();
  });

  it("o organizador vê os convidados com o estado de cada um", () => {
    render({
      participants: [
        { id: "p1", username: "ana", state: "ACCEPTED" },
        { id: "p2", username: "bia", state: "INVITED" },
      ],
    });

    expect(text()).toContain(detail.participantsTitle(2));
    expect(text()).toContain("@ana");
    expect(text()).toContain("@bia");
    expect(text()).toContain(messages.participations.ACCEPTED);
    expect(text()).toContain(messages.participations.INVITED);
  });

  it("o convidado não vê a lista de participantes", () => {
    // O servidor manda `null` para quem não organiza; o componente não pode inventar a lista.
    render({ owner: false, participation: "ACCEPTED", participants: null });

    expect(text()).not.toContain(detail.participantsTitle(0));
    expect(document.body.querySelector("form")).toBeNull();
  });

  it("quem não organiza pode responder, e a ação chega ao app", () => {
    const onRespond = vi.fn();
    render({ owner: false, participation: "INVITED", onRespond });

    click(button(messages.accept));

    expect(onRespond).toHaveBeenCalledWith("ACCEPTED");
  });

  it("a resposta já dada aparece escrita", () => {
    render({ owner: false, participation: "TENTATIVE", onRespond: () => {} });

    expect(text()).toContain(messages.participations.TENTATIVE);
  });

  it("editar e cancelar chamam o app", () => {
    const onEdit = vi.fn();
    const onCancel = vi.fn();
    render({ onEdit, onCancel });

    click(button(detail.edit));
    click(button(detail.cancel));

    expect(onEdit).toHaveBeenCalled();
    expect(onCancel).toHaveBeenCalled();
  });

  it("convidar pelo @ só limpa o campo quando o servidor aceitou", async () => {
    const onInvite = vi.fn(async () => false);
    render({ participants: [], onInvite });

    const field = document.body.querySelector("input") as HTMLInputElement;
    type(field, "@ana");
    await act(async () => {
      click(button(detail.inviteAction));
    });

    expect(onInvite).toHaveBeenCalledWith("ana");
    // Recusa mantém o que foi digitado, para a pessoa corrigir.
    expect(field.value).toBe("@ana");
  });

  it("convite aceito limpa o campo e confirma o @", async () => {
    const onInvite = vi.fn(async () => true);
    render({ participants: [], onInvite });

    const field = document.body.querySelector("input") as HTMLInputElement;
    type(field, "ana");
    await act(async () => {
      click(button(detail.inviteAction));
    });

    expect(field.value).toBe("");
    expect(text()).toContain(detail.invitedOk("ana"));
  });

  it("erro do servidor aparece na tela", () => {
    render({ error: "Não deu para salvar." });

    expect(text()).toContain("Não deu para salvar.");
  });
});

describe("detalhe do compromisso — lembrete", () => {
  it("desenha o lembrete que o app manda, na própria caixa", () => {
    render({ reminder: <strong>aviso em 15 min</strong> });

    expect(text()).toContain("aviso em 15 min");
  });

  it("sem lembrete do app, não sobra seção vazia", () => {
    render();
    const withoutReminder = document.body.querySelectorAll("section").length;

    render({ reminder: <strong>aviso em 15 min</strong> });

    // O slot acrescenta exatamente uma caixa; sem ele, nenhuma.
    expect(document.body.querySelectorAll("section").length).toBe(withoutReminder + 1);
  });

  it("compromisso cancelado esconde o lembrete", () => {
    render({
      reminder: <strong>aviso em 15 min</strong>,
      entry: { ...entry, cancelledAt: "2026-11-09T00:00:00Z" },
    });

    expect(text()).not.toContain("aviso em 15 min");
  });
});
