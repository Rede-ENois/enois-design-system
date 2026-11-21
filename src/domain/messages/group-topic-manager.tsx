import { useState } from "react";

import { Archive, ArrowDown, ArrowUp, Pencil, Plus } from "lucide-react";

import { TOUCH_TARGET_32 } from "../../lib/touch-target.js";
import { useMessages } from "../../messages/messages-context.js";
import type { GroupTopicData } from "../../types/domain/messages/group-topic-data.js";
import type { GroupTopicManagerProps } from "../../types/domain/messages/group-topic-manager-props.js";
import { Button } from "../../ui/button.js";
import { Input } from "../../ui/input.js";

import { useGroupTopicErrorText } from "./use-group-topic-error-text.js";

const TOPIC_NAME_MAX = 60;

const move = (ids: string[], from: number, to: number): string[] => {
  const next = [...ids];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
};

/**
 * Gestão dos tópicos, só para o dono e os administradores. A criação e o renomeio validam o
 * nome aqui (vazio ou longo demais não sai do view) e o erro que o servidor devolver aparece
 * traduzido ao lado da ação. A ordem é a da exibição: subir e descer mandam a lista inteira.
 */
export function GroupTopicManager({
  topics,
  error,
  pending = false,
  onCreateTopic,
  onRenameTopic,
  onArchiveTopic,
  onReorderTopics,
}: GroupTopicManagerProps) {
  const messages = useMessages().groupTopics;
  const [draft, setDraft] = useState("");
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameDraft, setRenameDraft] = useState("");
  const [archivingId, setArchivingId] = useState<string | null>(null);
  const [failure, setFailure] = useState<string | null>(null);
  const toText = useGroupTopicErrorText();

  const draftValid = draft.trim().length > 0 && draft.trim().length <= TOPIC_NAME_MAX;

  const create = () => {
    if (!draftValid) return;
    void onCreateTopic(draft.trim()).then((code) => {
      setFailure(code === null ? null : toText(code));
      if (!code) setDraft("");
    });
  };

  const startRename = (topic: GroupTopicData) => {
    setRenamingId(topic.id);
    setRenameDraft(topic.name);
  };

  const saveRename = () => {
    if (renamingId === null || renameDraft.trim().length === 0) return;
    void onRenameTopic(renamingId, renameDraft.trim()).then((code) => {
      setFailure(code === null ? null : toText(code));
      if (!code) setRenamingId(null);
    });
  };

  const reorder = (index: number, delta: number) => {
    const target = index + delta;
    if (target < 0 || target >= topics.length) return;
    void onReorderTopics(
      move(
        topics.map((t) => t.id),
        index,
        target,
      ),
    ).then((code) => setFailure(code === null ? null : toText(code)));
  };

  const archiving = topics.find((topic) => topic.id === archivingId) ?? null;

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-text-strong">{messages.title}</h4>

      <div className="flex items-start gap-2">
        <Input
          aria-label={messages.name}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={messages.namePlaceholder}
          maxLength={TOPIC_NAME_MAX}
          className="h-9 flex-1 rounded-full bg-muted"
        />

        <Button
          size="sm"
          className="mt-0.5 shrink-0"
          disabled={!draftValid || pending}
          onClick={create}
        >
          <Plus aria-hidden />
          {messages.create}
        </Button>
      </div>

      {topics.length === 0 ? (
        <p className="rounded-xl bg-surface-2 p-3 text-sm text-text-subtle">{messages.empty}</p>
      ) : (
        <ul className="divide-y divide-border-soft rounded-xl border border-border-soft">
          {topics.map((topic, index) => (
            <li key={topic.id} className="flex min-w-0 items-center gap-2 px-2 py-2">
              {renamingId === topic.id ? (
                <>
                  <Input
                    aria-label={messages.rename(topic.name)}
                    value={renameDraft}
                    onChange={(event) => setRenameDraft(event.target.value)}
                    maxLength={TOPIC_NAME_MAX}
                    showCounter={false}
                    className="h-8 min-w-0 flex-1"
                  />

                  <Button
                    size="sm"
                    disabled={renameDraft.trim().length === 0 || pending}
                    onClick={saveRename}
                  >
                    {messages.save}
                  </Button>

                  <Button size="sm" variant="ghost" onClick={() => setRenamingId(null)}>
                    {messages.cancel}
                  </Button>
                </>
              ) : (
                <>
                  <span className="min-w-0 flex-1 truncate text-sm text-text-strong">
                    {topic.name}
                    {topic.status === "ARCHIVED" && (
                      <span className="ml-1.5 text-xs text-text-subtle">({messages.archived})</span>
                    )}
                  </span>

                  <button
                    type="button"
                    aria-label={messages.rename(topic.name)}
                    title={messages.rename(topic.name)}
                    disabled={pending}
                    onClick={() => startRename(topic)}
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-text-subtle transition hover:bg-surface-2 hover:text-text-strong disabled:pointer-events-none disabled:opacity-50 ${TOUCH_TARGET_32}`}
                  >
                    <Pencil className="h-4 w-4" aria-hidden />
                  </button>

                  <button
                    type="button"
                    aria-label={messages.moveUp(topic.name)}
                    title={messages.moveUp(topic.name)}
                    disabled={pending || index === 0}
                    onClick={() => reorder(index, -1)}
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-text-subtle transition hover:bg-surface-2 hover:text-text-strong disabled:pointer-events-none disabled:opacity-50 ${TOUCH_TARGET_32}`}
                  >
                    <ArrowUp className="h-4 w-4" aria-hidden />
                  </button>

                  <button
                    type="button"
                    aria-label={messages.moveDown(topic.name)}
                    title={messages.moveDown(topic.name)}
                    disabled={pending || index === topics.length - 1}
                    onClick={() => reorder(index, 1)}
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-text-subtle transition hover:bg-surface-2 hover:text-text-strong disabled:pointer-events-none disabled:opacity-50 ${TOUCH_TARGET_32}`}
                  >
                    <ArrowDown className="h-4 w-4" aria-hidden />
                  </button>

                  {topic.status === "OPEN" && (
                    <button
                      type="button"
                      aria-label={messages.archive(topic.name)}
                      title={messages.archive(topic.name)}
                      disabled={pending}
                      onClick={() => setArchivingId(topic.id)}
                      className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-text-subtle transition hover:bg-surface-2 hover:text-text-strong disabled:pointer-events-none disabled:opacity-50 ${TOUCH_TARGET_32}`}
                    >
                      <Archive className="h-4 w-4" aria-hidden />
                    </button>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      <p className="text-xs text-text-subtle">{messages.historyNote}</p>

      {(failure ?? error) && (
        <p role="alert" className="text-sm text-destructive">
          {failure ?? error}
        </p>
      )}

      {archiving && (
        <div
          role="alertdialog"
          aria-label={messages.confirmArchive(archiving.name)}
          className="space-y-2 rounded-xl border border-border-soft bg-surface-2 p-3"
        >
          <p className="text-sm text-text-strong">{messages.confirmArchive(archiving.name)}</p>

          <div className="flex justify-end gap-2">
            <Button size="sm" variant="ghost" onClick={() => setArchivingId(null)}>
              {messages.cancel}
            </Button>

            <Button
              size="sm"
              variant="destructive"
              disabled={pending}
              onClick={() => {
                const id = archiving.id;
                void onArchiveTopic(id).then((code) => {
                  setFailure(code === null ? null : toText(code));
                  if (!code) setArchivingId(null);
                });
              }}
            >
              {messages.confirmArchiveAction}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
