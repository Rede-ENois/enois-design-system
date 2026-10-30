import { useEffect, useId, useState } from "react";

import { CheckCircle2, Circle } from "lucide-react";

import { useMessages } from "../../messages/messages-context.js";
import type { StudyPairSaveStatus } from "../../types/domain/study-pairs/study-pair-save-status.js";
import type { StudyPair } from "../../types/domain/study-pairs/study-pair.js";
import { AppLink } from "../../ui/app-link.js";
import { Button } from "../../ui/button.js";
import { Textarea } from "../../ui/textarea.js";
import { UserAvatar } from "../avatar/user-avatar.js";

const NOTE_MAX = 500;

/**
 * Um par de estudo: quem é a dupla, o objetivo em comum, o check-in desta semana dos dois, as
 * semanas anteriores e o encerramento com confirmação na própria linha (sem modal).
 */
export function StudyPairCard({
  pair,
  status = "idle",
  ending = false,
  onSaveCheckin,
  onEndPair,
}: {
  pair: StudyPair;
  status?: StudyPairSaveStatus;
  ending?: boolean;
  onSaveCheckin: (pairId: string, note: string) => void;
  onEndPair: (pairId: string) => void;
}) {
  const messages = useMessages().studyPairs;
  const id = useId();
  const { partner } = pair;
  const firstName = partner.name.trim().split(/\s+/)[0] || partner.username;
  const checkedIn = pair.myCheckin !== null;

  const [editing, setEditing] = useState(!checkedIn);
  const [draft, setDraft] = useState(pair.myCheckin ?? "");
  const [confirmingEnd, setConfirmingEnd] = useState(false);
  const saving = status === "saving";

  // A successful save closes the editor; the saved note comes back through `pair.myCheckin`.
  useEffect(() => {
    if (status === "saved") setEditing(false);
  }, [status]);

  const startEditing = () => {
    setDraft(pair.myCheckin ?? "");
    setEditing(true);
  };

  return (
    <article aria-labelledby={`${id}-goal`} className="surface-card space-y-4 p-4">
      <header className="flex items-center gap-3">
        <UserAvatar src={partner.avatarUrl} alt={partner.name} className="h-10 w-10" />

        <div className="min-w-0 flex-1">
          <AppLink
            href={partner.href}
            className="block truncate text-sm font-medium text-text-strong underline-offset-4 hover:underline focus-visible:underline"
          >
            {partner.name}
          </AppLink>

          <p className="text-xs break-words text-text-subtle">
            @{partner.username} · {messages.since(pair.sinceLabel)}
          </p>
        </div>
      </header>

      <div className="min-w-0">
        <h3 id={`${id}-goal`} className="text-base font-medium text-pretty text-text-strong">
          {pair.goal}
        </h3>

        {pair.topicLabel && (
          <span className="mt-1.5 inline-block rounded-full bg-surface-2 px-2.5 py-0.5 text-xs text-text-subtle">
            {pair.topicLabel}
          </span>
        )}
      </div>

      <section aria-labelledby={`${id}-week`} className="space-y-3 rounded-xl bg-surface-2 p-3">
        <h4 id={`${id}-week`} className="text-xs font-medium text-text-subtle">
          {messages.thisWeek}
        </h4>

        <ul className="space-y-1.5 text-sm">
          <StatusLine done={checkedIn} text={checkedIn ? messages.myDone : messages.myPending} />
          <StatusLine
            done={pair.partnerCheckin !== null}
            text={
              pair.partnerCheckin !== null
                ? messages.partnerDone(firstName)
                : messages.partnerPending(firstName)
            }
          />
        </ul>

        {pair.partnerCheckin !== null && <HistoryLine who={firstName} note={pair.partnerCheckin} />}

        {editing ? (
          <form
            className="space-y-2"
            onSubmit={(event) => {
              event.preventDefault();
              onSaveCheckin(pair.id, draft.trim());
            }}
          >
            <label htmlFor={`${id}-note`} className="text-sm font-medium text-text-strong">
              {messages.noteLabel}
            </label>

            <Textarea
              id={`${id}-note`}
              value={draft}
              maxLength={NOTE_MAX}
              rows={3}
              placeholder={messages.notePlaceholder}
              className="bg-surface-card"
              onChange={(event) => setDraft(event.target.value)}
            />

            <div className="flex flex-wrap justify-end gap-2">
              {checkedIn && (
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="rounded-full"
                  disabled={saving}
                  onClick={() => setEditing(false)}
                >
                  {messages.cancelEdit}
                </Button>
              )}

              <Button type="submit" size="sm" className="rounded-full" disabled={saving}>
                {saving ? messages.saving : checkedIn ? messages.saveEdit : messages.save}
              </Button>
            </div>
          </form>
        ) : (
          <div className="flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <HistoryLine who={messages.you} note={pair.myCheckin} />
            </div>

            <Button
              size="sm"
              variant="outline"
              className="shrink-0 rounded-full"
              aria-label={`${messages.edit}: ${messages.noteLabel}`}
              onClick={startEditing}
            >
              {messages.edit}
            </Button>
          </div>
        )}

        {/* One live region per card: visible only for a failed save, read aloud for every status. */}
        <p
          aria-live="polite"
          className={status === "error" ? "text-xs text-destructive" : "sr-only"}
        >
          {
            { idle: "", saving: messages.saving, saved: messages.saved, error: messages.saveError }[
              status
            ]
          }
        </p>
      </section>

      {pair.history.length > 0 && (
        <details className="group">
          <summary className="cursor-pointer rounded-md text-sm font-medium text-text-subtle hover:text-text-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50">
            {messages.history}
          </summary>

          <ol className="mt-3 space-y-3">
            {pair.history.map((week) => (
              <li key={week.weekKey} className="space-y-1">
                <p className="text-xs font-medium text-text-subtle">{week.label}</p>

                <HistoryLine who={messages.you} note={week.myNote} />
                <HistoryLine who={firstName} note={week.partnerNote} />
              </li>
            ))}
          </ol>
        </details>
      )}

      <footer className="flex justify-end border-t border-border-soft pt-3">
        {confirmingEnd ? (
          <div role="group" aria-labelledby={`${id}-end`} className="w-full space-y-2">
            <p id={`${id}-end`} className="text-sm text-text-strong">
              {messages.endConfirm(firstName)}
            </p>

            <div className="flex flex-wrap justify-end gap-2">
              <Button
                size="sm"
                variant="ghost"
                className="rounded-full"
                disabled={ending}
                // Focus returns to the safe choice by default.
                autoFocus
                onClick={() => setConfirmingEnd(false)}
              >
                {messages.endKeep}
              </Button>

              <Button
                size="sm"
                variant="outline"
                className="rounded-full"
                disabled={ending}
                onClick={() => onEndPair(pair.id)}
              >
                {ending ? messages.ending : messages.endConfirmAction}
              </Button>
            </div>
          </div>
        ) : (
          <Button
            size="sm"
            variant="ghost"
            className="rounded-full text-text-subtle"
            onClick={() => setConfirmingEnd(true)}
          >
            {messages.end}
          </Button>
        )}
      </footer>
    </article>
  );
}

function StatusLine({ done, text }: { done: boolean; text: string }) {
  const Icon = done ? CheckCircle2 : Circle;

  return (
    <li className="flex items-start gap-2">
      <Icon
        aria-hidden
        className={
          done ? "mt-0.5 h-4 w-4 shrink-0 text-primary" : "mt-0.5 h-4 w-4 shrink-0 text-text-subtle"
        }
      />

      <span className={done ? "min-w-0 text-text-strong" : "min-w-0 text-text-subtle"}>{text}</span>
    </li>
  );
}

function HistoryLine({ who, note }: { who: string; note: string | null }) {
  const messages = useMessages().studyPairs;

  return (
    <p className="text-sm">
      <span className="font-medium text-text-strong">{who}: </span>

      <span className={note ? "whitespace-pre-line text-text-strong" : "text-text-subtle"}>
        {note === null ? messages.noCheckin : note || messages.emptyNote}
      </span>
    </p>
  );
}
