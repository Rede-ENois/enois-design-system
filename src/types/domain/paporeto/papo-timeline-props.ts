import type { PapoIntervaloView } from "./papo-intervalo-view.js";
import type { PapoJanela } from "./papo-janela.js";

/** A timeline aberta de um assunto: os buckets da janela e os textos injetados — o componente
 * não decide copy, só desenha a série que o backend agregou. */
export type PapoTimelineProps = {
  subject: string;
  rotulo: string;
  intervalos: PapoIntervaloView[] | null;
  janela: PapoJanela;
  onJanelaChange: (janela: PapoJanela) => void;
  rotuloJanela: (janela: PapoJanela) => string;
  falas: (count: number) => string;
  semFalas: string;
  carregando: string;
  eixo: string;
};
