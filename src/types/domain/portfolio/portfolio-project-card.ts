/** O card de um projeto do perfil, como ele aparece dentro da peça de projeto. */
export type PortfolioProjectCard = {
  id: string;
  title: string;
  description: string | null;
  /** Imagem de capa, já resolvida para URL absoluta pelo app. */
  banner?: string | null;
  icon?: string | null;
  stack: string[];
  repoUrl: string | null;
  status: string | null;
};
