export type NetworkNodeApiRequest = {
  taskId: string;
  /**
   * O nome da rota como está na lista assinada — nunca a URL. A URL vive só na assinatura que o
   * nó recebe; o painel manda e mostra o nome.
   */
  route: string;
  /** O estado da tarefa, como o Control Plane o nomeia (PENDING, DISPATCHED, …). */
  status: string;
  attempt: number;
  deadlineLabel: string;
};
