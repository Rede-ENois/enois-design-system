/** O tópico do grupo como o app o carregou (nome já pronto para exibição). */
export type GroupTopicData = {
  id: string;
  name: string;
  status: "OPEN" | "ARCHIVED";
};
