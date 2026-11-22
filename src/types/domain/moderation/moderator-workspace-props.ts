import type { ReactNode } from "react";

import type { ModeratorWorkspaceGroup } from "./moderator-workspace-group.js";

export type ModeratorWorkspaceProps = {
  /**
   * Grupos e áreas do painel. IDs precisam ser únicos e estáveis: a seleção viaja por eles e
   * um destino de fora da lista e recusado sem chamar `onTabChange`.
   */
  groups: ModeratorWorkspaceGroup[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  /** Área ativa. O painel nao busca dados, nao lia store nem monta rotas. */
  children: ReactNode;
};
