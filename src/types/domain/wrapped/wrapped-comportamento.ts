/** Como a presença mudou no ano: atividade por trimestre e o sentido da mudança (só volume). */
export type WrappedComportamento = {
  porTrimestre: number[];
  sentido: "CRESCEU" | "DESACELEROU" | "ESTAVEL";
};
