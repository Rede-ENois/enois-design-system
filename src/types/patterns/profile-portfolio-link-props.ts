import type { LucideIcon } from "lucide-react";

/** O atalho do perfil para a vitrine profissional: o dono vai para o editor, quem visita vai para a página publicada. */
export type ProfilePortfolioLinkProps = {
  /** Endereço que o atalho abre: o editor do dono ou a vitrine publicada. */
  href: string;
  /** Dono do perfil: o texto é o do editor. */
  owner?: boolean;
  icon?: LucideIcon;
  className?: string;
};
