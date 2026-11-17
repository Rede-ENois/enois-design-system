export type ComposerDraftStatusProps = {
  /** Quando o rascunho foi salvo pela última vez (ISO 8601); sem rascunho, nada é desenhado. */
  salvoEm?: string | null;
  /** Descarta o rascunho (o salvo no servidor e o que está no compositor). */
  onDescartar?: () => void;
};
