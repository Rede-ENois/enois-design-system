/**
 * Textos do diálogo de destinos do post ("adicionar ao mural" / "guardar em coleção" a partir
 * do card). O app orquestra dados; o que é desenhado aqui tem palavra aqui.
 */
export type PostDestinosMessages = {
  postDestinos: {
    title: string;
    description: string;
    /** Abas. */
    tabMurais: string;
    tabColecoes: string;
    /** Linha de cada destino: verbo + estado. */
    colar: string;
    colado: string;
    guardar: string;
    guardado: string;
    /** Contagem curta do destino: "3 publicações" / "3 publicações". */
    itens: (count: number) => string;
    loading: string;
    error: string;
    vazioMurais: string;
    vazioColecoes: string;
    /** Erro de uma tentativa específica (colar/guardar falhou). */
    acaoFalhou: string;
    fechar: string;
  };
};
