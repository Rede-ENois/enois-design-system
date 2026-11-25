import type { WrappedPerfilChave } from "./wrapped-perfil-chave.js";

/** O fecho: as peças medidas do ano (a view monta a frase a partir delas). */
export type WrappedEncerramento = {
  temaPrincipal: string | null;
  caracteristica: WrappedPerfilChave | null;
  estatistica: string | null;
};
