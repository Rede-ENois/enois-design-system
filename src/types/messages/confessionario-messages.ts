/**
 * Textos das views do Confessionário (o espaço de histórias do Explorar). Tom de contar:
 * experiências, situações constrangedoras, confissões — diferente dos Desabafos (que acolhem o
 * que dói). Sem ranking e sem competição; o anonimato é do contrato.
 */
export type ConfessionarioMessages = {
  confessionarioFeed: {
    loading: string;
    error: string;
    empty: string;
    loadMore: string;
  };
  confessionarioComposer: {
    hint: string;
    placeholder: string;
    publish: string;
    publishing: string;
    needText: string;
  };
  confessionarioCard: {
    anonymous: string;
    comments: (count: number) => string;
    reactLaugh: string;
    reactWow: string;
    reactSupport: string;
    remove: string;
    report: string;
  };
  confessionarioComments: {
    anonymous: string;
    empty: string;
    loading: string;
    error: string;
    placeholder: string;
    send: string;
    sending: string;
    remove: string;
  };
};
