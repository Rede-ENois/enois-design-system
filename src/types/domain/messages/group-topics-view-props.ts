import type { GroupTopicData } from "./group-topic-data.js";
import type { GroupTopicError } from "./group-topic-error.js";

/**
 * Tópicos do grupo: a fileira que filtra a conversa e a gestão (criar, renomear, arquivar,
 * ordenar) que só o dono e os administradores enxergam. A aplicação é dona da rede; o view
 * devolve a intenção.
 */
export type GroupTopicsViewProps = {
  topics: GroupTopicData[];
  /** Tópico aberto; `null` é a conversa inteira ("Todos os assuntos"). */
  activeTopicId: string | null;
  onSelectTopic: (topicId: string | null) => void;
  /** True para o dono e os administradores: libera criar, renomear, arquivar e ordenar. */
  manager: boolean;
  loading?: boolean;
  /** Texto do último erro de gestão, já traduzido a partir do código do servidor. */
  error?: string | null;
  /** Ação de gestão em voo (desliga os controles). */
  pending?: boolean;
  /** Devolve o código de erro, ou `null` quando deu certo. */
  onCreateTopic: (name: string) => Promise<GroupTopicError | null>;
  onRenameTopic: (topicId: string, name: string) => Promise<GroupTopicError | null>;
  onArchiveTopic: (topicId: string) => Promise<GroupTopicError | null>;
  onReorderTopics: (topicIds: string[]) => Promise<GroupTopicError | null>;
};
