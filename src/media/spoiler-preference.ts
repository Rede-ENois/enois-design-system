import { createContext, useContext } from "react";

/**
 * Preferência de quem lê sobre mídia sensível: quando `true`, o véu não é aplicado — fotos e
 * vídeos marcados como sensíveis nascem revelados no feed, no perfil e na colagem. O padrão é
 * `false` (tudo velado até o clique no "revelar"); o valor vem do EnoisProvider.
 */
export const SpoilerPreferenceContext = createContext(false);

export function useSpoilerPreference(): boolean {
  return useContext(SpoilerPreferenceContext);
}
