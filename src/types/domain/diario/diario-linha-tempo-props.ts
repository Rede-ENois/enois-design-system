import type { DiarioEvento } from "./diario-evento.js";

export type DiarioLinhaTempoProps = {
  eventos: DiarioEvento[];
  /** Há mais eventos no backend: mostra o "Carregar mais". */
  temMais: boolean;
  carregandoMais?: boolean;
  onCarregarMais?: () => void;
  /** Abre o post do evento (o próprio, em publicação; o original, em comentário e repost). */
  onAbrirEvento: (evento: DiarioEvento) => void;
};
