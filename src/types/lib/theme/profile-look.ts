import type { ProfileLookBorders } from "./profile-look-borders.js";
import type { ProfileLookFont } from "./profile-look-font.js";
import type { ProfileLookHeader } from "./profile-look-header.js";

/**
 * Aparência da vitrine de UM perfil (social ou profissional): o preset escolhido pelo dono
 * e os ajustes finos por cima dele.
 *
 * Espelha o documento aceito pelo backend. Todos os campos são opcionais — `null` significa
 * "não escolheu" e o perfil cai no visual da plataforma.
 */
export type ProfileLook = {
  /** Id de uma coleção do catálogo fixo (`THEME_COLLECTION_IDS`). */
  theme: string | null;
  /** Cor de destaque em hex de seis dígitos; `null` = a do preset. */
  accent: string | null;
  font: ProfileLookFont | null;
  header: ProfileLookHeader | null;
  /** `false` desliga as texturas do preset neste perfil. */
  textures: boolean | null;
  borders: ProfileLookBorders | null;
  /** 0 = sem decoração, 1 = discreta, 2 = marcante. */
  decoration: 0 | 1 | 2 | null;
};

export const EMPTY_PROFILE_LOOK: ProfileLook = {
  theme: null,
  accent: null,
  font: null,
  header: null,
  textures: null,
  borders: null,
  decoration: null,
};

/** Um perfil "veste" o preset quando escolheu um tema; sem ele não há o que aplicar. */
export function hasProfileLook(look: ProfileLook | null | undefined): boolean {
  return Boolean(look?.theme);
}
