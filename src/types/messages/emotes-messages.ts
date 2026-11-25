/** Textos do seletor de figurinhas (o mesmo em todo campo de escrita). */
export type EmotesMessages = {
  emotePickerDialog: {
    title: string;
    /** Rótulo padrão do botão que abre o seletor. */
    trigger: string;
    searchPlaceholder: string;
    tabRecent: string;
    tabEnois: string;
    /** Figurinhas de provedores externos (BetterTTV, FrankerFaceZ): a origem "de terceiros". */
    tabThirdParty: string;
    loading: string;
    empty: string;
    error: string;
    hint: string;
    count: (total: number) => string;
    page: (page: number, totalPages: number) => string;
    previous: string;
    next: string;
    /** Dica do gesto de segurar (title da célula e de quem abre as ações por teclado). */
    holdHint: string;
  };
  /** Ações de uma figurinha segurada no seletor (denunciar, banir). */
  emoteActionDialog: {
    title: string;
    description: string;
    report: string;
    reportDone: string;
    /** Quantas contas já denunciaram e quantas tiram a figurinha do ar. */
    reports: (denunciantes: number, limiar: number) => string;
    ban: string;
    unban: string;
    banned: string;
    reasonLabel: string;
    reasonPlaceholder: string;
    reasonRequired: string;
    cancel: string;
    error: string;
    /** Figurinha do pacote É Nóis: o diálogo abre só para dizer que ela é protegida. */
    official: string;
  };
};
