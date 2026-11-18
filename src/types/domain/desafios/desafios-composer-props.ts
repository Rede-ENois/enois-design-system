import type { DesafiosPublishInput } from "./desafios-publish-input.js";

/** O compositor do desafio: título, o que fazer e a janela opcional (até 31 dias). */
export type DesafiosComposerProps = {
  /** O desafio vai para o feed quando a promessa se cumpre; recusa limpa o botão. */
  onPublish: (input: DesafiosPublishInput) => Promise<void>;
};
