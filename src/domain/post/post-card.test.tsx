// @vitest-environment jsdom
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import { PostCard } from "./post-card.js";

describe("cabeçalho do card de post", () => {
  it.each([false, true])(
    "preserva autor, comunidade e controles do proprietário (fixado: %s)",
    (pinned) => {
      const host = document.createElement("div");
      host.innerHTML = renderToStaticMarkup(
        <PostCard
          post={{
            id: "post-demo",
            type: "INSIGHT",
            content: "Publicação de demonstração.",
            authorName: "Perfil de demonstração com nome comprido",
            authorAvatar: null,
            community: { name: "Comunidade de demonstração", joined: true },
            tags: [],
            mediaIds: [],
          }}
          hrefs={{ author: "/perfil/demo", post: "/post/demo", community: "/comunidades/demo" }}
          timeLabel="agora"
          topicLabel="Música"
          pinned={pinned}
          onTogglePin={vi.fn()}
          isOwner
          onEdit={vi.fn()}
          onDelete={vi.fn()}
          mySeals={[]}
          onShowSeals={vi.fn()}
          renderRichText={({ content }) => <p>{content}</p>}
          renderMediaGrid={() => null}
        />,
      );
      const header = host.querySelector("article > header");
      expect(header).not.toBeNull();
      expect(header?.textContent?.includes("Fixado")).toBe(pinned);
      expect(header?.textContent).toContain("Perfil de demonstração com nome comprido");
      expect(header?.querySelector('a[href="/perfil/demo"]')).not.toBeNull();
      expect(header?.querySelector('a[href="/comunidades/demo"]')?.textContent).toBe(
        "Comunidade de demonstração",
      );
      expect(header?.textContent).toContain("Insight");
      expect(header?.textContent).toContain("Música");
      expect(
        header?.querySelector(`button[aria-label="${pinned ? "Desafixar" : "Fixar no topo"}"]`),
      ).not.toBeNull();
      expect(header?.querySelector('button[aria-label="Ações da publicação"]')).not.toBeNull();
    },
  );

  it.each([
    [true, "Resolvida"],
    [false, "Aberta"],
  ])("mostra o status da pergunta (resolvida: %s)", (resolved, label) => {
    const html = renderToStaticMarkup(
      <PostCard
        post={{
          id: "q",
          type: "QUESTION",
          content: "Como centralizo uma div?",
          authorName: "Ana",
          authorAvatar: null,
          tags: [],
          mediaIds: [],
          resolved,
        }}
        hrefs={{ author: "/perfil/ana", post: "/post/q" }}
        timeLabel="agora"
        isOwner={false}
        mySeals={[]}
        onShowSeals={vi.fn()}
        renderRichText={({ content }) => <p>{content}</p>}
        renderMediaGrid={() => null}
      />,
    );
    expect(html).toContain("Pergunta");
    expect(html).toContain(label);
  });

  it("mostra a enquete no slot proprio e marca o tipo", () => {
    const html = renderToStaticMarkup(
      <PostCard
        post={{
          id: "p",
          type: "POLL",
          content: "Café ou chá?",
          authorName: "Ana",
          authorAvatar: null,
          tags: [],
          mediaIds: [],
        }}
        hrefs={{ author: "/perfil/ana", post: "/post/p" }}
        timeLabel="agora"
        isOwner={false}
        mySeals={[]}
        onShowSeals={vi.fn()}
        poll={
          <ul data-testid="enquete">
            {["Café", "Chá"].map((o) => (
              <li key={o}>{o}</li>
            ))}
          </ul>
        }
        renderRichText={({ content }) => <p>{content}</p>}
        renderMediaGrid={() => null}
      />,
    );
    expect(html).toContain("Enquete");
    expect(html).toContain("Café ou chá?");
    expect(html).toContain("Café");
    expect(html).toContain("Chá");
  });
});

describe("post card offscreen rendering", () => {
  const render = (virtualized: boolean) =>
    renderToStaticMarkup(
      <PostCard
        post={{
          id: "post-demo",
          type: "INSIGHT",
          content: "Publicação de demonstração.",
          authorName: "Perfil de demonstração",
          authorAvatar: null,
          tags: [],
          mediaIds: [],
        }}
        hrefs={{ author: "/perfil/demo", post: "/post/demo" }}
        timeLabel="agora"
        virtualized={virtualized}
        isOwner={false}
        mySeals={[]}
        onShowSeals={vi.fn()}
        renderRichText={({ content }) => <p>{content}</p>}
        renderMediaGrid={() => null}
      />,
    );

  it("skips offscreen paint in a plain list", () => {
    expect(render(false)).toContain("[content-visibility:auto]");
  });

  it("keeps the real height measurable in a virtualized list", () => {
    expect(render(true)).not.toContain("content-visibility");
  });
});

describe("pleca de vitrine no card de post", () => {
  it("a publicação de portfólio abre a vitrine com o resumo que o app monta", () => {
    const html = renderToStaticMarkup(
      <PostCard
        post={{
          id: "post-vitrine",
          type: "PORTFOLIO",
          content: "Minha vitrine está no ar.",
          authorName: "Ana",
          authorAvatar: null,
          tags: [],
          mediaIds: [],
        }}
        hrefs={{ author: "/perfil/ana", post: "/post/post-vitrine", portfolio: "/portfolio/ana" }}
        timeLabel="agora"
        isOwner={false}
        mySeals={[]}
        onShowSeals={vi.fn()}
        renderRichText={({ content }) => <p>{content}</p>}
        renderMediaGrid={() => null}
        portfolio={<p>Desenho e construo interfaces.</p>}
      />,
    );

    expect(html).toContain("Vitrine");
    expect(html).toContain("Desenho e construo interfaces.");
    expect(html).toContain('href="/portfolio/ana"');
    expect(html).toContain("Abrir vitrine");
  });
});
