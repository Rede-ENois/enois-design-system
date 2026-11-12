import { useState } from "react";

import { Check, CircleHelp, X } from "lucide-react";

import { KIND_TONE } from "../../lib/calendar/calendar-kind-tone.js";
import { cn } from "../../lib/utils.js";
import { useMessages } from "../../messages/messages-context.js";
import type { CalendarAnswer } from "../../types/domain/calendar/calendar-answer.js";
import type { CalendarEntryDetailProps } from "../../types/domain/calendar/calendar-entry-detail-props.js";
import type { CalendarEntryKind } from "../../types/domain/calendar/calendar-entry-kind.js";
import { Button } from "../../ui/button.js";
import { Input } from "../../ui/input.js";
import { Label } from "../../ui/label.js";

const ICONS: Record<CalendarEntryKind, typeof Check> = {
  PERSONAL: Check,
  EVENT: Check,
  MENTORING: Check,
  INTERVIEW: Check,
  MEETING: Check,
  CALL: Check,
  WORKSHOP: Check,
};

/**
 * The detail page of one entry: what it is, when it happens, who is invited, and what the reader
 * can do about it. The app fetches and mutates; this draws and reports.
 *
 * The participant list is only drawn for the organizer — the server already refuses to send it to
 * anyone else, and `null` here means exactly that. Answering, inviting and removing are opt-in
 * through the callbacks, so a read-only surface just omits them.
 */
export function CalendarEntryDetail({
  entry,
  owner,
  participation,
  participants,
  backLabel,
  onBack,
  onEdit,
  onCancel,
  onRespond,
  onRemoveParticipant,
  onInvite,
  reminder,
  saving = false,
  responding = false,
  invitePending = false,
  error = null,
  inviteError = null,
}: CalendarEntryDetailProps) {
  const messages = useMessages().calendar;
  const [invite, setInvite] = useState("");
  const [inviteOk, setInviteOk] = useState<string | null>(null);
  const cancelled = entry.cancelledAt !== null;
  const Icon = ICONS[entry.kind];

  const submitInvite = async () => {
    const username = invite.trim().replace(/^@/, "");
    if (!username || !onInvite) return;
    setInviteOk(null);
    const accepted = await onInvite(username);
    if (accepted) {
      setInviteOk(username);
      setInvite("");
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
      <button
        type="button"
        onClick={onBack}
        className="self-start text-sm font-normal text-text-subtle underline-offset-2 hover:text-text-strong hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
      >
        {backLabel}
      </button>

      <section
        data-cancelled={cancelled || undefined}
        className={cn(
          "flex flex-col gap-3 rounded-2xl border border-border-soft bg-card p-5",
          cancelled && "opacity-80",
        )}
      >
        <div className="flex min-w-0 items-start gap-3">
          <span
            className={cn(
              "grid h-10 w-10 shrink-0 place-items-center rounded-xl",
              KIND_TONE[entry.kind],
            )}
          >
            <Icon aria-hidden className="h-5 w-5" />
          </span>

          <div className="min-w-0 flex-1">
            <h1
              className={cn(
                "break-words text-lg font-semibold text-text-strong",
                cancelled && "line-through",
              )}
            >
              {entry.title}
            </h1>

            <p className="mt-0.5 text-sm font-normal text-text-subtle">
              {messages.kinds[entry.kind]} · {messages.scopes[entry.scope]}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-normal text-text-strong">
          <span>
            {entry.allDay || !entry.start || !entry.end
              ? messages.detail.whenAllDay
              : messages.detail.when(entry.start, entry.end)}
          </span>

          <span className="text-text-subtle">{messages.detail.zoneHint(entry.timeZoneId)}</span>

          <span className="rounded-full bg-surface-3 px-2 py-0.5 text-xs font-normal text-text-subtle">
            {entry.day}
          </span>
        </div>

        {cancelled && (
          <p className="rounded-lg bg-muted p-2 text-sm font-normal text-text-subtle">
            {messages.detail.cancelledAt}
          </p>
        )}

        {entry.description ? (
          <p className="whitespace-pre-line break-words text-sm font-normal text-text-strong">
            {entry.description}
          </p>
        ) : (
          <p className="text-sm font-normal text-text-subtle">{messages.detail.descriptionEmpty}</p>
        )}

        {error && (
          <p role="alert" className="text-sm font-normal text-destructive">
            {error}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-2">
          {onEdit && !cancelled && (
            <Button variant="outline" size="sm" disabled={saving} onClick={onEdit}>
              {messages.detail.edit}
            </Button>
          )}
          {onCancel && !cancelled && (
            <Button
              variant="ghost"
              size="sm"
              disabled={saving}
              onClick={onCancel}
              className="text-destructive"
            >
              {saving ? messages.detail.cancelling : messages.detail.cancel}
            </Button>
          )}
        </div>
      </section>

      {reminder && !cancelled && (
        <section className="rounded-2xl border border-border-soft bg-card p-5">{reminder}</section>
      )}

      {!owner && participation && onRespond && !cancelled && (
        <section className="flex flex-col gap-2 rounded-2xl border border-border-soft bg-card p-5">
          <h2 className="text-sm font-semibold text-text-strong">{messages.detail.yourAnswer}</h2>
          {participation !== "INVITED" && (
            <p className="text-sm font-normal text-text-subtle">
              {messages.participations[participation]}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-2">
            {(["ACCEPTED", "TENTATIVE", "DECLINED"] as CalendarAnswer[]).map((answer) => {
              const label =
                answer === "ACCEPTED"
                  ? messages.accept
                  : answer === "TENTATIVE"
                    ? messages.tentative
                    : messages.decline;
              const AnswerIcon =
                answer === "ACCEPTED" ? Check : answer === "TENTATIVE" ? CircleHelp : X;
              return (
                <button
                  key={answer}
                  type="button"
                  disabled={responding}
                  onClick={() => onRespond(answer)}
                  className={cn(
                    "inline-flex h-8 items-center gap-1 rounded-full border border-border px-3 text-xs font-normal transition",
                    "hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    "disabled:cursor-not-allowed disabled:opacity-60",
                  )}
                >
                  <AnswerIcon aria-hidden className="h-3 w-3" />
                  {label}
                </button>
              );
            })}
          </div>
        </section>
      )}

      {owner && (
        <section className="flex flex-col gap-3 rounded-2xl border border-border-soft bg-card p-5">
          <h2 className="text-sm font-semibold text-text-strong">
            {messages.detail.participantsTitle(participants?.length ?? 0)}
          </h2>

          {participants && participants.length > 0 && (
            <ul className="flex flex-col gap-1">
              {participants.map((participant) => (
                <li
                  key={participant.id}
                  className="flex min-w-0 items-center gap-2 rounded-lg px-1 py-1 text-sm"
                >
                  <span className="min-w-0 flex-1 truncate font-normal text-text-strong">
                    @{participant.username}
                  </span>

                  <span className="shrink-0 text-xs font-normal text-text-subtle">
                    {messages.participations[participant.state]}
                  </span>
                  {onRemoveParticipant && !cancelled && (
                    <button
                      type="button"
                      aria-label={messages.detail.removeParticipant(participant.username)}
                      disabled={saving}
                      onClick={() => onRemoveParticipant(participant.id)}
                      className="shrink-0 rounded-full p-1 text-text-subtle hover:bg-surface-2 hover:text-destructive disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <X aria-hidden className="h-3.5 w-3.5" />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
          {participants?.length === 0 && (
            <p className="text-sm font-normal text-text-subtle">
              {messages.detail.participantEmpty}
            </p>
          )}

          {onInvite && !cancelled && (
            <form
              className="flex flex-col gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                void submitInvite();
              }}
            >
              <Label htmlFor="calendar-invite-username">{messages.detail.inviteLabel}</Label>

              <div className="flex items-center gap-2">
                <Input
                  id="calendar-invite-username"
                  value={invite}
                  placeholder={messages.detail.invitePlaceholder}
                  onChange={(event) => setInvite(event.target.value)}
                  autoComplete="off"
                />

                <Button type="submit" size="sm" disabled={invitePending || !invite.trim()}>
                  {invitePending ? messages.detail.inviting : messages.detail.inviteAction}
                </Button>
              </div>
              {inviteError && (
                <p role="alert" className="text-sm font-normal text-destructive">
                  {inviteError}
                </p>
              )}
              {inviteOk && (
                <p className="text-sm font-normal text-text-subtle">
                  {messages.detail.invitedOk(inviteOk)}
                </p>
              )}
            </form>
          )}
        </section>
      )}
    </div>
  );
}
