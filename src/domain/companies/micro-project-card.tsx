import { type ReactNode, useId, useState } from "react";

import {
  ArrowRight,
  CalendarClock,
  ChevronDown,
  CircleCheck,
  Loader2,
  Send,
  Wallet,
} from "lucide-react";

import { FOCUS_RING } from "../../lib/focus-ring.js";
import { cn } from "../../lib/utils.js";
import { useMessages } from "../../messages/messages-context.js";
import type { MicroProjectCardData } from "../../types/domain/companies/micro-project-card-data.js";
import type { MicroProjectCardProps } from "../../types/domain/companies/micro-project-card-props.js";
import { AppLink } from "../../ui/app-link.js";
import { Button } from "../../ui/button.js";

/** The status dot: color only where something is happening, gray once it is over. */
const STATUS_DOT: Record<MicroProjectCardData["status"], string> = {
  OPEN: "bg-growth",
  IN_PROGRESS: "bg-primary",
  COMPLETED: "bg-text-subtle",
  CANCELLED: "bg-border-soft",
};

function Spinner() {
  return <Loader2 className="animate-spin" aria-hidden />;
}

/**
 * A microproject as a brief: the problem up front, budget and deadline as quiet facts, and the
 * scope, deliverables and acceptance criteria one click away. The footer answers what the viewer
 * can do right now: propose, see where their proposal stands, sign in, activate the professional
 * profile, or (for the team) open the proposals and complete the project.
 */
export function MicroProjectCard({ project, viewer, actions }: MicroProjectCardProps) {
  const copy = useMessages().microProjectCard;
  const [open, setOpen] = useState(false);
  const detailsId = useId();
  const busy = actions.busyId === project.id;
  const hasDetails =
    Boolean(project.scope) || project.deliverables.length > 0 || project.acceptance.length > 0;
  const facts = [
    project.budget && { icon: Wallet, label: copy.budget, value: project.budget },
    project.deadlineLabel && {
      icon: CalendarClock,
      label: copy.deadline,
      value: project.deadlineLabel,
    },
  ].filter((fact): fact is { icon: typeof Wallet; label: string; value: string } => Boolean(fact));

  return (
    <article
      aria-labelledby={`${detailsId}-title`}
      className="min-w-0 rounded-2xl border border-border-soft bg-surface-card p-5 shadow-soft sm:p-6"
    >
      <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-text-subtle">
        <span className="inline-flex items-center gap-1.5 font-medium text-text-strong">
          <span
            aria-hidden
            className={cn("h-1.5 w-1.5 rounded-full", STATUS_DOT[project.status])}
          />
          {copy.status[project.status]}
        </span>

        <span className="min-w-0">{project.publishedLabel}</span>
      </p>

      <h3
        id={`${detailsId}-title`}
        className="mt-2 text-balance break-words text-lg font-semibold tracking-tight text-text-strong"
      >
        {project.title}
      </h3>

      {facts.length > 0 && (
        <dl className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm">
          {facts.map((fact) => (
            <div key={fact.label} className="flex min-w-0 items-center gap-1.5">
              <fact.icon className="h-4 w-4 shrink-0 text-text-subtle" aria-hidden />

              <dt className="sr-only">{fact.label}</dt>

              <dd className="min-w-0 break-words font-medium text-text-strong">{fact.value}</dd>
            </div>
          ))}
        </dl>
      )}

      <div className="mt-4 space-y-1">
        <h4 className="text-xs font-medium text-text-subtle">{copy.problem}</h4>

        <p
          className={cn(
            "max-w-[65ch] whitespace-pre-line break-words text-sm leading-relaxed text-text-strong",
            !open && hasDetails && "line-clamp-4",
          )}
        >
          {project.problem}
        </p>
      </div>

      {hasDetails && (
        <>
          <button
            type="button"
            aria-expanded={open}
            aria-controls={detailsId}
            onClick={() => setOpen((value) => !value)}
            className={cn(
              "mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary underline-offset-4 hover:underline",
              FOCUS_RING,
            )}
          >
            {open ? copy.hideDetails : copy.showDetails}

            <ChevronDown
              className={cn("h-4 w-4 transition-transform", open && "rotate-180")}
              aria-hidden
            />
          </button>

          <div
            id={detailsId}
            hidden={!open}
            className="mt-4 space-y-5 border-t border-border-soft pt-4"
          >
            {project.scope && (
              <section className="space-y-1">
                <h4 className="text-xs font-medium text-text-subtle">{copy.scope}</h4>

                <p className="max-w-[65ch] whitespace-pre-line break-words text-sm leading-relaxed text-text-strong">
                  {project.scope}
                </p>
              </section>
            )}

            {project.deliverables.length > 0 && (
              <section className="space-y-2">
                <h4 className="text-xs font-medium text-text-subtle">{copy.deliverables}</h4>

                <ul className="space-y-1.5 text-sm text-text-strong">
                  {project.deliverables.map((item, index) => (
                    <li key={index} className="flex min-w-0 gap-2.5">
                      <span
                        aria-hidden
                        className="mt-2 h-1 w-1 shrink-0 rounded-full bg-text-subtle"
                      />

                      <span className="min-w-0 break-words">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {project.acceptance.length > 0 && (
              <section className="space-y-2">
                <h4 className="text-xs font-medium text-text-subtle">{copy.acceptance}</h4>

                <ul className="space-y-1.5 text-sm text-text-strong">
                  {project.acceptance.map((item, index) => (
                    <li key={index} className="flex min-w-0 gap-2">
                      <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-growth" aria-hidden />

                      <span className="min-w-0 break-words">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </>
      )}

      <Footer project={project} viewer={viewer} actions={actions} busy={busy} />
    </article>
  );
}

function Footer({ project, viewer, actions, busy }: MicroProjectCardProps & { busy: boolean }) {
  const copy = useMessages().microProjectCard;
  const isOpen = project.status === "OPEN";
  const linkClass = cn(
    "inline-flex items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline",
    FOCUS_RING,
  );

  let content: ReactNode = null;

  if (viewer === "TEAM") {
    content = (
      <>
        <span className="min-w-0 text-sm text-text-subtle">
          {copy.proposals(project.proposalCount ?? 0)}
        </span>

        <span className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            className="rounded-full"
            disabled={busy}
            onClick={() => actions.onShowProposals(project.id)}
          >
            {copy.showProposals}
          </Button>

          {project.status === "IN_PROGRESS" && (
            <Button
              size="sm"
              className="rounded-full"
              disabled={busy}
              onClick={() => actions.onComplete(project.id)}
            >
              {busy ? <Spinner /> : <CircleCheck aria-hidden />}
              {copy.complete}
            </Button>
          )}
        </span>
      </>
    );
  } else if (project.myProposal) {
    const mine = {
      SENT: copy.mySent,
      SELECTED: copy.mySelected,
      DECLINED: copy.myDeclined,
    }[project.myProposal];
    content = (
      <p
        className={cn(
          "min-w-0 text-sm",
          project.myProposal === "SELECTED" ? "font-medium text-primary" : "text-text-subtle",
        )}
      >
        {mine}
      </p>
    );
  } else if (!isOpen) {
    content = <p className="text-sm text-text-subtle">{copy.closed}</p>;
  } else if (viewer === "SIGN_IN") {
    content = (
      <AppLink href={actions.signInHref} className={linkClass}>
        {copy.signIn}
        <ArrowRight className="h-4 w-4" aria-hidden />
      </AppLink>
    );
  } else if (viewer === "PROFESSIONAL_REQUIRED") {
    content = (
      <>
        <p className="min-w-0 text-sm text-text-subtle">{copy.professionalRequired}</p>

        <AppLink href={actions.professionalSetupHref} className={linkClass}>
          {copy.professionalSetup}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </AppLink>
      </>
    );
  } else {
    content = (
      <Button
        size="sm"
        className="ml-auto rounded-full"
        disabled={busy}
        aria-label={copy.proposeTo(project.title)}
        onClick={() => actions.onPropose(project.id)}
      >
        {busy ? <Spinner /> : <Send aria-hidden />}
        {copy.propose}
      </Button>
    );
  }

  return (
    <div
      aria-live="polite"
      className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border-soft pt-4"
    >
      {content}
    </div>
  );
}
