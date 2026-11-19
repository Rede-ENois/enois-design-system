/** Textos do seletor de figurinhas (o mesmo em todo campo de escrita). */
export type EmotesMessages = {
  emotePickerDialog: {
    title: string;
    /** Rótulo padrão do botão que abre o seletor. */
    trigger: string;
    searchPlaceholder: string;
    tabRecent: string;
    tabEnois: string;
    tabAll: string;
    loading: string;
    empty: string;
    error: string;
    hint: string;
    count: (total: number) => string;
    page: (page: number, totalPages: number) => string;
    previous: string;
    next: string;
  };
};
