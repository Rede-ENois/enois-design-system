import type { ReactNode } from "react";

import { ArrowLeft, BadgeCheck, Building2, ExternalLink, MapPin, PenLine } from "lucide-react";

import { FOCUS_RING } from "../../lib/focus-ring.js";
import { cn } from "../../lib/utils.js";
import { useMessages } from "../../messages/messages-context.js";
import type { ProfessionalProfileProps } from "../../types/domain/profile/professional-profile-props.js";
import type { ProfileExperienceItem } from "../../types/domain/profile/profile-experience-item.js";
import { AppLink } from "../../ui/app-link.js";
import { buttonVariants } from "../../ui/button-variants.js";
import { UserAvatar } from "../avatar/user-avatar.js";

/** "https://www.site.dev/me/" → "site.dev/me": the row reads as an address, not a URL dump. */
function linkLabel(href: string): string {
  try {
    const url = new URL(href);
    const path = url.pathname.replace(/\/+$/, "");
    return `${url.hostname.replace(/^www\./, "")}${path}`;
  } catch {
    return href;
  }
}

function Section({
  title,
  children,
  className,
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("min-w-0 space-y-4", className)}>
      <h2 className="text-sm font-semibold text-text-strong">{title}</h2>

      {children}
    </section>
  );
}

function TimelineItem({ item, last }: { item: ProfileExperienceItem; last: boolean }) {
  const messages = useMessages();
  const copy = messages.professionalProfile;
  const current = Boolean(item.currentlyHere);
  const period =
    item.startLabel || item.endLabel || current
      ? copy.period(item.startLabel, current ? null : item.endLabel)
      : null;
  const duration =
    item.startLabel && item.months !== null
      ? messages.profileExperiencesSection.duration(item.months)
      : null;

  return (
    <li className="relative grid grid-cols-[0.75rem_minmax(0,1fr)] gap-x-4 pb-7 last:pb-0">
      {/* The rail: a hairline joining the dots; the current position is the one colored dot. */}
      {!last && (
        <span
          aria-hidden
          className="absolute bottom-0 left-[0.3125rem] top-4 w-px bg-border-soft"
        />
      )}

      <span
        aria-hidden
        className={cn(
          "mt-1.5 h-2.5 w-2.5 rounded-full",
          current ? "bg-primary" : "border border-border-soft bg-surface-card",
        )}
      />

      <div className="min-w-0">
        <h3 className="break-words font-medium text-text-strong">{item.title}</h3>

        <p className="break-words text-sm text-text-subtle">
          {[item.company, item.location].filter(Boolean).join(" · ")}
        </p>

        {(period || duration) && (
          <p className="mt-0.5 text-xs tabular-nums text-text-subtle">
            {[period, duration].filter(Boolean).join(" · ")}
          </p>
        )}

        {item.description && (
          <p className="mt-2 max-w-[65ch] whitespace-pre-line break-words text-sm leading-relaxed text-text-subtle">
            {item.description}
          </p>
        )}
      </div>
    </li>
  );
}

/**
 * The public work profile: an editorial header (name, headline, professional @), a quiet
 * credibility strip, the trajectory as a timeline and the BUSINESS posts. The side column
 * (skills, education, certifications, links) sits beside the story on desktop and between the
 * story and the posts on the phone, so the feed never pushes the facts out of reach.
 */
export function ProfessionalProfile({
  profile,
  experiences,
  educations,
  certifications,
  banner,
  editHref,
  backHref,
  statusNote,
  posts,
}: ProfessionalProfileProps) {
  const copy = useMessages().professionalProfile;
  const credibility = [
    profile.reputation != null && {
      label: copy.reputation,
      value: profile.reputation.toLocaleString("pt-BR"),
    },
    profile.memberSinceLabel && { label: copy.memberSince, value: profile.memberSinceLabel },
    profile.identityVerified && { label: copy.identity, value: copy.identityVerified },
  ].filter((item): item is { label: string; value: string } => Boolean(item));
  const hasAside =
    profile.skills.length > 0 ||
    educations.length > 0 ||
    certifications.length > 0 ||
    profile.links.length > 0;

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
        <div className="h-28 w-full overflow-hidden bg-surface-2 sm:h-40 [&>*]:h-full [&>*]:w-full">
          {banner ?? (
            <div
              aria-hidden
              className="bg-gradient-to-br from-primary-soft via-surface-1 to-surface-2"
            />
          )}
        </div>

        <div className="px-5 pb-6 sm:px-8 sm:pb-8">
          <div className="flex items-end justify-between gap-3">
            <UserAvatar
              src={profile.avatar || undefined}
              alt={profile.name}
              className="-mt-10 h-20 w-20 shrink-0 ring-4 ring-surface-card sm:-mt-12 sm:h-24 sm:w-24"
            />

            {editHref && (
              <AppLink
                href={editHref}
                className={cn(buttonVariants({ variant: "outline", size: "sm" }), "rounded-full")}
              >
                <PenLine aria-hidden />

                <>{copy.edit}</>
              </AppLink>
            )}
          </div>

          <div className="mt-4 min-w-0 space-y-2">
            <h1 className="flex flex-wrap items-center gap-x-2 gap-y-1 text-balance break-words text-2xl font-semibold tracking-tight text-text-strong sm:text-3xl">
              <span className="min-w-0">{profile.name}</span>

              {profile.identityVerified && (
                <BadgeCheck
                  className="h-5 w-5 shrink-0 text-primary sm:h-6 sm:w-6"
                  role="img"
                  aria-label={copy.verified}
                />
              )}
            </h1>

            {profile.headline && (
              <p className="max-w-[60ch] break-words text-base leading-relaxed text-text-strong sm:text-lg">
                {profile.headline}
              </p>
            )}

            <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-text-subtle">
              <span className="min-w-0 break-all">
                <span className="sr-only">{copy.usernameLabel}: </span>@{profile.username}
              </span>

              {profile.location && (
                <span className="inline-flex min-w-0 items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  {profile.location}
                </span>
              )}

              {profile.industry && (
                <span className="inline-flex min-w-0 items-center gap-1">
                  <Building2 className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  {profile.industry}
                </span>
              )}
            </p>
          </div>

          {credibility.length > 0 && (
            <dl
              aria-label={copy.credibility}
              className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-border-soft pt-5 sm:flex sm:flex-wrap sm:gap-x-10"
            >
              {credibility.map((item) => (
                <div key={item.label} className="min-w-0">
                  <dt className="text-xs text-text-subtle">{item.label}</dt>

                  <dd className="mt-0.5 text-sm font-medium tabular-nums text-text-strong">
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </header>

      {statusNote && (
        <p className="rounded-xl border border-border-soft bg-surface-2 px-4 py-3 text-sm text-text-strong">
          {statusNote}
        </p>
      )}

      <div
        className={cn(
          "grid gap-x-10 gap-y-10 pt-2",
          hasAside && "lg:grid-cols-[minmax(0,1fr)_17rem]",
        )}
      >
        {(profile.bio || experiences.length > 0) && (
          <div className="min-w-0 space-y-10">
            {profile.bio && (
              <Section title={copy.about}>
                <p className="max-w-[65ch] whitespace-pre-line break-words leading-relaxed text-text-strong">
                  {profile.bio}
                </p>
              </Section>
            )}

            {experiences.length > 0 && (
              <Section title={copy.trajectory}>
                <ol>
                  {experiences.map((item, index) => (
                    <TimelineItem
                      key={item.id}
                      item={item}
                      last={index === experiences.length - 1}
                    />
                  ))}
                </ol>
              </Section>
            )}
          </div>
        )}

        {hasAside && (
          <aside className="min-w-0 space-y-8 lg:sticky lg:top-20 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-start">
            {profile.skills.length > 0 && (
              <Section title={copy.skills}>
                <ul className="flex flex-wrap gap-2">
                  {profile.skills.map((skill) => (
                    <li
                      key={skill}
                      className="max-w-full break-words rounded-full border border-border-soft bg-surface-card px-3 py-1 text-xs text-text-strong"
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {educations.length > 0 && (
              <Section title={copy.education}>
                <ul className="space-y-3">
                  {educations.map((item) => (
                    <li key={item.id} className="min-w-0">
                      <p className="break-words text-sm font-medium text-text-strong">
                        {item.school}
                      </p>

                      {(item.degree || item.field) && (
                        <p className="break-words text-sm text-text-subtle">
                          {[item.degree, item.field].filter(Boolean).join(", ")}
                        </p>
                      )}

                      {item.periodLabel && (
                        <p className="text-xs tabular-nums text-text-subtle">{item.periodLabel}</p>
                      )}
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {certifications.length > 0 && (
              <Section title={copy.certifications}>
                <ul className="space-y-3">
                  {certifications.map((item) => (
                    <li key={item.id} className="min-w-0">
                      <p className="break-words text-sm font-medium text-text-strong">
                        {item.name}
                      </p>

                      {(item.issuer || item.issuedLabel) && (
                        <p className="break-words text-xs text-text-subtle">
                          {[item.issuer, item.issuedLabel].filter(Boolean).join(" · ")}
                        </p>
                      )}

                      {item.credentialUrl && (
                        <a
                          href={item.credentialUrl}
                          target="_blank"
                          rel="noreferrer noopener"
                          className={cn(
                            "mt-1 inline-flex items-center gap-1 text-xs text-primary underline-offset-4 hover:underline",
                            FOCUS_RING,
                          )}
                        >
                          {copy.viewCredential}
                          <ExternalLink className="h-3 w-3" aria-hidden />
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {profile.links.length > 0 && (
              <Section title={copy.links}>
                <ul className="divide-y divide-border-soft border-y border-border-soft">
                  {profile.links.map((link) => (
                    <li key={link}>
                      <a
                        href={link}
                        target="_blank"
                        rel="noreferrer noopener"
                        className={cn(
                          "flex items-center justify-between gap-3 py-2.5 text-sm text-text-strong transition-colors hover:text-primary",
                          FOCUS_RING,
                        )}
                      >
                        <span className="min-w-0 truncate">{linkLabel(link)}</span>

                        <ExternalLink
                          className="h-3.5 w-3.5 shrink-0 text-text-subtle"
                          aria-hidden
                        />
                      </a>
                    </li>
                  ))}
                </ul>
              </Section>
            )}
          </aside>
        )}

        <Section title={copy.posts} className="lg:col-start-1">
          {posts}
        </Section>
      </div>
    </div>
  );
}
