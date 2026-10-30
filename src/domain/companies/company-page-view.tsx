import type { ReactNode } from "react";

import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  CircleCheck,
  Loader2,
  MapPin,
  PenLine,
  Plus,
  Star,
  Users,
} from "lucide-react";

import { useAdapters } from "../../adapters/adapters-context.js";
import { FOCUS_RING } from "../../lib/focus-ring.js";
import { cn } from "../../lib/utils.js";
import { useMessages } from "../../messages/messages-context.js";
import type { CompanyPageViewProps } from "../../types/domain/companies/company-page-view-props.js";
import type { CompanyReviewView } from "../../types/domain/companies/company-review-view.js";
import type { CompanyTeamPanel } from "../../types/domain/companies/company-team-panel.js";
import { AppLink } from "../../ui/app-link.js";
import { Button } from "../../ui/button.js";
import { UserAvatar } from "../avatar/user-avatar.js";
import { CompanyWebsiteLink } from "../jobs/company-website-link.js";

import { CompanyLogo } from "./company-logo.js";
import { MicroProjectCard } from "./micro-project-card.js";

function Section({
  title,
  count,
  children,
  className,
}: {
  title: string;
  count?: number;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("min-w-0 space-y-4", className)}>
      <h2 className="flex items-baseline gap-2 text-sm font-semibold text-text-strong">
        {title}

        {count !== undefined && count > 0 && (
          <span className="text-xs font-normal tabular-nums text-text-subtle">{count}</span>
        )}
      </h2>

      {children}
    </section>
  );
}

function Stars({ rating }: { rating: number }) {
  const copy = useMessages().companyPageView;
  return (
    <span role="img" aria-label={copy.rating(rating)} className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map((value) => (
        <Star
          key={value}
          aria-hidden
          className={cn(
            "h-3.5 w-3.5",
            value <= rating ? "fill-primary text-primary" : "text-text-subtle/40",
          )}
        />
      ))}
    </span>
  );
}

function Review({ review }: { review: CompanyReviewView }) {
  const copy = useMessages().companyPageView;
  return (
    <li className="min-w-0 space-y-3 py-5 first:pt-0 last:pb-0">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <Stars rating={review.rating} />

        <span className="min-w-0 break-words text-xs text-text-subtle">
          {copy.reviewOn(review.projectTitle)} · {review.dateLabel}
        </span>
      </div>

      {review.text && (
        <blockquote className="max-w-[65ch] whitespace-pre-line break-words leading-relaxed text-text-strong">
          {review.text}
        </blockquote>
      )}

      <AppLink
        href={review.person.href}
        className={cn("inline-flex min-w-0 max-w-full items-center gap-2.5", FOCUS_RING)}
      >
        <UserAvatar
          src={review.person.avatar ?? undefined}
          alt={review.person.name}
          className="h-8 w-8 shrink-0"
        />

        <span className="min-w-0">
          <span className="block truncate text-sm font-medium text-text-strong hover:underline">
            {review.person.name}
          </span>

          <span className="block truncate text-xs text-text-subtle">
            {review.person.headline || `@${review.person.username}`}
          </span>
        </span>
      </AppLink>
    </li>
  );
}

function TeamPanel({ team }: { team: CompanyTeamPanel }) {
  const copy = useMessages().companyPageView;
  const done = team.checklist.filter((item) => item.done).length;
  const total = team.checklist.length;
  const counts = [
    { key: "open", label: copy.countOpen, value: team.counts.open },
    { key: "new", label: copy.countNewProposals, value: team.counts.newProposals },
    { key: "progress", label: copy.countInProgress, value: team.counts.inProgress },
    { key: "completed", label: copy.countCompleted, value: team.counts.completed },
  ];

  return (
    <section
      aria-labelledby="company-team-panel"
      className="overflow-hidden rounded-2xl border border-border-soft bg-surface-1"
    >
      <header className="flex flex-wrap items-start justify-between gap-3 px-5 pt-5 sm:px-6">
        <div className="min-w-0">
          <h2 id="company-team-panel" className="font-semibold text-text-strong">
            {copy.teamPanel}
          </h2>

          <p className="text-sm text-text-subtle">{copy.teamPanelHint}</p>
        </div>

        <Button size="sm" className="h-9 rounded-full px-4" onClick={team.onNewProject}>
          <Plus aria-hidden />
          {copy.newProject}
        </Button>
      </header>

      <dl
        aria-label={copy.countsLabel}
        className="mx-5 mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border-soft bg-border-soft sm:mx-6 sm:grid-cols-4"
      >
        {counts.map((item) => (
          <div key={item.key} className="min-w-0 bg-surface-card px-4 py-3">
            <dt className="flex items-start gap-1.5 text-xs text-text-subtle">
              {item.key === "new" && item.value > 0 && (
                <span aria-hidden className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              )}

              <span className="min-w-0 break-words">{item.label}</span>
            </dt>

            <dd className="mt-0.5 text-lg font-semibold tabular-nums text-text-strong">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>

      {total > 0 && (
        <div className="space-y-3 px-5 pb-5 pt-5 sm:px-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="text-sm font-medium text-text-strong">{copy.checklistTitle}</h3>

            <span className="text-xs tabular-nums text-text-subtle">
              {done === total ? copy.checklistDone : copy.checklistProgress(done, total)}
            </span>
          </div>

          <div aria-hidden className="h-1 overflow-hidden rounded-full bg-border-soft">
            <div
              className="h-full rounded-full bg-growth transition-[width] duration-500"
              style={{ width: `${(done / total) * 100}%` }}
            />
          </div>

          <ul className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
            {team.checklist.map((item) => (
              <li key={item.key} className="flex min-w-0 items-start gap-2 text-sm">
                {item.done ? (
                  <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-growth" aria-hidden />
                ) : (
                  <span
                    aria-hidden
                    className="mt-0.5 h-4 w-4 shrink-0 rounded-full border border-dashed border-text-subtle"
                  />
                )}

                {item.done ? (
                  <span className="min-w-0 break-words text-text-subtle line-through decoration-border-soft">
                    {item.label}
                  </span>
                ) : item.onAction ? (
                  <button
                    type="button"
                    onClick={item.onAction}
                    className={cn(
                      "min-w-0 break-words text-left font-medium text-primary underline-offset-4 hover:underline",
                      FOCUS_RING,
                    )}
                  >
                    {item.label}
                  </button>
                ) : (
                  <span className="min-w-0 break-words text-text-strong">{item.label}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

/**
 * A company page: an editorial header (cover, logo, name, the facts and a quiet strip of
 * numbers), the team panel for its members, the microprojects as briefs, the open jobs in a side
 * column and the reviews left by people who delivered. On the phone the jobs drop between the
 * projects and the reviews.
 */
export function CompanyPageView({
  company,
  stats,
  roleLabel,
  backHref,
  onEdit,
  follow,
  team,
  jobs,
  jobsHref,
  projects,
  viewer,
  projectActions,
  reviews,
}: CompanyPageViewProps) {
  const copy = useMessages().companyPageView;
  const cover = useAdapters().resolveMediaUrl(company.cover);
  const strip = [
    { label: copy.openProjects, value: stats.openProjects },
    { label: copy.completedProjects, value: stats.completedProjects },
    { label: copy.openJobs, value: stats.openJobs },
    { label: copy.followers, value: stats.followers },
  ];
  const facts = [
    company.sector && { icon: Building2, text: company.sector },
    company.sizeLabel && { icon: Users, text: company.sizeLabel },
    company.location && { icon: MapPin, text: company.location },
  ].filter((fact): fact is { icon: typeof MapPin; text: string } => Boolean(fact));

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <AppLink
        href={backHref}
        className={cn(
          "inline-flex items-center gap-1.5 text-sm text-text-subtle transition-colors hover:text-text-strong",
          FOCUS_RING,
        )}
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />

        <>{copy.back}</>
      </AppLink>

      <header className="overflow-hidden rounded-2xl border border-border-soft bg-surface-card shadow-card">
        <div className="h-28 w-full overflow-hidden bg-surface-2 sm:h-44">
          {cover ? (
            <img src={cover} alt="" className="h-full w-full object-cover" />
          ) : (
            <div
              aria-hidden
              className="h-full w-full bg-gradient-to-br from-primary-soft via-surface-1 to-surface-2"
            />
          )}
        </div>

        <div className="px-5 pb-6 sm:px-8 sm:pb-8">
          <div className="flex items-end justify-between gap-3">
            <CompanyLogo
              name={company.name}
              logo={company.logo}
              className="-mt-10 h-20 w-20 rounded-2xl text-xl ring-4 ring-surface-card sm:-mt-12 sm:h-24 sm:w-24"
            />

            <div className="flex flex-wrap justify-end gap-2">
              {onEdit && (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-9 rounded-full px-4"
                  onClick={onEdit}
                >
                  <PenLine aria-hidden />
                  {copy.edit}
                </Button>
              )}

              {follow && (
                <Button
                  size="sm"
                  variant={follow.following ? "outline" : "default"}
                  className="h-9 rounded-full px-4"
                  aria-pressed={follow.following}
                  aria-label={copy.followLabel(company.name)}
                  disabled={follow.pending}
                  onClick={follow.onToggle}
                >
                  {follow.pending ? (
                    <Loader2 className="animate-spin" aria-hidden />
                  ) : follow.following ? (
                    <Check aria-hidden />
                  ) : (
                    <Plus aria-hidden />
                  )}
                  {follow.following ? copy.following : copy.follow}
                </Button>
              )}
            </div>
          </div>

          <div className="mt-4 min-w-0 space-y-2">
            <h1 className="text-balance break-words text-2xl font-semibold tracking-tight text-text-strong sm:text-3xl">
              {company.name}
            </h1>

            {(facts.length > 0 || company.website) && (
              <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-text-subtle">
                {facts.map((fact) => (
                  <span key={fact.text} className="inline-flex min-w-0 items-center gap-1">
                    <fact.icon className="h-3.5 w-3.5 shrink-0" aria-hidden />

                    <span className="min-w-0 break-words">{fact.text}</span>
                  </span>
                ))}

                <span className="min-w-0 break-all">
                  <CompanyWebsiteLink website={company.website} />
                </span>
              </p>
            )}

            {roleLabel && (
              <p className="inline-flex rounded-full bg-primary-soft px-2.5 py-0.5 text-xs font-medium text-primary">
                {copy.yourRole(roleLabel)}
              </p>
            )}
          </div>

          <dl
            aria-label={copy.credibility}
            className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-border-soft pt-5 sm:flex sm:flex-wrap sm:gap-x-10"
          >
            {strip.map((item) => (
              <div key={item.label} className="min-w-0">
                <dt className="text-xs text-text-subtle">{item.label}</dt>

                <dd className="mt-0.5 text-sm font-medium tabular-nums text-text-strong">
                  {item.value.toLocaleString("pt-BR")}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </header>

      {team && <TeamPanel team={team} />}

      <div className="grid gap-x-10 gap-y-10 pt-2 lg:grid-cols-[minmax(0,1fr)_17rem]">
        <div className="min-w-0 space-y-10">
          {company.description && (
            <Section title={copy.about}>
              <div className="max-w-[65ch] break-words leading-relaxed text-text-strong">
                {company.description}
              </div>
            </Section>
          )}

          <Section title={copy.projects} count={projects.length}>
            {projects.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-border-soft px-5 py-8 text-center text-sm text-text-subtle">
                {team ? copy.projectsEmptyTeam : copy.projectsEmpty}
              </p>
            ) : (
              <ul className="space-y-4">
                {projects.map((project) => (
                  <li key={project.id} className="min-w-0">
                    <MicroProjectCard project={project} viewer={viewer} actions={projectActions} />
                  </li>
                ))}
              </ul>
            )}
          </Section>
        </div>

        <aside className="min-w-0 space-y-8 lg:sticky lg:top-20 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-start">
          <Section title={copy.jobs} count={stats.openJobs}>
            {jobs.length === 0 ? (
              <p className="text-sm text-text-subtle">{copy.jobsEmpty}</p>
            ) : (
              <ul className="divide-y divide-border-soft border-y border-border-soft">
                {jobs.map((job) => (
                  <li key={job.id}>
                    <AppLink href={job.href} className={cn("group block min-w-0 py-3", FOCUS_RING)}>
                      <span className="block break-words text-sm font-medium text-text-strong group-hover:text-primary">
                        {job.title}
                      </span>

                      <span className="block break-words text-xs text-text-subtle">{job.meta}</span>
                    </AppLink>
                  </li>
                ))}
              </ul>
            )}

            {jobsHref && (
              <AppLink
                href={jobsHref}
                className={cn(
                  "inline-flex items-center gap-1 text-sm font-medium text-primary underline-offset-4 hover:underline",
                  FOCUS_RING,
                )}
              >
                {copy.allJobs}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </AppLink>
            )}
          </Section>
        </aside>

        <Section title={copy.reviews} count={reviews.length} className="lg:col-start-1">
          {reviews.length === 0 ? (
            <p className="text-sm text-text-subtle">{copy.reviewsEmpty}</p>
          ) : (
            <ul className="divide-y divide-border-soft">
              {reviews.map((review, index) => (
                <Review key={`${review.person.username}-${index}`} review={review} />
              ))}
            </ul>
          )}
        </Section>
      </div>
    </div>
  );
}
