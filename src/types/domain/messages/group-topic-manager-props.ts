import type { GroupTopicData } from "./group-topic-data.js";
import type { GroupTopicError } from "./group-topic-error.js";

/** Gestão dos tópicos (criar, renomear, arquivar, ordenar), só para quem administra. */
export type GroupTopicManagerProps = {
  topics: GroupTopicData[];
  error?: string | null;
  pending?: boolean;
  /** Devolve o erro do servidor, ou `null` quando deu certo. */
  onCreateTopic: (name: string) => Promise<GroupTopicError | null>;
  onRenameTopic: (topicId: string, name: string) => Promise<GroupTopicError | null>;
  onArchiveTopic: (topicId: string) => Promise<GroupTopicError | null>;
  onReorderTopics: (topicIds: string[]) => Promise<GroupTopicError | null>;
};
