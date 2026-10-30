import { useState } from "react";

import { Check, Loader2, X } from "lucide-react";

import { FOCUS_RING } from "../../lib/focus-ring.js";
import { cn } from "../../lib/utils.js";
import { useMessages } from "../../messages/messages-context.js";
import type { NetworkRequest } from "../../types/domain/network/network-request.js";
import type { NetworkRequestsProps } from "../../types/domain/network/network-requests-props.js";
import { AppLink } from "../../ui/app-link.js";
import { Button } from "../../ui/button.js";
import { Pill } from "../../ui/pill.js";
import { Skeleton } from "../../ui/skeleton.js";
import { UserAvatar } from "../avatar/user-avatar.js";
import { StyledName } from "../name/styled-name.js";

/** Rows shown before "see all": enough to act on, short enough to keep the suggestions in view. */
const PREVIEW = 4;

const RESOLVED: Partial<Record<NetworkRequest["status"], true>> = {
  accepted: true,
  declined: true,
  cancelled: true,
};

function Spinner() {
  return <Loader2 className="animate-spin" aria-hidden />;
}

function RequestRow({
  request,
  onAccept,
  onDecline,
  onCancel,
}: { request: NetworkRequest } & Pick<
  NetworkRequestsProps,
  "onAccept" | "onDecline" | "onCancel"
>) {
  const copy = useMessages().networkRequests;
  const incoming = request.direction === "INCOMING";
  const busy =
    request.status === "accepting" ||
    request.status === "declining" ||
    request.status === "cancelling";
  const resolved = RESOLVED[request.status] === true;

  return (
    <li
      className={cn(
        "flex flex-wrap items-center gap-x-4 gap-y-3 px-4 py-4 transition-colors sm:px-5",
        request.status === "accepted" && "bg-primary-soft/40",
      )}
    >
      {/* The name keeps 12rem: on a phone the actions drop below it instead of squeezing it. */}
      <div className="flex min-w-[12rem] flex-1 items-center gap-3">
        <AppLink href={request.profileHref} className={cn("shrink-0 rounded-full", FOCUS_RING)}>
          <UserAvatar
            src={request.avatar}
            frame={request.avatarFrame}
            alt={request.name}
            className={cn("h-12 w-12", resolved && request.status !== "accepted" && "opacity-60")}
          />
        </AppLink>

        <div className="min-w-0">
          <AppLink
            href={request.profileHref}
            className={cn(
              "block truncate font-medium text-text-strong hover:underline",
              FOCUS_RING,
            )}
          >
            <StyledName name={request.name} style={request.nameStyle} />
          </AppLink>

          <p className="truncate text-sm text-text-subtle">
            {request.headline || `@${request.username}`}
          </p>

          <p className="text-xs text-text-subtle">
            {incoming ? copy.receivedAt(request.dateLabel) : copy.sentAt(request.dateLabel)}
          </p>
        </div>
      </div>

      <div aria-live="polite" className="flex shrink-0 items-center gap-2">
        {request.status === "accepted" ? (
          <>
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary">
              <Check className="h-4 w-4" aria-hidden />
              {copy.accepted}
            </span>

            <AppLink
              href={request.profileHref}
              className={cn(
                "text-sm text-text-subtle underline-offset-4 hover:underline",
                FOCUS_RING,
              )}
            >
              {copy.viewProfile}
            </AppLink>
          </>
        ) : request.status === "declined" || request.status === "cancelled" ? (
          <span className="text-sm text-text-subtle">
            {request.status === "declined" ? copy.declined : copy.cancelled}
          </span>
        ) : (
          <>
            {request.status === "failed" && (
              <span role="alert" className="text-xs text-destructive">
                {copy.failed}
              </span>
            )}

            {incoming ? (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full"
                  disabled={busy}
                  aria-label={copy.declineFrom(request.name)}
                  onClick={() => onDecline(request.userId)}
                >
                  {request.status === "declining" ? <Spinner /> : <X aria-hidden />}
                  {copy.decline}
                </Button>

                <Button
                  size="sm"
                  className="rounded-full"
                  disabled={busy}
                  aria-label={copy.acceptFrom(request.name)}
                  onClick={() => onAccept(request.userId)}
                >
                  {request.status === "accepting" ? <Spinner /> : <Check aria-hidden />}
                  {copy.accept}
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                variant="ghost"
                className="rounded-full text-text-subtle"
                disabled={busy}
                aria-label={copy.cancelTo(request.name)}
                onClick={() => onCancel(request.userId)}
              >
                {request.status === "cancelling" ? <Spinner /> : <X aria-hidden />}
                {copy.cancel}
              </Button>
            )}
          </>
        )}
      </div>
    </li>
  );
}

/**
 * The invitations panel of the network page: received and sent requests in two quiet tabs, each
 * row answerable in place. A row keeps its outcome after the action ("conectados", "recusado")
 * so the list never jumps under the cursor; the container drops resolved rows on its next load.
 */
export function NetworkRequests({
  requests,
  loading,
  error,
  onRetry,
  onAccept,
  onDecline,
  onCancel,
}: NetworkRequestsProps) {
  const copy = useMessages().networkRequests;
  const received = requests.filter((r) => r.direction === "INCOMING");
  const sent = requests.filter((r) => r.direction === "OUTGOING");
  const waiting = received.filter((r) => !RESOLVED[r.status]).length;
  // Opens on what needs an answer; with nothing received but something sent, the sent tab.
  const [tab, setTab] = useState<"received" | "sent" | null>(null);
  const active = tab ?? (received.length === 0 && sent.length > 0 ? "sent" : "received");
  const [expanded, setExpanded] = useState(false);
  const list = active === "received" ? received : sent;
  const visible = expanded ? list : list.slice(0, PREVIEW);

  return (
    <section
      aria-labelledby="network-requests-title"
      className="overflow-hidden rounded-2xl border border-border-soft bg-surface-card shadow-card"
    >
      <header className="flex flex-wrap items-end justify-between gap-3 px-4 pt-5 sm:px-5">
        <div className="min-w-0">
          <h2 id="network-requests-title" className="text-lg font-semibold text-text-strong">
            {copy.title}
          </h2>

          {!loading && !error && (
            <p className="text-sm text-text-subtle">{copy.summary(waiting)}</p>
          )}
        </div>

        {sent.length > 0 && (
          <div role="group" aria-label={copy.tabsLabel} className="flex gap-1.5">
            <Pill
              size="sm"
              active={active === "received"}
              onClick={() => {
                setTab("received");
                setExpanded(false);
              }}
            >
              {copy.received(received.length)}
            </Pill>

            <Pill
              size="sm"
              active={active === "sent"}
              onClick={() => {
                setTab("sent");
                setExpanded(false);
              }}
            >
              {copy.sent(sent.length)}
            </Pill>
          </div>
        )}
      </header>

      <div className="mt-4 border-t border-border-soft">
        {loading ? (
          <ul role="status" aria-label={copy.loading} className="divide-y divide-border-soft">
            {[0, 1].map((key) => (
              <li key={key} className="flex items-center gap-3 px-4 py-4 sm:px-5">
                <Skeleton className="h-12 w-12 rounded-full" />

                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-56 max-w-full" />
                </div>
              </li>
            ))}
          </ul>
        ) : error ? (
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-5 sm:px-5">
            <p role="alert" className="text-sm text-text-subtle">
              {copy.loadError}
            </p>

            {onRetry && (
              <Button size="sm" variant="outline" className="rounded-full" onClick={onRetry}>
                {copy.retry}
              </Button>
            )}
          </div>
        ) : list.length === 0 ? (
          <p className="px-4 py-5 text-sm text-text-subtle sm:px-5">
            {active === "received" ? copy.emptyReceived : copy.emptySent}
          </p>
        ) : (
          <ul className="divide-y divide-border-soft">
            {visible.map((request) => (
              <RequestRow
                key={request.userId}
                request={request}
                onAccept={onAccept}
                onDecline={onDecline}
                onCancel={onCancel}
              />
            ))}
          </ul>
        )}

        {!loading && !error && list.length > PREVIEW && (
          <div className="border-t border-border-soft px-4 py-3 sm:px-5">
            <button
              type="button"
              aria-expanded={expanded}
              onClick={() => setExpanded((value) => !value)}
              className={cn(
                "text-sm font-medium text-primary underline-offset-4 hover:underline",
                FOCUS_RING,
              )}
            >
              {expanded ? copy.showLess : copy.showAll(list.length)}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
