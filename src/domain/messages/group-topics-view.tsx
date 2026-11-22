import { useId, useState } from "react";

import { ChevronDown } from "lucide-react";

import { cn } from "../../lib/utils.js";
import { useMessages } from "../../messages/messages-context.js";
import type { GroupTopicsViewProps } from "../../types/domain/messages/group-topics-view-props.js";

import { GroupTopicFilter } from "./group-topic-filter.js";
import { GroupTopicManager } from "./group-topic-manager.js";

/**
 * Tópicos do grupo na tela do filão: a fila que filtra para todo mundo e o botão que abre a
 * gestão para quem administra. A gestão abre aqui embaixo, dentro do fluxo, e não num overlay:
 * criar um tópico é uma passada rápida, e uma gaveta por cima esconde a conversa que a pessoa
 * está lendo e prende o foco até fechar.
 */
export function GroupTopicsView({
  topics,
  activeTopicId,
  onSelectTopic,
  manager,
  loading = false,
  error,
  pending = false,
  onCreateTopic,
  onRenameTopic,
  onArchiveTopic,
  onReorderTopics,
}: GroupTopicsViewProps) {
  const messages = useMessages().groupTopics;
  const panelId = useId();
  const [open, setOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex gap-2 px-4 py-2" aria-busy="true">
        <span className="h-7 w-24 animate-pulse rounded-full bg-surface-2" />
        <span className="h-7 w-20 animate-pulse rounded-full bg-surface-2" />
      </div>
    );
  }

  return (
    <div className="border-b border-border-soft">
      <div className="flex items-center">
        {/* A mascara some com o chip que encosta no botao de gestao ao rolar a lista. */}
        <div className="relative min-w-0 flex-1 before:pointer-events-none before:absolute before:inset-y-0 before:right-0 before:z-10 before:w-6 before:bg-gradient-to-l before:from-surface before:to-transparent">
          <GroupTopicFilter
            topics={topics}
            activeTopicId={activeTopicId}
            onSelectTopic={onSelectTopic}
          />
        </div>

        {manager && (
          <button
            type="button"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((value) => !value)}
            className="-ml-1 mr-2 flex shrink-0 items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold text-primary transition hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 md:mr-4"
          >
            {messages.title}

            <ChevronDown
              className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")}
              aria-hidden
            />
          </button>
        )}
      </div>

      {manager && open && (
        <div id={panelId} className="border-t border-border-soft px-4 py-3">
          <GroupTopicManager
            topics={topics}
            error={error}
            pending={pending}
            onCreateTopic={onCreateTopic}
            onRenameTopic={onRenameTopic}
            onArchiveTopic={onArchiveTopic}
            onReorderTopics={onReorderTopics}
          />
        </div>
      )}
    </div>
  );
}
