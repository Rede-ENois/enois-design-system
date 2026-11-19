import type { ConfessionarioPublishInput } from "./confessionario-publish-input.js";

/** O compositor do Confessionário: só texto. Resolve, o campo limpa; rejeita, o rascunho fica de pé. */
export type ConfessionarioComposerProps = {
  onPublish: (input: ConfessionarioPublishInput) => Promise<void>;
};
