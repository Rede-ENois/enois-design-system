/** Um rascunho de artigo como a lista do servidor o devolve ao view (dados via props, sem rede). */
export type ContinueWritingDraft = {
  id: string;
  /** Title as typed by the author (the composer stores it as the draft's content line). */
  title: string;
  /** When this draft was last saved, already formatted by the app — content, not microcopy. */
  updatedAtLabel: string;
};
