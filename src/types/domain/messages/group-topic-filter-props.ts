import type { GroupTopicData } from "./group-topic-data.js";

/** Fila de tópicos que filtra a conversa do grupo. */
export type GroupTopicFilterProps = {
  topics: GroupTopicData[];
  /** Tópico aberto; `null` é a conversa inteira ("Todos os assuntos"). */
  activeTopicId: string | null;
  onSelectTopic: (topicId: string | null) => void;
};
