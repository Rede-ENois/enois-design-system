import type { MuralAutor } from "./mural-autor.js";

/**
 * O elo exposto na página do mural: quem colou e quando. A publicação em si não tipa aqui —
 * ela entra como conteúdo (children) desenhado por quem compõe a página.
 */
export type MuralContribuicaoInfo = {
  postId: string;
  addedBy: MuralAutor;
  addedAt: string;
};
