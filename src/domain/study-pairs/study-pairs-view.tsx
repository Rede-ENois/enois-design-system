import { useEffect, useId, useRef, useState } from "react";

import { Info, Search } from "lucide-react";

import { useMessages } from "../../messages/messages-context.js";
import type { StudyPairSearchGoal } from "../../types/domain/study-pairs/study-pair-search-goal.js";
import type { StudyPairsErrorCode } from "../../types/domain/study-pairs/study-pairs-error-code.js";
import type { StudyPairsViewProps } from "../../types/domain/study-pairs/study-pairs-view-props.js";
import { AppLink } from "../../ui/app-link.js";
import { Button } from "../../ui/button.js";
import { Input } from "../../ui/input.js";
import { Skeleton } from "../../ui/skeleton.js";

import { StudyPairCard } from "./study-pair-card.js";

const GOAL_MAX = 120;

/**
 * Página do par de estudo. Ordem pensada para quem volta: primeiro os pares (o check-in da semana
 * é a ação que importa), depois o pedido em espera e, por fim, o formulário para pedir um par,
 * que some quando já há pedido aberto ou o limite de pares foi atingido.
 */
export function StudyPairsView({
  loading = false,
  loadError = false,
  onRetry,
  pairs,
  openRequest,
  maxPairs = 2,
  topics = [],
  popularGoals = [],
  onSearchGoals,
  onRequest,
  requesting = false,
  requestError = null,
  birthDateHref,
  verifyEmailHref,
  errorAction,
  onCancelRequest,
  cancelling = false,
  onSaveCheckin,
  checkinStatus = {},
  onEndPair,
  endingPairId = null,
}: StudyPairsViewProps) {
  const messages = useMessages().studyPairs;
  const headingId = useId();

  const header = (
    <header className="space-y-1">
      <h1 id={headingId} className="text-xl font-semibold text-balance text-text-strong">
        {messages.title}
      </h1>

      <p className="max-w-prose text-sm text-text-subtle">{messages.intro}</p>
    </header>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        {header}

        <div role="status" className="surface-card space-y-4 p-4">
          <span className="sr-only">{messages.loading}</span>

          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />

            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3.5 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
          </div>

          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="space-y-6">
        {header}

        <div role="alert" className="surface-card flex flex-wrap items-center gap-3 p-4">
          <p className="min-w-0 flex-1 text-sm text-text-subtle">{messages.loadError}</p>

          <Button size="sm" variant="outline" className="rounded-full" onClick={onRetry}>
            {messages.retry}
          </Button>
        </div>
      </div>
    );
  }

  const atLimit = pairs.length >= maxPairs;

  return (
    <div className="space-y-6">
      {header}

      {pairs.length > 0 && (
        <section aria-labelledby={`${headingId}-pairs`} className="space-y-3">
          <h2 id={`${headingId}-pairs`} className="sr-only">
            {messages.pairsTitle}
          </h2>

          {pairs.map((pair) => (
            <StudyPairCard
              key={pair.id}
              pair={pair}
              status={checkinStatus[pair.id]}
              ending={endingPairId === pair.id}
              onSaveCheckin={onSaveCheckin}
              onEndPair={onEndPair}
            />
          ))}
        </section>
      )}

      {openRequest ? (
        <section
          aria-labelledby={`${headingId}-waiting`}
          className="surface-card flex flex-col gap-3 p-4"
        >
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-surface-2 text-text-subtle">
              <Search aria-hidden className="h-5 w-5" />
            </span>

            <div className="min-w-0 space-y-1">
              <h2 id={`${headingId}-waiting`} className="text-base font-medium text-text-strong">
                {messages.waitingTitle}
              </h2>

              <p className="text-sm text-text-subtle">{messages.waitingBody}</p>
            </div>
          </div>

          <div className="rounded-xl bg-surface-2 p-3">
            <p className="text-xs text-text-subtle">{messages.waitingGoal}</p>

            <p className="mt-0.5 text-sm font-medium break-words text-text-strong">
              {openRequest.goal}
            </p>

            {openRequest.topicLabel && (
              <p className="mt-0.5 text-xs text-text-subtle">{openRequest.topicLabel}</p>
            )}
          </div>

          <div className="flex justify-end">
            <Button
              size="sm"
              variant="ghost"
              className="rounded-full"
              disabled={cancelling}
              onClick={onCancelRequest}
            >
              {cancelling ? messages.cancelling : messages.cancelRequest}
            </Button>
          </div>
        </section>
      ) : atLimit ? (
        <p className="flex items-start gap-2 px-1 text-sm text-text-subtle">
          <Info aria-hidden className="mt-0.5 h-4 w-4 shrink-0" />

          <span className="min-w-0">{messages.limitNote(maxPairs)}</span>
        </p>
      ) : (
        <RequestForm
          topics={topics}
          popularGoals={popularGoals}
          onSearchGoals={onSearchGoals}
          onRequest={onRequest}
          requesting={requesting}
          requestError={requestError}
          birthDateHref={birthDateHref}
          verifyEmailHref={verifyEmailHref}
          errorAction={errorAction}
        />
      )}
    </div>
  );
}

function RequestForm({
  topics,
  popularGoals,
  onSearchGoals,
  onRequest,
  requesting,
  requestError,
  birthDateHref,
  verifyEmailHref,
  errorAction,
}: Required<Pick<StudyPairsViewProps, "topics" | "popularGoals" | "onRequest" | "requesting">> &
  Pick<StudyPairsViewProps, "requestError" | "birthDateHref" | "verifyEmailHref" | "errorAction"> &
  Pick<StudyPairsViewProps, "onSearchGoals">) {
  const messages = useMessages().studyPairs;
  const id = useId();
  const [goal, setGoal] = useState("");
  const [topic, setTopic] = useState("");
  const [missingGoal, setMissingGoal] = useState(false);

  const error: StudyPairsErrorCode | null = missingGoal
    ? "STUDY_GOAL_REQUIRED"
    : (requestError ?? null);
  const errorLink =
    error === "BIRTH_DATE_REQUIRED" && birthDateHref
      ? { href: birthDateHref, label: messages.birthDateLink }
      : error === "EMAIL_NOT_VERIFIED" && verifyEmailHref
        ? { href: verifyEmailHref, label: messages.verifyEmailLink }
        : null;
  const goalInvalid = error === "STUDY_GOAL_REQUIRED" || error === "STUDY_GOAL_TOO_LONG";

  return (
    <section aria-labelledby={`${id}-title`} className="surface-card space-y-4 p-4">
      <h2 id={`${id}-title`} className="text-base font-medium text-text-strong">
        {messages.formTitle}
      </h2>

      <form
        noValidate
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          const trimmed = goal.trim();
          setMissingGoal(!trimmed);
          if (trimmed) onRequest({ goal: trimmed, topic: topic || null });
        }}
      >
        <div className="space-y-1.5">
          <label htmlFor={`${id}-goal`} className="text-sm font-medium text-text-strong">
            {messages.goalLabel}
          </label>

          <Input
            id={`${id}-goal`}
            value={goal}
            maxLength={GOAL_MAX}
            placeholder={messages.goalPlaceholder}
            aria-invalid={goalInvalid || undefined}
            aria-describedby={error ? `${id}-error` : undefined}
            onChange={(event) => {
              setGoal(event.target.value);
              if (missingGoal) setMissingGoal(false);
            }}
          />
        </div>

        {topics.length > 0 && (
          <div className="space-y-1.5">
            <label htmlFor={`${id}-topic`} className="text-sm font-medium text-text-strong">
              {messages.topicLabel}
            </label>

            <select
              id={`${id}-topic`}
              value={topic}
              aria-invalid={error === "INVALID_TOPIC" || undefined}
              onChange={(event) => setTopic(event.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:text-sm"
            >
              <option value="">{messages.topicNone}</option>
              {topics.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Always mounted so screen readers announce the error the moment it appears. */}
        <div id={`${id}-error`} role="alert">
          {error && (
            <div className="flex items-start gap-2 rounded-xl bg-surface-2 p-3 text-sm text-text-strong">
              <Info aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-text-subtle" />

              <div className="min-w-0 space-y-1">
                <p>{messages.errors[error]}</p>

                {errorLink && (
                  <AppLink
                    href={errorLink.href}
                    className="font-medium text-primary underline underline-offset-4"
                  >
                    {errorLink.label}
                  </AppLink>
                )}

                {errorAction}
              </div>
            </div>
          )}
        </div>

        <Button type="submit" disabled={requesting} className="sm:w-auto">
          {requesting ? messages.submitting : messages.submit}
        </Button>
      </form>

      {onSearchGoals && (
        <GoalSearch
          onSearch={onSearchGoals}
          onPick={(item) => {
            setGoal(item.goal);
            setMissingGoal(false);
            setTopic(item.topic && topics.some((t) => t.value === item.topic) ? item.topic : "");
          }}
        />
      )}

      {popularGoals.length > 0 && (
        <div className="space-y-2 border-t border-border-soft pt-4">
          <h3 className="text-xs font-medium text-text-subtle">{messages.popularTitle}</h3>

          <ul className="flex flex-wrap gap-2">
            {popularGoals.map((item) => (
              <li key={item.goalKey} className="min-w-0 max-w-full">
                <button
                  type="button"
                  aria-label={messages.popularChipLabel(item.openRequests, item.goal)}
                  onClick={() => {
                    setGoal(item.goal);
                    setMissingGoal(false);
                    setTopic(
                      item.topic && topics.some((t) => t.value === item.topic) ? item.topic : "",
                    );
                  }}
                  className="flex max-w-full items-baseline gap-1.5 rounded-full border border-border-soft bg-surface-card px-3 py-1.5 text-left text-sm text-text-strong transition-colors hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                >
                  <span className="min-w-0 truncate">{item.goal}</span>

                  <span className="shrink-0 text-xs text-text-subtle">
                    {messages.popularCount(item.openRequests)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

const SEARCH_MIN = 2;
const SEARCH_DEBOUNCE = 300;

/**
 * Busca por texto nos objetivos abertos. O resultado é anônimo (objetivo e tema); clicar preenche
 * o formulário, que continua sendo o caminho para pedir o par.
 */
function GoalSearch({
  onSearch,
  onPick,
}: {
  onSearch: (term: string) => Promise<StudyPairSearchGoal[]>;
  onPick: (item: StudyPairSearchGoal) => void;
}) {
  const messages = useMessages().studyPairs;
  const id = useId();
  const [term, setTerm] = useState("");
  const [results, setResults] = useState<StudyPairSearchGoal[] | null>(null);
  const [searching, setSearching] = useState(false);
  const [failed, setFailed] = useState(false);
  // Resposta fora de ordem (busca anterior chegando depois) não pode sobrescrever a atual.
  const requestId = useRef(0);

  useEffect(() => {
    const trimmed = term.trim();
    if (trimmed.length < SEARCH_MIN) {
      requestId.current += 1;
      setResults(null);
      setSearching(false);
      setFailed(false);
      return;
    }
    const current = ++requestId.current;
    setSearching(true);
    setFailed(false);
    const timer = setTimeout(() => {
      onSearch(trimmed)
        .then((items) => {
          if (requestId.current !== current) return;
          setResults(items);
        })
        .catch(() => {
          if (requestId.current !== current) return;
          setFailed(true);
          setResults(null);
        })
        .finally(() => {
          if (requestId.current !== current) return;
          setSearching(false);
        });
    }, SEARCH_DEBOUNCE);
    return () => clearTimeout(timer);
  }, [term, onSearch]);

  const trimmed = term.trim();

  return (
    <div className="space-y-2 border-t border-border-soft pt-4">
      <label htmlFor={`${id}-search`} className="text-sm font-medium text-text-strong">
        {messages.searchLabel}
      </label>

      <div className="relative">
        <Search
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-text-subtle"
        />
        <Input
          id={`${id}-search`}
          type="search"
          value={term}
          maxLength={80}
          placeholder={messages.searchPlaceholder}
          className="pl-9"
          onChange={(event) => setTerm(event.target.value)}
        />
      </div>

      <div role="status" aria-live="polite" className="text-xs text-text-subtle">
        {trimmed.length < SEARCH_MIN
          ? messages.searchHint
          : searching
            ? messages.loading
            : failed
              ? messages.searchError
              : results && results.length === 0
                ? messages.searchEmpty
                : ""}
      </div>

      {!failed && results && results.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-medium text-text-subtle">{messages.searchResultsTitle}</h3>

          <ul className="flex flex-wrap gap-2">
            {results.map((item, index) => (
              <li key={`${item.goal}-${index}`} className="min-w-0 max-w-full">
                <button
                  type="button"
                  onClick={() => onPick(item)}
                  className="flex max-w-full items-baseline gap-1.5 rounded-full border border-border-soft bg-surface-card px-3 py-1.5 text-left text-sm text-text-strong transition-colors hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                >
                  <span className="min-w-0 truncate">{item.goal}</span>

                  {item.topic && (
                    <span title={item.topic} className="min-w-0 truncate text-xs text-text-subtle">
                      {item.topic}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
