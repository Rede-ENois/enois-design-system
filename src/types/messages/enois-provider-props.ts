import type { ReactNode } from "react";

import type { Adapters } from "../adapters/adapters.js";

import type { MessagesOverride } from "./messages-override.js";

export type EnoisProviderProps = Partial<Adapters> & {
  messages?: MessagesOverride;
  /**
   * Preferência de quem lê sobre mídia sensível: `true` nasce revelado em todo o app (feed,
   * perfil, colagem). O valor é do aplicativo — costuma vir de uma preferência salva no
   * dispositivo; o padrão é `false` (tudo velado até o clique).
   */
  revealSensitiveMedia?: boolean;
  children: ReactNode;
};
