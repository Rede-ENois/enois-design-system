export type ConversationsMessages = {
  conversationHeader: { back: string; conversationFallback: string };
  conversationItem: { conversationFallback: string };
  chatDock: {
    title: string;
    collapse: string;
    empty: string;
    loading: string;
    loadMore: string;
    loadingMore: string;
    close: string;
  };
  messageBubble: {
    readReceiptSent: string;
    readReceiptRead: string;
    react: string;
    report: string;
    reply: string;
  };
  e2eSetupBanner: {
    prompt: string;
    activate: string;
    loading: string;
    passwordPrompt: string;
    passwordPlaceholder: string;
    passwordError: string;
    definePrompt: string;
    newPasswordPlaceholder: string;
    confirmPasswordPlaceholder: string;
    defineAction: string;
    defineError: string;
    validationMinLength: string;
    validationMismatch: string;
  };
  conversationThread: {
    selectMessages: string;
    selectedMessages: (count: number) => string;
    deleteSelectedMessages: (count: number) => string;
    /** Aviso do gate E2E: sem a chave a conversa não abre. */
    e2eRequired: string;
    cancelSelection: string;
    noMessages: string;
    loadOlderMessages: string;
    loadingOlder: string;
    replyingTo: (name: string) => string;
    cancelReply: string;
    inputPlaceholder: string;
    send: string;
    attachMedia: string;
    removeMedia: string;
    mediaLimit: string;
    mediaError: string;
    mediaSpoiler: string;
    mediaSpoilerActive: string;
    mediaSpoilerBadge: string;
    attachService: string;
    attachServiceTitle: string;
    attachServiceHint: string;
    serviceAttachment: string;
    noServices: string;
    emoji: string;
  };
};
