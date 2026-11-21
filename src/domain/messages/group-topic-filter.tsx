import { useMessages } from "../../messages/messages-context.js";
import type { GroupTopicFilterProps } from "../../types/domain/messages/group-topic-filter-props.js";
import { Pill } from "../../ui/pill.js";

/**
 * Fila de tópicos que filtra a conversa do grupo. Um tópico arquivado continua aparecendo: é
 * onde está o histórico dele, só não entra mensagem nova. A rolagem é horizontal porque o
 * celular não comporta a fila inteira; o canto direito fica livre para o botão de gestão, que
 * por isso não entra na área rolável.
 */
export function GroupTopicFilter({ topics, activeTopicId, onSelectTopic }: GroupTopicFilterProps) {
  const messages = useMessages().groupTopics;

  return (
    <nav aria-label={messages.title} className="min-w-0">
      <ul className="flex gap-2 overflow-x-auto py-2 pl-4 [scrollbar-width:none]">
        <li className="shrink-0">
          <Pill active={activeTopicId === null} size="sm" onClick={() => onSelectTopic(null)}>
            {messages.allTopics}
          </Pill>
        </li>

        {topics.map((topic) => (
          <li key={topic.id} className="shrink-0">
            <Pill
              active={activeTopicId === topic.id}
              size="sm"
              onClick={() => onSelectTopic(topic.id)}
            >
              <span className="max-w-40 truncate">{topic.name}</span>

              {topic.status === "ARCHIVED" && (
                <span className="text-[11px] font-normal text-text-subtle">
                  ({messages.archived})
                </span>
              )}
            </Pill>
          </li>
        ))}
      </ul>
    </nav>
  );
}
