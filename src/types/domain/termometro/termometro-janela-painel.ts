import type { TermometroEmocaoPainel } from "./termometro-emocao-painel.js";
import type { TermometroEmocao } from "./termometro-emocao.js";
import type { TermometroPeriodo } from "./termometro-periodo.js";

/** A janela pronta para a tela — SÓ agregado: nada de texto, autoria ou id de quem escreveu.
 *
 * `amostraSuficiente` é o recorte de privacidade: com menos de 20 pessoas distintas na janela o
 * indicador não se exibe (a interface mostra o aviso de amostra pequena em vez de inventar clima).
 */
export type TermometroJanelaPainel = {
  periodo: TermometroPeriodo;
  amostraSuficiente: boolean;
  manifestacoes: number;
  participantes: number;
  dominante: TermometroEmocao | null;
  emocoes: TermometroEmocaoPainel[];
};
