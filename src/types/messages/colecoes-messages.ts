/**
 * Textos das views das Coleções pessoais (pastas privadas de posts salvos). Coleção é pessoal:
 * as palavras falam com o dono — nada de "colado por", nada de vitrine.
 */
export type ColecoesMessages = {
  colecoesLista: {
    loading: string;
    error: string;
    empty: string;
    loadMore: string;
    openColecao: string;
    /** Campo de busca da lista. */
    buscarPlaceholder: string;
    /** "Nenhuma coleção com o termo \"vôlei\".": a busca foi feita e nada bateu. */
    semResultado: (termo: string) => string;
    /** Contagem curta no cartão: "3 posts". */
    posts: (count: number) => string;
  };
  colecoesFormulario: {
    criarTitulo: string;
    editarTitulo: string;
    titleLabel: string;
    titlePlaceholder: string;
    descriptionLabel: string;
    descriptionPlaceholder: string;
    salvar: string;
    salvando: string;
  };
  colecoesQuadro: {
    /** "3 posts guardados" no cabeçalho da pasta. */
    posts: (count: number) => string;
    editar: string;
    remover: string;
    removerConfirmTitle: string;
    removerConfirmBody: string;
    guardarPlaceholder: string;
    guardar: string;
    guardando: string;
    /** Faixa com as publicações da pasta. */
    guardados: string;
    vazio: string;
    /** "guardado em 12 nov." no cartão do post. */
    guardadoEm: (dia: string) => string;
    tirar: string;
    tirarConfirmTitle: string;
    tirarConfirmBody: string;
  };
};
