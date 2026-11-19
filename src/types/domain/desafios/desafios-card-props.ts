import type { DesafioView } from "./desafio-view.js";

/**
 * O card de um desafio na linha do tempo: o convite, quem convocou (nominal), a janela que
 * falta e a contagem de participações. Abrir o mural é gesto de quem vê; remover, só de quem
 * convocou; denúncia, de quem vê e não convocou. Encerrar NÃO é gesto do card: o
 * reconhecimento exige ver as participações, então mora no mural (`DesafiosParticipacoes`).
 */
export type DesafiosCardProps = {
  desafio: DesafioView;
  /** Quanto tempo falta da janela, em palavras ("termina em 3 dias"); nulo = sem prazo. */
  timeLeft: string | null;
  onOpen: () => void;
  onRemove: () => void;
  /** Abre a denúncia; o card só oferece o gesto para quem NÃO convocou. */
  onReport?: () => void;
};
