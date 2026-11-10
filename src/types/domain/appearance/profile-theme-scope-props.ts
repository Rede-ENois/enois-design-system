import type { ReactNode } from "react";

import type { ProfileLook } from "../../lib/theme/profile-look.js";
import type { Theme } from "../../lib/theme/theme.js";

export type ProfileThemeScopeProps = {
  /** Aparência escolhida pelo dono do perfil; sem tema, nada é aplicado. */
  look: ProfileLook | null | undefined;
  /** Modo atual do app: o preset pode trocar os dois conjuntos de tokens. */
  mode: Theme;
  children: ReactNode;
  className?: string;
};
