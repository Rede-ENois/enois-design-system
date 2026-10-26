import type { WithRequiredChildren } from "../with-required-children.js";

export type PillRowProps = WithRequiredChildren<{
  /** Nome do grupo de filtros, lido pelo leitor de tela. */
  label: string;
  className?: string;
}>;
