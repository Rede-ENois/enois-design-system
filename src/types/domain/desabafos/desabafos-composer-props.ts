import type { DesabafosPublishInput } from "./desabafos-publish-input.js";

/** O compositor dos Desabafos: só texto. Resolve, o campo limpa; rejeita, o rascunho fica de pé. */
export type DesabafosComposerProps = {
  onPublish: (input: DesabafosPublishInput) => Promise<void>;
};
