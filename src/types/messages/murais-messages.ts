/**
 * Textos das views dos Murais (coleções colaborativas de publicações do Explorar). O app
 * orquestra dados e avisos; o que é desenhado aqui tem palavra aqui.
 */
export type MuraisMessages = {
  muraisLista: {
    loading: string;
    error: string;
    empty: string;
    loadMore: string;
    openMural: string;
    /** Campo de busca da lista. */
    buscarPlaceholder: string;
    /** "Nenhum mural com o termo \"vôlei\".": a busca foi feita e nada bateu. */
    semResultado: (termo: string) => string;
    /** Contagem curta no cartão: "3 publicações". */
    contributions: (count: number) => string;
  };
  muraisFormulario: {
    criarTitulo: string;
    editarTitulo: string;
    titleLabel: string;
    titlePlaceholder: string;
    descriptionLabel: string;
    descriptionPlaceholder: string;
    salvar: string;
    salvando: string;
  };
  muraisQuadro: {
    /** "3 publicações coladas" no cabeçalho do quadro. */
    contributions: (count: number) => string;
    /** "Compartilhar mural" no botão que abre o menu de quem compõe. */
    compartilhar: string;
    editar: string;
    remover: string;
    removerConfirmTitle: string;
    removerConfirmBody: string;
    colarPlaceholder: string;
    colar: string;
    colando: string;
    /** Faixa com as publicações do quadro. */
    coladas: string;
    vazio: string;
    coladoPor: (name: string) => string;
    tirar: string;
    tirarConfirmTitle: string;
    tirarConfirmBody: string;
  };
};
