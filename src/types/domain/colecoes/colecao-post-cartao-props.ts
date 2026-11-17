import type { ReactNode } from "react";

import type { ColecaoPostInfo } from "./colecao-post-info.js";

export type ColecaoPostCartaoProps = {
  info: ColecaoPostInfo;
  onRemover: () => void;
  /** A publicação salva, desenhada por quem compõe (o card de sempre). */
  children: ReactNode;
};
