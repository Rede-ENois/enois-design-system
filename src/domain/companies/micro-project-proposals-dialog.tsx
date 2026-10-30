import { Check, Loader2, MessageCircle } from "lucide-react";

import { FOCUS_RING } from "../../lib/focus-ring.js";
import { cn } from "../../lib/utils.js";
import { useMessages } from "../../messages/messages-context.js";
import type { MicroProjectProposalsDialogProps } from "../../types/domain/companies/micro-project-proposals-dialog-props.js";
import { AppLink } from "../../ui/app-link.js";
import { buttonVariants } from "../../ui/button-variants.js";
import { Button } from "../../ui/button.js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog.js";
import { Skeleton } from "../../ui/skeleton.js";
import { UserAvatar } from "../avatar/user-avatar.js";

/**
 * The proposals of one microproject, each with the proposer's professional profile, the message
 * and the conversation. Choosing happens in place; while one choice is on its way, every other
 * choice is locked (choosing declines the rest).
 */
export function MicroProjectProposalsDialog({
  open,
  onOpenChange,
  projectTitle,
  projectStatus,
  loading,
  error,
  onRetry,
  proposals,
  selectingId,
  onSelect,
}: MicroProjectProposalsDialogProps) {
  const copy = useMessages().microProjectProposalsDialog;
  const choosing = projectStatus === "OPEN";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{copy.title}</DialogTitle>

          <DialogDescription className="break-words">
            <span className="font-medium text-text-strong">{projectTitle}</span>
            {". "}
            {choosing ? copy.hint : copy.closedHint}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <ul role="status" aria-label={copy.loading} className="divide-y divide-border-soft">
            {[0, 1].map((key) => (
              <li key={key} className="flex gap-3 py-4">
                <Skeleton className="h-11 w-11 rounded-full" />

                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </li>
            ))}
          </ul>
        ) : error ? (
          <div className="flex flex-wrap items-center justify-between gap-3 py-2">
            <p role="alert" className="text-sm text-text-subtle">
              {copy.loadError}
            </p>

            {onRetry && (
              <Button size="sm" variant="outline" className="rounded-full" onClick={onRetry}>
                {copy.retry}
              </Button>
            )}
          </div>
        ) : proposals.length === 0 ? (
          <p className="py-4 text-sm text-text-subtle">{copy.empty}</p>
        ) : (
          <ul className="divide-y divide-border-soft">
            {proposals.map((proposal) => {
              const { person } = proposal;
              const selecting = selectingId === proposal.id;
              return (
                <li
                  key={proposal.id}
                  className={cn(
                    "min-w-0 space-y-3 py-4",
                    proposal.status === "SELECTED" && "-mx-3 rounded-xl bg-primary-soft/40 px-3",
                  )}
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <AppLink href={person.href} className={cn("shrink-0 rounded-full", FOCUS_RING)}>
                      <UserAvatar
                        src={person.avatar ?? undefined}
                        alt={person.name}
                        className={cn("h-11 w-11", proposal.status === "DECLINED" && "opacity-60")}
                      />
                    </AppLink>

                    <div className="min-w-0 flex-1">
                      <AppLink
                        href={person.href}
                        className={cn(
                          "block truncate font-medium text-text-strong hover:underline",
                          FOCUS_RING,
                        )}
                      >
                        {person.name}
                      </AppLink>

                      <p className="truncate text-sm text-text-subtle">
                        {person.headline || `@${person.username}`}
                      </p>

                      <p className="text-xs text-text-subtle">{proposal.sentLabel}</p>
                    </div>

                    {proposal.status === "SELECTED" && (
                      <span className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-primary">
                        <Check className="h-4 w-4" aria-hidden />
                        {copy.selected}
                      </span>
                    )}

                    {proposal.status === "DECLINED" && (
                      <span className="shrink-0 text-xs text-text-subtle">{copy.declined}</span>
                    )}
                  </div>

                  <p className="max-w-[65ch] whitespace-pre-line break-words text-sm leading-relaxed text-text-strong">
                    {proposal.message}
                  </p>

                  {(proposal.conversationHref || (choosing && proposal.status === "SENT")) && (
                    <div className="flex flex-wrap justify-end gap-2">
                      {proposal.conversationHref && (
                        <AppLink
                          href={proposal.conversationHref}
                          aria-label={copy.talkTo(person.name)}
                          className={cn(
                            buttonVariants({ variant: "outline", size: "sm" }),
                            "rounded-full",
                          )}
                        >
                          <MessageCircle aria-hidden />
                          {copy.talk}
                        </AppLink>
                      )}

                      {choosing && proposal.status === "SENT" && (
                        <Button
                          size="sm"
                          className="rounded-full"
                          disabled={selectingId !== null}
                          aria-label={copy.selectPerson(person.name)}
                          onClick={() => onSelect(proposal.id)}
                        >
                          {selecting ? (
                            <Loader2 className="animate-spin" aria-hidden />
                          ) : (
                            <Check aria-hidden />
                          )}
                          {copy.select}
                        </Button>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </DialogContent>
    </Dialog>
  );
}
