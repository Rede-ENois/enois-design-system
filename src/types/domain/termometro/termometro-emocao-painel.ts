import type { TermometroEmocao } from "./termometro-emocao.js";

/** A emoção pronta para a tela: nome estável, porcentagem (0–100) e contagem bruta. */
export type TermometroEmocaoPainel = {
  emocao: TermometroEmocao;
  porcentagem: number;
  contagem: number;
};
