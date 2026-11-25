/**
 * Uma figurinha sugerida para o `:palavra` do compositor. `origem` é o rótulo curto da origem
 * ("É Nóis", "Comunidade", "BTTV"...): o app decide o que cada uma é.
 */
export type ComposerStickerSuggestion = {
  code: string;
  nome?: string;
  src: string;
  origem: string;
};
