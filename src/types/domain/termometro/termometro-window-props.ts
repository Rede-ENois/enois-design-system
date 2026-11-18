import type { TermometroEmocao } from "./termometro-emocao.js";
import type { TermometroJanelaPainel } from "./termometro-janela-painel.js";

/** A janela aberta do painel: a janela selecionada, a anterior (base da comparação) e os textos
 * do vocabulário que quem usa injeta — o componente não decide copy, só desenha. */
export type TermometroWindowProps = {
  janela: TermometroJanelaPainel | null;
  janelaAnterior: TermometroJanelaPainel | null;
  rotuloEmocao: (emocao: TermometroEmocao) => string;
  manifestacoes: (count: number) => string;
  participantes: (count: number) => string;
  amostraInsuficiente: string;
  semManifestacoes: string;
  dominante: string;
  semDominante: string;
  comparacaoComJanelaAnterior: (delta: number) => string;
  semComparacao: string;
};
