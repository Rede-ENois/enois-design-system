import type { ConversationTopicFilterProps } from "../../types/domain/messages/conversation-topic-filter-props.js";

import { GroupTopicFilter } from "./group-topic-filter.js";
import { GroupTopicsView } from "./group-topics-view.js";

/**
 * Tópicos dentro do filão, antes das mensagens. A gestão fica embutida na fileira porque a rota
 * e o dock desenham o mesmo filão em tamanhos diferentes: o app passa os dados e as funções e
 * não desenha nada, como no resto das views. Fechado pelo e2eRequired, a fileira some: ainda não
 * há mensagem para filtrar.
 */
export function ConversationTopicFilter({
  topics,
  activeTopicId,
  onSelectTopic,
  manager = false,
  loading = false,
  error,
  pending = false,
  onCreateTopic,
  onRenameTopic,
  onArchiveTopic,
  onReorderTopics,
  e2eRequired = false,
}: ConversationTopicFilterProps) {
  if (e2eRequired) return null;

  const manages =
    manager &&
    onCreateTopic !== undefined &&
    onRenameTopic !== undefined &&
    onArchiveTopic !== undefined &&
    onReorderTopics !== undefined;

  if (loading) {
    return (
      <div className="flex gap-2 border-b border-border-soft px-4 py-2" aria-busy="true">
        <span className="h-7 w-24 animate-pulse rounded-full bg-surface-2" />
        <span className="h-7 w-20 animate-pulse rounded-full bg-surface-2" />
      </div>
    );
  }

  if (!manages)
    return (
      <GroupTopicFilter
        topics={topics}
        activeTopicId={activeTopicId}
        onSelectTopic={onSelectTopic}
      />
    );

  return (
    <GroupTopicsView
      topics={topics}
      activeTopicId={activeTopicId}
      onSelectTopic={onSelectTopic}
      manager
      loading={false}
      error={error}
      pending={pending}
      onCreateTopic={onCreateTopic}
      onRenameTopic={onRenameTopic}
      onArchiveTopic={onArchiveTopic}
      onReorderTopics={onReorderTopics}
    />
  );
}
