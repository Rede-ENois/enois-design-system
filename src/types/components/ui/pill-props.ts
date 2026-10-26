import type { WithRequiredChildren } from "../with-required-children.js";

export type PillProps = WithRequiredChildren<{
  active?: boolean;
  /** `sm` para barras de filtro densas, `md` para abas e listas de tópicos. */
  size?: "sm" | "md";
  onClick?: () => void;
  className?: string;
}>;
