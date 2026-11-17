import type { ComposerMediaDraft } from "../post/composer-media-draft.js";

import type { ColagemPublishInput } from "./colagem-publish-input.js";

export type ColagemComposerProps = {
  /**
   * O anexo escolhido (preview + mediaId depois do upload). Conferir e subir é trabalho do app:
   * o compositor só desenha o rascunho e recolhe os arquivos.
   */
  attachment: ComposerMediaDraft | null;
  onFiles: (files: File[]) => void;
  onRemoveAttachment: () => void;
  /**
   * Publica e devolve a promessa do resultado: resolve, o compositor limpa texto e véu; rejeita,
   * o rascunho fica de pé para a pessoa corrigir sem redigir de novo.
   */
  onPublish: (input: ColagemPublishInput) => Promise<void>;
};
