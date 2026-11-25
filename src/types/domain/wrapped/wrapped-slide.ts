import type { ReactNode } from "react";

/** Uma seção da sequência da retrospectiva: chave estável e o que ela desenha. */
export type WrappedSlide = {
  key: string;
  render: () => ReactNode;
};
