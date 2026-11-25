import type { WrappedAssunto } from "./wrapped-assunto.js";
import type { WrappedComunidade } from "./wrapped-comunidade.js";
import type { WrappedEncerramento } from "./wrapped-encerramento.js";
import type { WrappedImpacto } from "./wrapped-impacto.js";
import type { WrappedInteracao } from "./wrapped-interacao.js";
import type { WrappedMetricas } from "./wrapped-metricas.js";
import type { WrappedPerfil } from "./wrapped-perfil.js";
import type { WrappedPublicacaoMarcante } from "./wrapped-publicacao-marcante.js";
import type { WrappedRitmo } from "./wrapped-ritmo.js";
import type { WrappedTreta } from "./wrapped-treta.js";

/**
 * A retrospectiva de um ano, como o backend a calculou e o container a montou. Seção vazia é
 * seção escondida: nenhuma view inventa número.
 */
export type WrappedRetrospectiva = {
  ano: number;
  dadosInsuficientes: boolean;
  metricas: WrappedMetricas;
  assuntosPublicados: WrappedAssunto[];
  assuntosComentados: WrappedAssunto[];
  publicacoesMarcantes: WrappedPublicacaoMarcante[];
  tretas: WrappedTreta[];
  interacoes: WrappedInteracao[];
  ritmo: WrappedRitmo;
  perfil: WrappedPerfil;
  impacto: WrappedImpacto;
  comunidades: WrappedComunidade[];
  encerramento: WrappedEncerramento;
};
