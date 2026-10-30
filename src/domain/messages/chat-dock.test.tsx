import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ChatDockWindow } from "./chat-dock-window.js";
import { ChatDock } from "./chat-dock.js";

function renderDock(props: Partial<Parameters<typeof ChatDock>[0]> = {}) {
  return renderToStaticMarkup(
    <ChatDock
      expanded
      onToggleExpanded={() => {}}
      unreadCount={0}
      empty={false}
      hasMore={false}
      loadingMore={false}
      onLoadMore={() => {}}
      {...props}
    />,
  );
}

describe("ChatDock", () => {
  it("mostra o aviso de lista vazia", () => {
    expect(renderDock({ empty: true })).toContain("Nenhuma conversa ainda.");
  });

  it("limita o selo de não lidas em 99+", () => {
    expect(renderDock({ unreadCount: 150 })).toContain("99+");
    expect(renderDock({ unreadCount: 0 })).not.toContain("99+");
  });

  it("tem um título só e diz qual caixa está aberta", () => {
    const html = renderDock({ contextLabel: "Profissional" });
    expect(html.match(/>Mensagens</g)).toHaveLength(1);
    expect(html).toContain("Profissional");
  });

  it("colapsado, esconde a lista", () => {
    expect(renderDock({ expanded: false, empty: true })).not.toContain("Nenhuma conversa ainda.");
  });
});

describe("ChatDockWindow", () => {
  it("carregando, mostra a moldura com o aviso no lugar do filão", () => {
    const html = renderToStaticMarkup(
      <ChatDockWindow loading onClose={() => {}}>
        <p>filão</p>
      </ChatDockWindow>,
    );
    expect(html).toContain("Carregando…");
    expect(html).not.toContain("filão");
  });
});
