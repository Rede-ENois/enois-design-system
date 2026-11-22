import type { GroupTopicData } from "./group-topic-data.js";
import type { GroupTopicError } from "./group-topic-error.js";

/**
 * Tópicos dentro do filão, antes das mensagens: a fileira que filtra a conversa e, para o dono e
 * os administradores, o painel de gestão. O app é dono da rede; o view devolve a intenção.
 */
export type ConversationTopicFilterProps = {
  topics: GroupTopicData[];
  /** Tópico aberto; `null` é a conversa inteira ("Todos os assuntos"). */
  activeTopicId: string | null;
  onSelectTopic: (topicId: string | null) => void;
  /** True para o dono e os administradores: libera criar, renomear, arquivar e ordenar. */
  manager?: boolean;
  loading?: boolean;
  /** Texto do último erro de gestão, já traduzido a partir do código do servidor. */
  error?: string | null;
  /** Ação de gestão em voo (desliga os controles). */
  pending?: boolean;
  /** Devolve o código de erro, ou `null` quando deu certo. */
  onCreateTopic?: (name: string) => Promise<GroupTopicError | null>;
  onRenameTopic?: (topicId: string, name: string) => Promise<GroupTopicError | null>;
  onArchiveTopic?: (topicId: string) => Promise<GroupTopicError | null>;
  onReorderTopics?: (topicIds: string[]) => Promise<GroupTopicError | null>;
  /** O filão está fechado esperando a chave local: o assunto não filtra nada ainda. */
  e2eRequired?: boolean;
};
