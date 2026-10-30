import { Calendar, Check, MapPin, Repeat, Users, Video } from "lucide-react";

import { useAdapters } from "../../adapters/adapters-context.js";
import { safeHref } from "../../lib/safe-href.js";
import { cn } from "../../lib/utils.js";
import { useMessages } from "../../messages/messages-context.js";
import type { EventCardProps } from "../../types/domain/events/event-card-props.js";
import { Badge } from "../../ui/badge.js";
import { Button } from "../../ui/button.js";

import { formatDayMonth } from "./recurrence.js";

/** Event card on the events page: cover, date tile, format, series cadence and attendance. */
export function EventCard({
  event: e,
  dateTimeLabel,
  attendancePending,
  onAttend,
  onCancelAttend,
  highlighted = false,
  ref,
}: EventCardProps) {
  const messages = useMessages().eventCard;
  const recurrenceMessages = useMessages().eventRecurrence;
  const { resolveMediaUrl } = useAdapters();
  const Icon = e.format === "ONLINE" ? Video : MapPin;
  const [, month, day] = (e.date ?? "").split("-");
  const recurrence = e.recurrence ?? "NONE";
  const nextDate = e.nextOccurrenceDate ? formatDayMonth(e.nextOccurrenceDate) : "";
  const streamHref = safeHref(e.streamUrl);
  const attendees = e.attendees ?? 0;

  return (
    <article
      ref={ref}
      id={`evento-${e.id}`}
      data-highlighted={highlighted || undefined}
      className={cn(
        "surface-card min-w-0 overflow-hidden transition-shadow duration-500 motion-reduce:transition-none",
        highlighted
          ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
          : e.attending && "ring-2 ring-primary/45",
      )}
    >
      <div className="relative">
        {e.cover ? (
          <img src={resolveMediaUrl(e.cover)} alt="" className="h-40 w-full object-cover" />
        ) : (
          <div className="h-40 w-full bg-gradient-to-br from-primary/20 to-primary/5" />
        )}
        <div className="absolute left-4 top-4 rounded-xl bg-card/95 px-3 py-2 text-center shadow-md backdrop-blur">
          <p className="text-xs font-medium uppercase text-primary">
            {messages.months[Number(month)] ?? month}
          </p>

          <p className="text-lg font-semibold leading-none">{day ?? ""}</p>
        </div>
      </div>

      <div className="p-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="rounded-full bg-card font-normal">
            <Icon className="mr-1 h-3 w-3" aria-hidden />
            {messages.formats[e.format] ?? e.format}
          </Badge>

          {e.attending && !e.expired && (
            <Badge
              variant="outline"
              className="rounded-full border-primary/30 bg-primary/10 font-normal text-primary"
            >
              <Check className="mr-1 h-3 w-3" aria-hidden />
              {messages.youAreGoing}
            </Badge>
          )}

          {e.expired && (
            <Badge variant="outline" className="rounded-full bg-muted font-normal text-text-subtle">
              {messages.finished}
            </Badge>
          )}
        </div>

        <h3 className="mt-2 break-words font-semibold">{e.title}</h3>

        <p className="mt-1 text-xs text-muted-foreground">{messages.hostedBy(e.host)}</p>

        {recurrence !== "NONE" && (
          <p className="mt-2 flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs text-text-subtle">
            <Repeat className="h-3.5 w-3.5 shrink-0 text-primary/80" aria-hidden />

            <span>{recurrenceMessages.labels[recurrence]}</span>
            {nextDate && (
              <>
                <span aria-hidden>·</span>

                <span className="tabular-nums">{recurrenceMessages.next(nextDate)}</span>
              </>
            )}
          </p>
        )}

        {e.location && (
          <p className="mt-1 flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />

            <span className="break-words">{e.location}</span>
          </p>
        )}

        {streamHref && !e.expired && (
          <a
            href={streamHref}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Video className="h-3.5 w-3.5" aria-hidden />
            {messages.watchLive}
          </a>
        )}

        <div className="mt-3 flex items-center justify-between gap-2 text-xs text-muted-foreground">
          <span className="inline-flex min-w-0 items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 shrink-0" aria-hidden />

            <span className="truncate">{dateTimeLabel}</span>
          </span>

          <span
            className="inline-flex shrink-0 items-center gap-1.5 tabular-nums"
            aria-label={messages.attendees(attendees)}
          >
            <Users className="h-3.5 w-3.5" aria-hidden />

            <span aria-hidden>{attendees}</span>
          </span>
        </div>

        {e.expired ? (
          <p className="mt-4 rounded-full bg-muted px-4 py-2 text-center text-xs font-normal text-text-subtle">
            {messages.finished}
          </p>
        ) : (
          <Button
            className="mt-4 w-full rounded-full"
            variant={e.attending ? "outline" : "default"}
            disabled={attendancePending}
            onClick={e.attending ? onCancelAttend : onAttend}
          >
            {e.attending ? messages.cancelAttend : messages.attend}
          </Button>
        )}
      </div>
    </article>
  );
}
