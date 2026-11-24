import { useMessages } from "../../messages/messages-context.js";
import type { TalentBankCandidateFilters } from "../../types/domain/talent-banks/talent-bank-candidate-filters.js";
import type { TalentBankCandidateListProps } from "../../types/domain/talent-banks/talent-bank-candidate-list-props.js";
import type { TalentBankEnrollmentState } from "../../types/domain/talent-banks/talent-bank-enrollment-state.js";
import type { TalentBankMessages } from "../../types/messages/talent-bank-messages.js";
import { Badge } from "../../ui/badge.js";
import { Button } from "../../ui/button.js";
import { EmptyState } from "../../ui/empty-state.js";
import { Input } from "../../ui/input.js";
import { LoadingState } from "../../ui/loading-state.js";
import { Select } from "../../ui/select.js";

import { sharedFieldsOf, useTalentBankSharedFields } from "./talent-bank-shared-fields.js";

const DIA = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });

/** How the enrollment stands, in the words the recruiter reads. */
function stateLabel(
  state: TalentBankEnrollmentState,
  messages: TalentBankMessages["talentBank"]["candidates"],
) {
  if (state === "ACTIVE") return messages.activeState;
  if (state === "REVOKED_BY_CANDIDATE") return messages.revokedState;
  if (state === "CLOSED_BY_RECRUITER") return messages.closedState;

  return messages.pendingState;
}

/**
 * The people enrolled in the recruiter's own bank: who they are, what they authorized and how the
 * enrollment stands.
 *
 * <p>Only the state and the authorized fields are here: the content of the profile comes from the
 * file, and only while the enrollment is active.</p>
 */
export function TalentBankCandidateList({
  candidates,
  filters,
  onFiltersChange,
  activeTotal,
  pendingTotal,
  hasMore,
  onLoadMore,
  onOpenCandidate,
  state = { kind: "ready" },
  onRetry,
}: TalentBankCandidateListProps) {
  const messages = useMessages().talentBank.candidates;
  const options = useTalentBankSharedFields();
  const resumeLabel = options.find((option) => option.key === "RESUME")?.label;
  const change = (patch: Partial<TalentBankCandidateFilters>) =>
    onFiltersChange({ ...filters, ...patch });

  return (
    <section className="mx-auto flex w-full max-w-4xl min-w-0 flex-col gap-4">
      <header className="min-w-0">
        <h1 className="text-2xl font-extrabold tracking-tight text-text-strong">
          {messages.title}
        </h1>

        <p className="mt-1 text-[13px] text-text-subtle">
          {messages.total(activeTotal, pendingTotal)}
        </p>
      </header>

      <div className="grid gap-2 sm:grid-cols-2">
        <Input
          type="search"
          value={filters.search}
          onChange={(event) => change({ search: event.target.value })}
          placeholder={messages.searchPlaceholder}
          aria-label={messages.searchLabel}
          showCounter={false}
        />

        <Select
          aria-label={messages.stateLabel}
          value={filters.state}
          onChange={(event) => change({ state: event.target.value })}
        >
          <option value="">{messages.stateAll}</option>

          <option value="ACTIVE">{messages.activeState}</option>

          <option value="PENDING">{messages.pendingState}</option>

          <option value="REVOKED_BY_CANDIDATE">{messages.revokedState}</option>

          <option value="CLOSED_BY_RECRUITER">{messages.closedState}</option>
        </Select>

        <Input
          value={filters.skill}
          onChange={(event) => change({ skill: event.target.value })}
          placeholder={messages.skillLabel}
          aria-label={messages.skillLabel}
          showCounter={false}
        />
        <Input
          type="number"
          min={0}
          value={filters.minExperiences}
          onChange={(event) => change({ minExperiences: event.target.value })}
          placeholder={messages.experiencesLabel}
          aria-label={messages.experiencesLabel}
          showCounter={false}
        />
        <Input
          value={filters.education}
          onChange={(event) => change({ education: event.target.value })}
          placeholder={messages.educationLabel}
          aria-label={messages.educationLabel}
          showCounter={false}
        />

        <div>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              onFiltersChange({
                search: "",
                state: "",
                skill: "",
                minExperiences: "",
                education: "",
              })
            }
          >
            {messages.clearFilters}
          </Button>
        </div>
      </div>

      {state.kind === "loading" && <LoadingState label={messages.loading} />}

      {state.kind === "error" && (
        <div className="flex flex-col items-center gap-3 py-8 text-center">
          <p className="text-sm text-text-subtle" role="alert">
            {messages.error}
          </p>

          {onRetry && (
            <Button variant="outline" size="sm" onClick={onRetry}>
              {messages.retry}
            </Button>
          )}
        </div>
      )}

      {state.kind === "ready" && candidates.length === 0 && <EmptyState title={messages.empty} />}

      {state.kind === "ready" && candidates.length > 0 && (
        <ul className="flex flex-col gap-2">
          {candidates.map((candidate) => {
            const authorized = sharedFieldsOf(options, candidate.sharedFields);

            return (
              <li key={candidate.enrollmentId} className="min-w-0">
                <article className="surface-card flex min-w-0 flex-col gap-2 rounded-2xl p-4 shadow-[var(--shadow-table)]">
                  <div className="flex min-w-0 flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onOpenCandidate(candidate.enrollmentId)}
                      aria-label={messages.open(candidate.name ?? messages.noName)}
                      className="min-w-0 truncate text-left text-sm font-bold text-text-strong hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {candidate.name ?? messages.noName}
                    </button>

                    <Badge variant={candidate.state === "ACTIVE" ? "default" : "outline"}>
                      {stateLabel(candidate.state, messages)}
                    </Badge>

                    {candidate.resumeAvailable && resumeLabel && (
                      <Badge variant="secondary">{resumeLabel}</Badge>
                    )}
                  </div>

                  {candidate.headline && (
                    <p className="min-w-0 truncate text-[13px] text-text-subtle">
                      {candidate.headline}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-text-date">
                    <span>
                      {messages.sharedFields}:{" "}
                      {authorized.length > 0
                        ? authorized.map((field) => field.label).join(", ")
                        : messages.nothingAuthorized}
                    </span>

                    {candidate.experienceCount > 0 && (
                      <span>
                        {messages.experiencesLabel}: {candidate.experienceCount}
                      </span>
                    )}

                    {candidate.consentedAt && (
                      <span>
                        {messages.consentedAt(DIA.format(new Date(candidate.consentedAt)))}
                      </span>
                    )}
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      )}

      {hasMore && onLoadMore && (
        <div>
          <Button variant="outline" onClick={onLoadMore}>
            {messages.loadMore}
          </Button>
        </div>
      )}
    </section>
  );
}
