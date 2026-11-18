import type { ReactNode } from "react";

export type MetaLineProps = {
  /** Contagem, página, legenda curta: a linha miúda que acompanha uma lista ou uma grade. */
  children: ReactNode;
  /** Alinhamento: `start` (padrão), `center` ou `end`. */
  align?: "start" | "center" | "end";
  /** Não quebra entre "Página" e "de N": em telas estreitas o rótulo era partido no meio. */
  nowrap?: boolean;
};
