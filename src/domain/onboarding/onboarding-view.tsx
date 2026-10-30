import { type KeyboardEvent, type ReactNode, useEffect, useId, useRef, useState } from "react";

import { Check, Loader2, Plus, RotateCcw, Users, X } from "lucide-react";

import { useAdapters } from "../../adapters/adapters-context.js";
import { cn } from "../../lib/utils.js";
import { useMessages } from "../../messages/messages-context.js";
import type { OnboardingViewProps } from "../../types/domain/onboarding/onboarding-view-props.js";
import { Button } from "../../ui/button.js";
import { Pill } from "../../ui/pill.js";
import { Skeleton } from "../../ui/skeleton.js";
import { UserAvatar } from "../avatar/user-avatar.js";

const STEPS = ["interests", "pack"] as const;
const SUGGESTION_LIMIT = 8;

/**
 * Two-step onboarding (interests, then the starter pack) so newcomers never land on an empty
 * feed. Fully controlled: the app owns the choices and calls the API; this only draws. Focus moves
 * to the step heading on every step change so keyboard and screen reader users know where they are.
 */
export function OnboardingView({
  step,
  onStepChange,
  topics,
  selectedTopics,
  onToggleTopic,
  skills,
  skillSuggestions,
  onAddSkill,
  onRemoveSkill,
  maxSkills = 20,
  maxSkillLength = 60,
  packLoading,
  packError,
  onRetryPack,
  communities,
  groups,
  people,
  selectedCommunityIds,
  selectedGroupIds,
  selectedPersonIds,
  onToggleCommunity,
  onToggleGroup,
  onTogglePerson,
  maxCommunities = 6,
  maxGroups = 6,
  maxPeople = 8,
  submitting,
  errorMessage,
  onComplete,
  onSkip,
}: OnboardingViewProps) {
  const messages = useMessages().onboardingView;
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);
  const index = STEPS.indexOf(step);

  // Focus the heading only when the step changes, never on mount (do not steal page focus).
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [step]);

  return (
    <section
      aria-labelledby="onboarding-heading"
      aria-busy={submitting || undefined}
      className="mx-auto w-full max-w-2xl"
    >
      <div className="mb-6 space-y-2">
        <p className="text-xs font-medium text-text-subtle">
          {messages.progress(index + 1, STEPS.length)}
        </p>

        <div aria-hidden className="flex gap-1.5">
          {STEPS.map((name, position) => (
            <span
              key={name}
              className={cn(
                "h-1 flex-1 rounded-full transition-colors duration-300",
                position <= index ? "bg-primary" : "bg-surface-2",
              )}
            />
          ))}
        </div>
      </div>

      <header className="mb-6 space-y-1.5">
        <h1
          id="onboarding-heading"
          ref={headingRef}
          tabIndex={-1}
          className="text-2xl font-semibold tracking-tight text-text-strong text-balance focus:outline-none"
        >
          {step === "interests" ? messages.interestsTitle : messages.packTitle}
        </h1>

        <p className="max-w-prose text-sm text-text-subtle">
          {step === "interests" ? messages.interestsDescription : messages.packDescription}
        </p>
      </header>

      {step === "interests" ? (
        <div className="space-y-8">
          <fieldset className="space-y-3">
            <legend className="text-sm font-semibold text-text-strong">
              {messages.topicsLabel}
            </legend>

            <p className="text-xs text-text-subtle">{messages.topicsHint}</p>

            <div className="flex flex-wrap gap-2">
              {topics.map((topic) => {
                const active = selectedTopics.includes(topic.value);

                return (
                  <Pill
                    key={topic.value}
                    active={active}
                    onClick={() => onToggleTopic(topic.value)}
                  >
                    <span className="inline-flex items-center gap-1.5">
                      {active && <Check aria-hidden className="h-3.5 w-3.5" />}

                      <>{topic.label}</>
                    </span>
                  </Pill>
                );
              })}
            </div>
          </fieldset>

          <SkillsField
            skills={skills}
            suggestions={skillSuggestions}
            max={maxSkills}
            maxLength={maxSkillLength}
            onAdd={onAddSkill}
            onRemove={onRemoveSkill}
          />
        </div>
      ) : packError ? (
        <div
          role="alert"
          className="surface-card flex flex-col items-center gap-3 px-4 py-10 text-center"
        >
          <p className="text-sm font-medium text-text-strong">{messages.error}</p>

          <Button variant="outline" className="w-auto rounded-full" onClick={onRetryPack}>
            <RotateCcw aria-hidden />

            <>{messages.retry}</>
          </Button>
        </div>
      ) : (
        <div className="space-y-8">
          <PackSection
            title={messages.communitiesTitle}
            count={messages.communitiesCount(selectedCommunityIds.length, maxCommunities)}
            full={selectedCommunityIds.length >= maxCommunities}
            loading={packLoading}
            empty={communities.length === 0}
            emptyText={messages.communitiesEmpty}
          >
            {communities.map((community) => (
              <PackCard
                key={community.id}
                selected={selectedCommunityIds.includes(community.id)}
                full={selectedCommunityIds.length >= maxCommunities}
                onToggle={() => onToggleCommunity(community.id)}
                media={<GroupAvatar src={community.avatar} name={community.name} />}
                title={community.name}
                meta={community.topicLabel}
                members={messages.members(community.memberCount)}
                description={community.description}
              />
            ))}
          </PackSection>

          <PackSection
            title={messages.groupsTitle}
            count={messages.groupsCount(selectedGroupIds.length, maxGroups)}
            full={selectedGroupIds.length >= maxGroups}
            loading={packLoading}
            empty={groups.length === 0}
            emptyText={messages.groupsEmpty}
          >
            {groups.map((group) => (
              <PackCard
                key={group.id}
                selected={selectedGroupIds.includes(group.id)}
                full={selectedGroupIds.length >= maxGroups}
                onToggle={() => onToggleGroup(group.id)}
                media={<GroupAvatar src={group.avatar} name={group.name} />}
                title={group.name}
                meta={group.topicLabel}
                members={messages.members(group.memberCount)}
                description={group.description}
              />
            ))}
          </PackSection>

          <PackSection
            title={messages.peopleTitle}
            count={messages.peopleCount(selectedPersonIds.length, maxPeople)}
            full={selectedPersonIds.length >= maxPeople}
            loading={packLoading}
            empty={people.length === 0}
            emptyText={messages.peopleEmpty}
          >
            {people.map((person) => (
              <PackCard
                key={person.id}
                selected={selectedPersonIds.includes(person.id)}
                full={selectedPersonIds.length >= maxPeople}
                onToggle={() => onTogglePerson(person.id)}
                media={
                  <UserAvatar
                    src={person.avatar}
                    alt={person.name}
                    className="h-10 w-10"
                    frameOverflow="hidden"
                  />
                }
                title={person.name}
                meta={`@${person.username}`}
                description={person.headline}
              />
            ))}
          </PackSection>
        </div>
      )}

      <div aria-live="polite" className="mt-6 empty:hidden">
        {errorMessage && (
          <p
            role="alert"
            className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-2.5 text-sm text-destructive"
          >
            {errorMessage}
          </p>
        )}
      </div>

      <footer className="mt-8 flex flex-col gap-2 border-t border-border-soft pt-5 sm:flex-row-reverse sm:items-center sm:justify-between">
        {step === "interests" ? (
          <Button className="sm:w-auto" disabled={submitting} onClick={() => onStepChange("pack")}>
            {messages.next}
          </Button>
        ) : (
          <Button className="sm:w-auto" disabled={submitting || packLoading} onClick={onComplete}>
            {submitting && <Loader2 aria-hidden className="motion-safe:animate-spin" />}

            <>{submitting ? messages.submitting : messages.complete}</>
          </Button>
        )}

        <div className="flex items-center justify-between gap-2 sm:justify-start">
          {step === "pack" && (
            <Button
              variant="ghost"
              className="w-auto rounded-full px-4"
              disabled={submitting}
              onClick={() => onStepChange("interests")}
            >
              {messages.back}
            </Button>
          )}

          <Button
            variant="ghost"
            className="ml-auto w-auto rounded-full px-4 text-text-subtle sm:ml-0"
            disabled={submitting}
            onClick={onSkip}
          >
            {messages.skip}
          </Button>
        </div>
      </footer>
    </section>
  );
}

/** Skills field: removable tokens, free typing and suggestions supplied by the app. */
function SkillsField({
  skills,
  suggestions,
  max,
  maxLength,
  onAdd,
  onRemove,
}: {
  skills: string[];
  suggestions: string[];
  max: number;
  maxLength: number;
  onAdd: (skill: string) => void;
  onRemove: (skill: string) => void;
}) {
  const messages = useMessages().onboardingView;
  const id = useId();
  const [draft, setDraft] = useState("");
  const full = skills.length >= max;
  const taken = new Set(skills.map((skill) => skill.toLocaleLowerCase("pt-BR")));
  const query = draft.trim().toLocaleLowerCase("pt-BR");
  const visibleSuggestions = full
    ? []
    : suggestions
        .filter((suggestion) => {
          const key = suggestion.toLocaleLowerCase("pt-BR");
          return !taken.has(key) && key.includes(query);
        })
        .slice(0, SUGGESTION_LIMIT);

  const add = (raw: string) => {
    const skill = raw.trim().slice(0, maxLength);
    if (!skill || full || taken.has(skill.toLocaleLowerCase("pt-BR"))) return;
    onAdd(skill);
    setDraft("");
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      add(draft);
    } else if (event.key === "Backspace" && draft === "" && skills.length > 0) {
      onRemove(skills[skills.length - 1]);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-semibold text-text-strong">
          {messages.skillsLabel}
        </label>

        <span aria-live="polite" className="shrink-0 text-xs tabular-nums text-text-subtle">
          {messages.skillsCount(skills.length, max)}
        </span>
      </div>

      <p id={`${id}-hint`} className="text-xs text-text-subtle">
        {full ? messages.skillsFull : messages.skillsHint}
      </p>

      <div className="flex min-h-11 flex-wrap items-center gap-1.5 rounded-xl border border-input bg-transparent px-2 py-1.5 transition-colors focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
        {skills.map((skill) => (
          <span
            key={skill}
            className="inline-flex min-w-0 max-w-full items-center gap-1 rounded-full bg-surface-2 py-1 pl-3 pr-1 text-sm text-text-strong"
          >
            <span className="min-w-0 truncate">{skill}</span>

            <button
              type="button"
              aria-label={messages.removeSkill(skill)}
              onClick={() => onRemove(skill)}
              className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-text-subtle transition hover:bg-surface-3 hover:text-text-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            >
              <X aria-hidden className="h-3.5 w-3.5" />
            </button>
          </span>
        ))}

        <input
          id={id}
          value={draft}
          maxLength={maxLength}
          disabled={full}
          aria-describedby={`${id}-hint`}
          placeholder={skills.length === 0 ? messages.skillsPlaceholder : undefined}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={onKeyDown}
          className="h-8 min-w-[8rem] flex-1 bg-transparent px-1 text-base text-text-strong placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed md:text-sm"
        />
      </div>

      {visibleSuggestions.length > 0 && (
        <div role="group" aria-label={messages.suggestionsLabel} className="flex flex-wrap gap-1.5">
          {visibleSuggestions.map((suggestion) => (
            <Pill key={suggestion} size="sm" onClick={() => add(suggestion)}>
              <span className="inline-flex items-center gap-1">
                <Plus aria-hidden className="h-3 w-3" />

                <>{suggestion}</>
              </span>
            </Pill>
          ))}
        </div>
      )}
    </div>
  );
}

/** One starter pack section with its own quiet counter, skeleton and empty state. */
function PackSection({
  title,
  count,
  full,
  loading,
  empty,
  emptyText,
  children,
}: {
  title: string;
  count: string;
  full: boolean;
  loading: boolean;
  empty: boolean;
  emptyText: string;
  children: ReactNode;
}) {
  const messages = useMessages().onboardingView;
  const id = useId();

  return (
    <section aria-labelledby={id} className="space-y-3">
      <div className="flex items-baseline justify-between gap-3">
        <h2 id={id} className="text-base font-semibold text-text-strong">
          {title}
        </h2>

        {!loading && !empty && (
          <span aria-live="polite" className="shrink-0 text-xs tabular-nums text-text-subtle">
            {count}
          </span>
        )}
      </div>

      {loading ? (
        <div role="status" aria-label={messages.loading} className="grid gap-2 sm:grid-cols-2">
          {Array.from({ length: 2 }, (_, position) => (
            <div
              key={position}
              className="flex items-center gap-3 rounded-2xl border border-border-soft p-3"
            >
              <Skeleton className="h-10 w-10 shrink-0 rounded-full" />

              <div className="flex-1 space-y-2">
                <Skeleton className="h-3.5 w-2/3" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : empty ? (
        <p className="rounded-2xl bg-surface-2/60 px-4 py-3 text-sm text-text-subtle">
          {emptyText}
        </p>
      ) : (
        <>
          <div className="grid gap-2 sm:grid-cols-2">{children}</div>

          {full && <p className="text-xs text-text-subtle">{messages.limitReached}</p>}
        </>
      )}
    </section>
  );
}

/** Selectable card: the whole button toggles, `aria-pressed` carries the state. */
function PackCard({
  selected,
  full,
  onToggle,
  media,
  title,
  meta,
  members,
  description,
}: {
  selected: boolean;
  full: boolean;
  onToggle: () => void;
  media: ReactNode;
  title: string;
  meta: string | null;
  members?: string;
  description: string | null;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      // At the cap, unselected cards stop accepting clicks; selected ones stay removable.
      disabled={full && !selected}
      onClick={onToggle}
      className={cn(
        "group flex min-w-0 items-start gap-3 rounded-2xl border p-3 text-left transition-colors duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
        "disabled:cursor-not-allowed disabled:opacity-50",
        selected
          ? "border-primary/60 bg-primary/5"
          : "border-border-soft bg-surface-card hover:border-primary/40",
      )}
    >
      {/* Decorative: the name is already the accessible label of the card. */}
      <span aria-hidden className="shrink-0">
        {media}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-text-strong">{title}</span>

        {(meta || members) && (
          <span className="mt-0.5 flex min-w-0 items-center gap-2 text-xs text-text-subtle">
            {meta && <span className="min-w-0 truncate">{meta}</span>}

            {members && (
              <span className="inline-flex shrink-0 items-center gap-1 tabular-nums">
                <Users aria-hidden className="h-3 w-3" />

                <>{members}</>
              </span>
            )}
          </span>
        )}

        {description && (
          <span className="mt-1 line-clamp-2 block text-xs text-muted-foreground">
            {description}
          </span>
        )}
      </span>

      <span
        aria-hidden
        className={cn(
          "mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border transition-colors duration-200",
          selected
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border-soft text-transparent",
        )}
      >
        <Check className="h-3 w-3" />
      </span>
    </button>
  );
}

/** Community/group avatar: the image, or the initial on a theme surface. */
function GroupAvatar({ src, name }: { src: string | null; name: string }) {
  const { resolveMediaUrl } = useAdapters();

  return src ? (
    <img src={resolveMediaUrl(src)} alt="" className="h-10 w-10 rounded-xl object-cover" />
  ) : (
    <span
      aria-hidden
      className="grid h-10 w-10 place-items-center rounded-xl bg-surface-2 text-sm font-semibold text-text-subtle"
    >
      {name.trim().charAt(0).toUpperCase()}
    </span>
  );
}
