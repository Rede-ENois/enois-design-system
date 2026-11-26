// @vitest-environment jsdom
import { act } from "react";

import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";

import { PortfolioCard } from "./portfolio-card.js";
import { PortfolioEntryCard } from "./portfolio-entry-card.js";
import { PortfolioExploreError } from "./portfolio-explore-error.js";
import { PortfolioExploreSection } from "./portfolio-explore-section.js";
import { PortfolioPointer } from "./portfolio-pointer.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const container = document.createElement("div");
document.body.append(container);
const root = createRoot(container);

afterEach(() => act(() => root.render(null)));

describe("card de vitrine", () => {
  it("sem vitrine publicada, convida a montar a própria e leva ao editor", () => {
    act(() => root.render(<PortfolioCard card={null} editorHref="/portfolio/editar" />));

    expect(container.textContent).toContain("Sua vitrine");
    expect(container.textContent).toContain("Publique a sua página e as peças do seu trabalho.");
    expect(container.textContent).toContain("Editar minha vitrine");
    expect(container.querySelector('a[href="/portfolio/editar"]')).not.toBeNull();
  });

  it("com vitrine publicada, mostra a primeira frase e abre a página", () => {
    act(() =>
      root.render(
        <PortfolioCard
          card={{
            username: "ana",
            name: "Ana",
            avatarUrl: "https://cdn.exemplo/ana.jpg",
            headline: "Desenho e construo interfaces.",
            href: "/portfolio/ana",
          }}
          editorHref="/portfolio/editar"
        />,
      ),
    );

    expect(container.textContent).toContain("Desenho e construo interfaces.");
    expect(container.textContent).toContain("Abrir vitrine");
    expect(container.textContent).not.toContain("Editar minha vitrine");
    // O avatar é o de quem publicou: sem foto, o fallback mostra as iniciais do nome.
    expect(container.querySelector(".rounded-full")?.textContent).toBe("A");
    expect(container.querySelector('a[href="/portfolio/ana"]')).not.toBeNull();
  });

  it("vitrine sem texto usa o texto de convite no lugar da primeira frase", () => {
    act(() =>
      root.render(
        <PortfolioCard
          card={{
            username: "ana",
            name: "Ana",
            avatarUrl: null,
            headline: null,
            href: "/portfolio/ana",
          }}
          editorHref="/portfolio/editar"
        />,
      ),
    );

    expect(container.textContent).toContain("Publique a sua página e as peças do seu trabalho.");
  });
});

describe("entrada de vitrine no feed", () => {
  it("sem vitrine publicada, mostra o convite para o editor", () => {
    act(() => root.render(<PortfolioEntryCard mine={null} editorHref="/portfolio/editar" />));

    expect(container.textContent).toContain("Editar minha vitrine");
    expect(container.querySelector('a[href="/portfolio/editar"]')).not.toBeNull();
  });
});

describe("seção de vitrines no Explorar", () => {
  it("mostra a própria vitrine primeiro e as demais ao lado, antes das outras seções", () => {
    act(() =>
      root.render(
        <PortfolioExploreSection
          mine={null}
          cards={[
            {
              username: "bia",
              name: "Bia",
              avatarUrl: null,
              headline: "Ilustração e cerâmica.",
              href: "/portfolio/bia",
            },
          ]}
          editorHref="/portfolio/editar"
        >
          <p>Outras salas</p>
        </PortfolioExploreSection>,
      ),
    );

    expect(container.querySelector("#explorar-vitrines")?.textContent).toContain(
      "Vitrines da comunidade",
    );
    expect(container.textContent).toContain("Editar minha vitrine");
    expect(container.textContent).toContain("Ilustração e cerâmica.");
    expect(container.textContent).toContain("Outras salas");
    expect(container.querySelector('a[href="/portfolio/bia"]')).not.toBeNull();
  });
});

describe("vitrine como post-porta", () => {
  it("mostra o título publicado, a primeira frase e leva à vitrine", () => {
    const onNavigate = vi.fn();
    act(() =>
      root.render(
        <PortfolioPointer
          name="Ana"
          avatarUrl={null}
          title="Ana Souza"
          headline="Desenho e construo interfaces."
          href="/portfolio/ana"
          onNavigate={onNavigate}
        />,
      ),
    );

    expect(container.textContent).toContain("Ana Souza");
    expect(container.textContent).toContain("Desenho e construo interfaces.");
    const link = container.querySelector('a[href="/portfolio/ana"]');
    expect(link).not.toBeNull();
    act(() => (link as HTMLAnchorElement).click());
    expect(onNavigate).toHaveBeenCalledOnce();
  });

  it("sem título publicado usa o nome", () => {
    act(() =>
      root.render(
        <PortfolioPointer
          name="Ana"
          avatarUrl={null}
          title={null}
          headline={null}
          href="/portfolio/ana"
        />,
      ),
    );

    expect(container.textContent).toContain("Ana");
    expect(container.querySelector(".animate-pulse")).toBeNull();
  });

  it("enquanto a vitrine chega, o quadro fica em espera sem link", () => {
    act(() =>
      root.render(
        <PortfolioPointer
          name="Ana"
          avatarUrl={null}
          headline={null}
          href="/portfolio/ana"
          loading
        />,
      ),
    );

    expect(container.querySelector(".animate-pulse")).not.toBeNull();
    expect(container.querySelector("a")).toBeNull();
  });
});

describe("falha de leitura da própria vitrine", () => {
  it("avisa e oferece tentar de novo", () => {
    const onRetry = vi.fn();
    act(() =>
      root.render(
        <PortfolioExploreError
          message="Não foi possível carregar sua vitrine."
          retryLabel="Tentar de novo"
          onRetry={onRetry}
        />,
      ),
    );

    expect(container.textContent).toContain("Não foi possível carregar sua vitrine.");
    act(() => (container.querySelector("button") as HTMLButtonElement).click());
    expect(onRetry).toHaveBeenCalledOnce();
  });
});
