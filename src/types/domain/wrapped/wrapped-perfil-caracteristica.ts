import type { WrappedPerfilChave } from "./wrapped-perfil-chave.js";

/** Uma característica de participação (chave estável) e o número que a sustenta. */
export type WrappedPerfilCaracteristica = {
  chave: WrappedPerfilChave;
  motivo: string;
};
