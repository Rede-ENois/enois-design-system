import type { WrappedPublicacaoVinculo } from "./wrapped-publicacao-vinculo.js";

/** Uma publicação que marcou o ano da conta, já com o link montado pelo container. */
export type WrappedPublicacaoMarcante = {
  id: string;
  href: string | null;
  autorNome: string;
  autorUsername: string;
  autorHref: string | null;
  trecho: string | null;
  metrica: number;
  motivo: WrappedPublicacaoVinculo;
  dataLabel: string;
};
