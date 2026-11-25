import type { WrappedInteracaoTipo } from "./wrapped-interacao-tipo.js";

/** Uma pessoa com quem a conta mais se cruzou no ano. */
export type WrappedInteracao = {
  userId: string;
  username: string;
  nome: string;
  href: string | null;
  vezes: number;
  tipo: WrappedInteracaoTipo;
};
