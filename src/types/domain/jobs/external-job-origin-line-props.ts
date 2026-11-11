import type { ExternalJobOrigin } from "./external-job-origin.js";

export type ExternalJobOriginLineProps = {
  origin: ExternalJobOrigin;
  /** A data de hoje, para o texto relativo ("hoje", "há 3 dias"). Padrão: agora. */
  now?: Date;
};
