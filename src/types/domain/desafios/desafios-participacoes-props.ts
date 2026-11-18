import type { DesafioParticipacaoView } from "./desafio-participacao-view.js";
import type { DesafioView } from "./desafio-view.js";
import type { DesafiosParticipacoesState } from "./desafios-participacoes-state.js";
import type { DesafiosParticipateInput } from "./desafios-participate-input.js";

/**
 * O mural do desafio escolhido: as participações com autoria, a torcida contada e o campo de
 * resposta (só quando o desafio aceita: no ar e quem vê não é quem convocou). O encerramento
 * com reconhecimento é gesto de quem convocou e só existe com o mural no ar.
 */
export type DesafiosParticipacoesProps = {
  desafio: DesafioView;
  state: DesafiosParticipacoesState;
  participacoes: DesafioParticipacaoView[];
  onParticipate: (input: DesafiosParticipateInput) => Promise<void>;
  onCheer: (participacaoId: string) => void;
  onUncheer: (participacaoId: string) => void;
  onRemoveParticipacao: (participacaoId: string) => void;
  /** Encerra com a participação escolhida; só chamado para quem convocou. */
  onClose: (destaqueId: string) => void;
};
