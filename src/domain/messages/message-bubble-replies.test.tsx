// @vitest-environment jsdom
import { type ComponentProps, act } from "react";

import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";

import { MessageBubble } from "./message-bubble.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const container = document.createElement("div");
document.body.append(container);
const root = createRoot(container);

function renderBubble(extra: Partial<ComponentProps<typeof MessageBubble>> = {}) {
  act(() =>
    root.render(
      <MessageBubble
        message={{}}
        isMe={false}
        profileHref="/perfil/pessoa-ficticia"
        timeLabel="10:00"
        emojis={{}}
        replyQuote={{ from: "Pessoa fictícia", text: "Mensagem original", isMe: false }}
        {...extra}
      />,
    ),
  );
}

afterEach(() => act(() => root.render(null)));

describe("MessageBubble reply navigation", () => {
  it("exposes an identified message as a programmatic focus target outside the tab order", () => {
    renderBubble({ message: { id: "original:synthetic" } });

    const target = document.getElementById("message-original:synthetic");
    expect(target).not.toBeNull();
    expect(target).toBe(container.firstElementChild);
    expect(target?.tabIndex).toBe(-1);
    target?.focus();
    expect(document.activeElement).toBe(target);
  });

  it("offers a named native button and invokes only the quote callback on click", () => {
    const onReplyQuoteClick = vi.fn();
    const onToggleSelect = vi.fn();
    renderBubble({ onReplyQuoteClick, onToggleSelect });

    const quote = container.querySelector<HTMLButtonElement>(
      'button[aria-label="Ir para mensagem original"]',
    );
    expect(quote).not.toBeNull();
    expect(quote?.type).toBe("button");
    expect(quote?.textContent).toContain("Pessoa fictícia");
    expect(quote?.textContent).toContain("Mensagem original");
    act(() => quote?.click());
    expect(onReplyQuoteClick).toHaveBeenCalledOnce();
    expect(onToggleSelect).not.toHaveBeenCalled();
  });

  it("preserves a non-interactive quote when the callback is absent", () => {
    renderBubble();
    const quote = container.querySelector(".border-l-2");
    expect(quote?.tagName).toBe("DIV");
    expect(quote?.hasAttribute("aria-label")).toBe(false);
    expect(container.querySelector('[id^="message-"]')).toBeNull();
    expect(container.textContent).toContain("Mensagem original");
  });

  it("lets a quote click select the bubble instead of navigating in selection mode", () => {
    const onReplyQuoteClick = vi.fn();
    const onToggleSelect = vi.fn();
    renderBubble({ selecting: true, onReplyQuoteClick, onToggleSelect });

    const quote = container.querySelector<HTMLElement>(".border-l-2");
    expect(quote?.tagName).toBe("DIV");
    act(() => quote?.click());
    expect(onReplyQuoteClick).not.toHaveBeenCalled();
    expect(onToggleSelect).toHaveBeenCalledOnce();
  });

  it("does not add a navigation control when no quote exists", () => {
    renderBubble({ replyQuote: null, onReplyQuoteClick: vi.fn() });
    expect(container.querySelector(".border-l-2")).toBeNull();
    expect(container.querySelector('[aria-label="Ir para mensagem original"]')).toBeNull();
  });
});
