import type { ComponentType, ReactNode } from "react";

/** O "voltar" que abre uma página de conteúdo público, acima do cabeçalho. */
export type PageBackLinkProps = {
  href: string;
  children: ReactNode;
  /** Ícone à esquerda do texto (lucide). */
  icon?: ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" }>;
};
