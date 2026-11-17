/**
 * Textos das views da Colagem (o mural fotográfico do Explorar). O app orquestra dados e
 * avisos; o que é desenhado aqui tem palavra aqui.
 */
export type ColagemMessages = {
  colagemComposer: {
    title: string;
    hint: string;
    addPhoto: string;
    caption: string;
    captionPlaceholder: string;
    spoiler: string;
    publish: string;
    publishing: string;
    needPhoto: string;
  };
  colagemGrid: {
    loading: string;
    error: string;
    empty: string;
    loadMore: string;
    openPhoto: string;
    revealPhoto: string;
  };
  colagemDialog: {
    title: string;
    close: string;
    loading: string;
    missingPhoto: string;
    removePhoto: string;
    removeConfirmTitle: string;
    removeConfirmBody: string;
    removeError: string;
    react: string;
    author: string;
  };
  colagemComments: {
    title: (count: number) => string;
    empty: string;
    loading: string;
    error: string;
    placeholder: string;
    replyPlaceholder: (name: string) => string;
    reply: string;
    cancelReply: string;
    replyNeedsText: string;
    photoInComment: string;
    photoBlockedOnReply: string;
    revealPhoto: string;
    send: string;
    sending: string;
    removeComment: string;
  };
};
