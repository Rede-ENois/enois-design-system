import { useAdapters } from "../../adapters/adapters-context.js";
import { useMessages } from "../../messages/messages-context.js";
import type { TalentBankCandidateDetailProps } from "../../types/domain/talent-banks/talent-bank-candidate-detail-props.js";
import type { TalentBankEnrollmentState } from "../../types/domain/talent-banks/talent-bank-enrollment-state.js";
import type { TalentBankMessages } from "../../types/messages/talent-bank-messages.js";
import { Badge } from "../../ui/badge.js";
import { Button } from "../../ui/button.js";

import { sharedFieldsOf, useTalentBankSharedFields } from "./talent-bank-shared-fields.js";

const DIA = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });

/** How the enrollment stands, in the words the recruiter reads. */
function stateLabel(
  state: TalentBankEnrollmentState,
  messages: TalentBankMessages["talentBank"]["candidateDetail"],
) {
  if (state === "ACTIVE") return messages.activeState;
  if (state === "REVOKED_BY_CANDIDATE") return messages.revokedState;
  if (state === "CLOSED_BY_RECRUITER") return messages.closedState;

  return messages.pendingState;
}

/**
 * The file of one enrolled person: only the blocks she authorized are here.
 *
 * <p>An empty block means "not authorized", never "no data": the recruiter cannot tell the
 * difference between a blank profile and a refused consent, and that is the point.</p>
 */
export function TalentBankCandidateDetail({
  candidate,
  onDownloadResume,
  onClose,
  pending = false,
  error = null,
}: TalentBankCandidateDetailProps) {
  const messages = useMessages().talentBank.candidateDetail;
  const { resolveMediaUrl } = useAdapters();
  const options = useTalentBankSharedFields();
  const authorized = sharedFieldsOf(options, candidate.sharedFields);
  const avatar = resolveMediaUrl(candidate.identity?.avatar);
  const nothing = authorized.length === 0;

  return (
    <section className="mx-auto flex w-full max-w-2xl min-w-0 flex-col gap-4">
      <header className="min-w-0">
        <h1 className="text-2xl font-extrabold tracking-tight text-text-strong">
          {messages.title}
        </h1>

        <div className="mt-1 flex flex-wrap items-center gap-2">
          <p className="min-w-0 truncate text-[15px] text-text-subtle">
            {candidate.identity?.name ?? messages.noName}
          </p>

          <Badge variant={candidate.state === "ACTIVE" ? "default" : "outline"}>
            {stateLabel(candidate.state, messages)}
          </Badge>
        </div>
      </header>

      {error && (
        <p
          className="rounded-xl bg-destructive/10 px-3 py-2 text-[13px] text-destructive"
          role="alert"
        >
          {error}
        </p>
      )}

      {nothing && <p className="text-sm text-text-subtle">{messages.noData}</p>}

      <section className="surface-card flex min-w-0 flex-col gap-2 rounded-2xl p-4 shadow-[var(--shadow-table)]">
        <p className="text-[12px] font-semibold uppercase tracking-wide text-text-date">
          {messages.sharedFields}
        </p>

        <ul className="flex flex-wrap gap-1">
          {authorized.map((field) => (
            <li key={field.key}>
              <Badge variant="secondary">{field.label}</Badge>
            </li>
          ))}
        </ul>

        {candidate.consentedAt && (
          <p className="text-[12px] text-text-date">
            {messages.consentedAt(DIA.format(new Date(candidate.consentedAt)))}
          </p>
        )}
      </section>

      {candidate.identity && (
        <section className="surface-card flex min-w-0 flex-col gap-2 rounded-2xl p-4 shadow-[var(--shadow-table)]">
          <p className="text-[12px] font-semibold uppercase tracking-wide text-text-date">
            {messages.identity}
          </p>

          <div className="flex min-w-0 items-center gap-3">
            {avatar && (
              <img src={avatar} alt="" className="h-10 w-10 shrink-0 rounded-full object-cover" />
            )}

            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-text-strong">
                {candidate.identity.name}
              </p>

              {candidate.identity.headline && (
                <p className="truncate text-[13px] text-text-subtle">
                  {candidate.identity.headline}
                </p>
              )}

              {candidate.identity.location && (
                <p className="truncate text-[12px] text-text-date">{candidate.identity.location}</p>
              )}
            </div>
          </div>
        </section>
      )}

      {candidate.skills.length > 0 && (
        <section className="surface-card flex min-w-0 flex-col gap-2 rounded-2xl p-4 shadow-[var(--shadow-table)]">
          <p className="text-[12px] font-semibold uppercase tracking-wide text-text-date">
            {messages.skills}
          </p>

          <ul className="flex flex-wrap gap-1">
            {candidate.skills.map((skill) => (
              <li key={skill}>
                <Badge variant="outline">{skill}</Badge>
              </li>
            ))}
          </ul>
        </section>
      )}

      {candidate.experiences.length > 0 && (
        <section className="surface-card flex min-w-0 flex-col gap-2 rounded-2xl p-4 shadow-[var(--shadow-table)]">
          <p className="text-[12px] font-semibold uppercase tracking-wide text-text-date">
            {messages.experiences}
          </p>

          <ul className="flex flex-col gap-2">
            {candidate.experiences.map((experience) => (
              <li key={experience.id} className="min-w-0">
                <p className="truncate text-sm font-semibold text-text-strong">
                  {experience.title}
                </p>

                <p className="truncate text-[13px] text-text-subtle">
                  {[experience.company, experience.location].filter(Boolean).join(" · ")}
                </p>

                {experience.description && (
                  <p className="mt-1 whitespace-pre-wrap text-[13px] text-text-subtle">
                    {experience.description}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {candidate.educations.length > 0 && (
        <section className="surface-card flex min-w-0 flex-col gap-2 rounded-2xl p-4 shadow-[var(--shadow-table)]">
          <p className="text-[12px] font-semibold uppercase tracking-wide text-text-date">
            {messages.education}
          </p>

          <ul className="flex flex-col gap-2">
            {candidate.educations.map((education) => (
              <li key={education.id} className="min-w-0">
                <p className="truncate text-sm font-semibold text-text-strong">
                  {education.school}
                </p>

                <p className="truncate text-[13px] text-text-subtle">
                  {[education.degree, education.field].filter(Boolean).join(" · ")}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {candidate.certifications.length > 0 && (
        <section className="surface-card flex min-w-0 flex-col gap-2 rounded-2xl p-4 shadow-[var(--shadow-table)]">
          <p className="text-[12px] font-semibold uppercase tracking-wide text-text-date">
            {messages.certifications}
          </p>

          <ul className="flex flex-col gap-1">
            {candidate.certifications.map((certification) => (
              <li key={certification.id} className="min-w-0">
                <p className="truncate text-sm text-text-strong">{certification.name}</p>

                {certification.issuer && (
                  <p className="truncate text-[13px] text-text-subtle">{certification.issuer}</p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {candidate.resumeAuthorized && (
        <section className="surface-card flex min-w-0 flex-col gap-2 rounded-2xl p-4 shadow-[var(--shadow-table)]">
          <p className="text-[12px] font-semibold uppercase tracking-wide text-text-date">
            {messages.resume}
          </p>

          {candidate.resumeAvailable && onDownloadResume ? (
            <Button variant="outline" size="sm" onClick={onDownloadResume}>
              {messages.downloadResume}
            </Button>
          ) : (
            <p className="text-[13px] text-text-subtle">{messages.resumeUnavailable}</p>
          )}

          {candidate.resumeName && (
            <p className="truncate text-[12px] text-text-date">{candidate.resumeName}</p>
          )}
        </section>
      )}

      {candidate.purposeSnapshot && (
        <section className="surface-card flex min-w-0 flex-col gap-2 rounded-2xl p-4 shadow-[var(--shadow-table)]">
          <p className="text-[12px] font-semibold uppercase tracking-wide text-text-date">
            {messages.purpose}
          </p>

          <p className="whitespace-pre-wrap text-sm text-text-strong">
            {candidate.purposeSnapshot}
          </p>
        </section>
      )}

      {candidate.note && (
        <section className="surface-card flex min-w-0 flex-col gap-2 rounded-2xl p-4 shadow-[var(--shadow-table)]">
          <p className="text-[12px] font-semibold uppercase tracking-wide text-text-date">
            {messages.note}
          </p>

          <p className="whitespace-pre-wrap text-sm text-text-strong">{candidate.note}</p>
        </section>
      )}

      {onClose && candidate.state === "ACTIVE" && (
        <div>
          <Button
            variant="destructive"
            size="sm"
            disabled={pending}
            onClick={onClose}
            aria-label={messages.confirmClose}
          >
            {messages.close}
          </Button>
        </div>
      )}
    </section>
  );
}
