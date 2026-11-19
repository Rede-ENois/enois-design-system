/**
 * Textos das views dos Desafios (o espaço de convites do Explorar). Tom de convocar: alguém
 * propõe, todo mundo pode responder, e o encerramento reconhece uma resposta — sem pontos,
 * sem ranking, sem prêmio. A autoria é nominal (diferente dos Desabafos e do Confessionário);
 * a torcida é contada, nunca nominada.
 */
export type DesafiosMessages = {
  desafiosFeed: {
    loading: string;
    error: string;
    empty: string;
    loadMore: string;
  };
  desafiosComposer: {
    titlePlaceholder: string;
    titleAria: string;
    descriptionPlaceholder: string;
    descriptionAria: string;
    deadlineLabel: string;
    deadlineHint: string;
    publish: string;
    publishing: string;
    needTitle: string;
    needDescription: string;
  };
  desafiosCard: {
    open: string;
    participacoes: (count: number) => string;
    closesAt: (quando: string) => string;
    noDeadline: string;
    closed: string;
    encerrar: string;
    remove: string;
    report: string;
  };
  desafiosParticipacoes: {
    title: string;
    loading: string;
    error: string;
    empty: string;
    placeholder: string;
    send: string;
    sending: string;
    needText: string;
    cheer: string;
    uncheer: string;
    cheers: (count: number) => string;
    remove: string;
    closedMural: string;
    encerrar: string;
    encerrarHint: string;
    escolherDestaque: string;
    destaqueEscolhido: string;
    encerrando: string;
  };
};
