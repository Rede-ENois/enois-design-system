/** O encerramento de um desafio: a participação reconhecida, escolhida por quem convocou. */
export type DesafiosCloseInput = {
  /** Participação no ar deste desafio; o backend recusa o que não existe ou saiu do ar. */
  destaqueId: string;
};
