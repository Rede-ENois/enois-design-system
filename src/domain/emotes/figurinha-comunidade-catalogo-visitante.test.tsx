import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import type { FigurinhaComunidadeCatalogoProps } from "../../types/domain/emotes/figurinha-comunidade-catalogo-props.js";

import { FigurinhaComunidadeCatalogo } from "./figurinha-comunidade-catalogo.js";

const LABELS = {
  loading: "Carregando figurinhas...",
  empty: "Nenhuma figurinha com essa busca.",
  error: "Não foi possível carregar as figurinhas agora.",
  guest: "Entre na sua conta para ver o catálogo.",
  count: (total: number) => `${total} figurinhas`,
  page: (page: number, totalPages: number) => `Página ${page} de ${totalPages}`,
  previous: "Página anterior",
  next: "Próxima página",
};

const PROPS: FigurinhaComunidadeCatalogoProps = {
  cartoes: [],
  total: null,
  termo: "",
  onTermoChange: () => {},
  page: 1,
  totalPages: 1,
  state: "guest",
  title: "Figurinhas da comunidade",
  intro: "Figurinhas enviadas por quem usa o Énóis.",
  searchPlaceholder: "Buscar por nome, código ou id",
  labels: LABELS,
  onPageChange: () => {},
  onRetry: () => {},
  retryLabel: "Tentar de novo",
};

describe("FigurinhaComunidadeCatalogo para quem não entrou", () => {
  it("mostra o convite sem pedir para tentar de novo", () => {
    const html = renderToStaticMarkup(<FigurinhaComunidadeCatalogo {...PROPS} />);

    expect(html).toContain("Entre na sua conta para ver o catálogo.");
    expect(html).not.toContain("Tentar de novo");
    expect(html).not.toContain(LABELS.error);
  });

  it("não oferece a busca nem as páginas de um catálogo que não veio", () => {
    const html = renderToStaticMarkup(<FigurinhaComunidadeCatalogo {...PROPS} />);

    expect(html).not.toContain(PROPS.searchPlaceholder);
    expect(html).not.toContain("Página anterior");
    expect(html).toContain("Figurinhas enviadas por quem usa o Énóis.");
  });

  it("erro de verdade continua com o botão de tentar de novo", () => {
    const html = renderToStaticMarkup(
      <FigurinhaComunidadeCatalogo {...PROPS} state="error" onRetry={PROPS.onRetry} />,
    );

    expect(html).toContain(LABELS.error);
    expect(html).toContain("Tentar de novo");
  });
});
