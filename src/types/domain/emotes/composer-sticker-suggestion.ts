/**
 * Uma figurinha sugerida para o `:palavra` do compositor. `origem` é o rótulo curto da origem
 * ("É Nóis", "Comunidade", "BTTV"...): o app decide o que cada uma é.
 */
export type ComposerStickerSuggestion = {
  code: string;
  /** Chave única do item (o código pode se repetir entre origens; o id não). */
  id?: string;
  nome?: string;
  src: string;
  origem: string;
};
