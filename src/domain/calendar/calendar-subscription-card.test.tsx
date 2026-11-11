// @vitest-environment jsdom
import { act } from "react";

import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { defaultMessages } from "../../messages/default-messages.js";
import type { CalendarSubscriptionCardProps } from "../../types/domain/calendar/calendar-subscription-card-props.js";

import { CalendarSubscriptionCard } from "./calendar-subscription-card.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const messages = defaultMessages.calendar.subscription;
const scopes = defaultMessages.calendar.scopes;

let host: HTMLDivElement;
let root: Root;

const render = (props: Partial<CalendarSubscriptionCardProps> = {}) => {
  act(() =>
    root.render(
      <CalendarSubscriptionCard
        subscription={null}
        freshUrl={null}
        scope={null}
        onScopeChange={() => {}}
        onCreate={() => {}}
        onRegenerate={() => {}}
        onRevoke={() => {}}
        onCopy={() => {}}
        {...props}
      />,
    ),
  );
  return host;
};

const text = () => document.body.textContent ?? "";

const button = (label: string) =>
  [...document.body.querySelectorAll<HTMLButtonElement>("button")].find(
    (element) => element.textContent?.trim() === label,
  );

const click = (element: Element | undefined) => {
  act(() => element?.dispatchEvent(new MouseEvent("click", { bubbles: true })));
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

describe("card da assinatura .ics", () => {
  it("sem assinatura, oferece as três agendas e o botão de criar", () => {
    render();

    expect(text()).toContain(messages.title);
    expect(text()).toContain(messages.emptyHint);
    expect(text()).toContain(messages.scopeAll);
    expect(text()).toContain(scopes.SOCIAL);
    expect(text()).toContain(scopes.PROFESSIONAL);
    expect(button(messages.create)).toBeTruthy();
  });

  it("escolher a agenda avisa o app com o escopo certo", () => {
    const onScopeChange = vi.fn();
    render({ onScopeChange });

    click(button(scopes.PROFESSIONAL));

    expect(onScopeChange).toHaveBeenCalledWith("PROFESSIONAL");
  });

  it("criar dispara a criação", () => {
    const onCreate = vi.fn();
    render({ onCreate });

    click(button(messages.create));

    expect(onCreate).toHaveBeenCalledTimes(1);
  });

  it("com link ativo, diz que o token não volta e oferece regenerar e revogar", () => {
    render({ subscription: { scope: null, createdAt: "2026-11-10T12:00:00Z" } });

    expect(text()).toContain(messages.activeTitle);
    expect(text()).toContain(messages.activeTokenGone);
    expect(text()).toContain(messages.activeSince("10 de novembro de 2026"));
    expect(button(messages.regenerate)).toBeTruthy();
    expect(button(messages.revoke)).toBeTruthy();
    // Sem token novo, não há o que copiar.
    expect(button(messages.copyLink)).toBeUndefined();
  });

  it("com link recém-criado, mostra o endereço e copia", () => {
    const onCopy = vi.fn();
    render({
      subscription: { scope: "SOCIAL", createdAt: "2026-11-10T12:00:00Z" },
      freshUrl: "https://enois.example/calendar/subscribe/abc.ics",
      onCopy,
    });

    expect(text()).toContain(messages.freshTitle);
    expect(text()).toContain("https://enois.example/calendar/subscribe/abc.ics");

    click(button(messages.copyLink));

    expect(onCopy).toHaveBeenCalledTimes(1);
  });

  it("copiado confirma sem esconder o endereço", () => {
    render({
      subscription: { scope: null, createdAt: "2026-11-10T12:00:00Z" },
      freshUrl: "https://enois.example/calendar/subscribe/abc.ics",
      copied: true,
    });

    expect(text()).toContain(messages.copied);
    expect(text()).toContain("https://enois.example/calendar/subscribe/abc.ics");
  });

  it("regenerar pede confirmação antes de matar o link atual", () => {
    const onRegenerate = vi.fn();
    render({ subscription: { scope: null, createdAt: "2026-11-10T12:00:00Z" }, onRegenerate });

    click(button(messages.regenerate));

    expect(onRegenerate).not.toHaveBeenCalled();
    expect(text()).toContain(messages.regenerateConfirmDescription);

    click(button(messages.regenerateConfirmAction));

    expect(onRegenerate).toHaveBeenCalledTimes(1);
  });

  it("revogar pede confirmação e só então revoga", () => {
    const onRevoke = vi.fn();
    render({ subscription: { scope: null, createdAt: "2026-11-10T12:00:00Z" }, onRevoke });

    click(button(messages.revoke));

    expect(onRevoke).not.toHaveBeenCalled();
    expect(text()).toContain(messages.revokeConfirmDescription);

    click(button(messages.revokeConfirmAction));

    expect(onRevoke).toHaveBeenCalledTimes(1);
  });

  it("erro do servidor aparece sem apagar o estado atual", () => {
    render({
      subscription: { scope: null, createdAt: "2026-11-10T12:00:00Z" },
      error: "Não foi possível gerar outro link.",
    });

    expect(text()).toContain("Não foi possível gerar outro link.");
    expect(text()).toContain(messages.activeTitle);
  });

  it("pendente desabilita as ações e troca o rótulo de criar", () => {
    render({ pending: true });

    expect(text()).toContain(messages.creating);
    expect(button(messages.creating)?.disabled).toBe(true);
  });
});
