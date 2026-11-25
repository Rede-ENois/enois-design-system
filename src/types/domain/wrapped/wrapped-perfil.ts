import type { WrappedPerfilCaracteristica } from "./wrapped-perfil-caracteristica.js";
import type { WrappedPerfilChave } from "./wrapped-perfil-chave.js";

/** O perfil de participação: a principal e todas as que se aplicam (pode haver mais de uma). */
export type WrappedPerfil = {
  principal: WrappedPerfilChave | null;
  caracteristicas: WrappedPerfilCaracteristica[];
};
