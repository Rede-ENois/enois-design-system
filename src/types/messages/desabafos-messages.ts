/**
 * Textos das views dos Desabafos (o feed acolhedor do Explorar). Palavra de acolhida: tom gentil,
 * sem urgência e sem competição — aqui não existe ranking nem contagem exibida como desempenho.
 */
export type DesabafosMessages = {
  desabafosFeed: {
    loading: string;
    error: string;
    empty: string;
    loadMore: string;
  };
  desabafosComposer: {
    hint: string;
    placeholder: string;
    publish: string;
    publishing: string;
    needText: string;
  };
  desabafosCard: {
    acolhidas: (count: number) => string;
    reactLove: string;
    reactSupport: string;
    remove: string;
    report: string;
  };
  desabafosComments: {
    empty: string;
    loading: string;
    error: string;
    placeholder: string;
    send: string;
    sending: string;
    remove: string;
  };
};
