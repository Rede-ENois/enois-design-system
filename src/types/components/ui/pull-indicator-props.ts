export type PullIndicatorProps = {
  /** Distância atual do arrasto, em pixels (0 = dedo parado no topo). */
  pull: number;
  /** Distância que dispara a renovação ao soltar; passa dela o ponto gira continuamente. */
  trigger: number;
  className?: string;
};
