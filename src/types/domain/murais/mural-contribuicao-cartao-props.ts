import type { ReactNode } from "react";

import type { MuralContribuicaoInfo } from "./mural-contribuicao-info.js";

export type MuralContribuicaoCartaoProps = {
  info: MuralContribuicaoInfo;
  /** Quem colou ou o dono do mural pode tirar a publicação do quadro. */
  podeRemover: boolean;
  onRemover: () => void;
  /** A publicação do feed, desenhada por quem compõe (o card de sempre). */
  children: ReactNode;
};
