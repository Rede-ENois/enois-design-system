import { useAdapters } from "../../adapters/adapters-context.js";
import { useMessages } from "../../messages/messages-context.js";
import type { TalentBankConsentProps } from "../../types/domain/talent-banks/talent-bank-consent-props.js";
import type { TalentBankEnrollmentState } from "../../types/domain/talent-banks/talent-bank-enrollment-state.js";
import type { TalentBankMessages } from "../../types/messages/talent-bank-messages.js";
import { Badge } from "../../ui/badge.js";
import { Button } from "../../ui/button.js";
import { Label } from "../../ui/label.js";
import { Textarea } from "../../ui/textarea.js";

import { sharedFieldsOf, useTalentBankSharedFields } from "./talent-bank-shared-fields.js";

/** How the enrollment stands, in the words the person reads. */
function stateLabel(
  state: TalentBankEnrollmentState,
  messages: TalentBankMessages["talentBank"]["consent"],
) {
  if (state === "ACTIVE") return messages.active;
  if (state === "REVOKED_BY_CANDIDATE") return messages.revoked;
  if (state === "CLOSED_BY_RECRUITER") return messages.closed;

  return messages.pending;
}

/**
 * The open bank and the consent: what the recruiter is, why the bank exists, how the data is
 * handled and what the person decides to share.
 *
 * <p>Two steps on purpose. The first one is the information the person needs to decide; the
 * second one is the authorization, field by field. Nothing is shared before the confirmation, and
 * what was authorized can be revoked or erased from the same screen.</p>
 */
export function TalentBankConsent({
  bank,
  selectedFields,
  onToggleField,
  note,
  onNoteChange,
  step,
  enrollment,
  onStart,
  onConfirm,
  onBack,
  onRevoke,
  onErase,
  pending = false,
  error = null,
}: TalentBankConsentProps) {
  const messages = useMessages().talentBank.consent;
  const { resolveMediaUrl } = useAdapters();
  const catalog = useTalentBankSharedFields();
  // Só entra na tela o que o banco pediu: autorizar uma informação que ninguém pediu seria
  // consentir com algo fora do esperado.
  const options = sharedFieldsOf(
    catalog,
    bank.requestedFields.map((field) => field.key),
  );
  const authorized = sharedFieldsOf(catalog, enrollment?.sharedFields ?? []);
  const avatar = resolveMediaUrl(bank.recruiter.avatar);
  const canAct = enrollment?.state === "ACTIVE" || enrollment?.state === "PENDING";
  // Revogada ou encerrada, a inscrição não prende ninguém: a pessoa pode pedir uma nova, e o
  // consentimento passa a ser o de hoje.
  const terminal =
    enrollment?.state === "REVOKED_BY_CANDIDATE" || enrollment?.state === "CLOSED_BY_RECRUITER";
  const podeInscrever = enrollment === null || terminal;

  return (
    <section className="mx-auto flex w-full max-w-2xl min-w-0 flex-col gap-4">
      <header className="min-w-0">
        <h1 className="text-2xl font-extrabold tracking-tight text-text-strong">
          {messages.title}
        </h1>

        <p className="mt-1 truncate text-[15px] text-text-subtle">{bank.title}</p>
      </header>

      <section className="surface-card flex min-w-0 flex-col gap-2 rounded-2xl p-4 shadow-[var(--shadow-table)]">
        <p className="text-[12px] font-semibold uppercase tracking-wide text-text-date">
          {messages.recruiter}
        </p>

        <div className="flex min-w-0 items-center gap-3">
          {avatar && (
            <img src={avatar} alt="" className="h-10 w-10 shrink-0 rounded-full object-cover" />
          )}

          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-text-strong">{bank.recruiter.name}</p>

            {bank.recruiter.headline && (
              <p className="truncate text-[13px] text-text-subtle">{bank.recruiter.headline}</p>
            )}

            {bank.recruiter.location && (
              <p className="truncate text-[12px] text-text-date">{bank.recruiter.location}</p>
            )}
          </div>
        </div>
      </section>

      <section className="surface-card flex min-w-0 flex-col gap-4 rounded-2xl p-4 shadow-[var(--shadow-table)]">
        <div className="min-w-0">
          <p className="text-[12px] font-semibold uppercase tracking-wide text-text-date">
            {messages.purpose}
          </p>

          <p className="mt-1 whitespace-pre-wrap text-sm text-text-strong">{bank.purpose}</p>
        </div>

        {bank.description && (
          <div className="min-w-0">
            <p className="text-[12px] font-semibold uppercase tracking-wide text-text-date">
              {messages.description}
            </p>

            <p className="mt-1 whitespace-pre-wrap text-sm text-text-strong">{bank.description}</p>
          </div>
        )}

        <div className="min-w-0">
          <p className="text-[12px] font-semibold uppercase tracking-wide text-text-date">
            {messages.conditions}
          </p>

          <p className="mt-1 whitespace-pre-wrap text-sm text-text-strong">
            {bank.handlingConditions}
          </p>
        </div>

        {bank.focusArea && (
          <div className="min-w-0">
            <p className="text-[12px] font-semibold uppercase tracking-wide text-text-date">
              {messages.focusArea}
            </p>

            <p className="mt-1 text-sm text-text-strong">{bank.focusArea}</p>
          </div>
        )}

        {bank.desiredSkills.length > 0 && (
          <div className="min-w-0">
            <p className="text-[12px] font-semibold uppercase tracking-wide text-text-date">
              {messages.desiredSkills}
            </p>

            <ul className="mt-1 flex flex-wrap gap-1">
              {bank.desiredSkills.map((skill) => (
                <li key={skill}>
                  <Badge variant="secondary">{skill}</Badge>
                </li>
              ))}
            </ul>
          </div>
        )}

        {bank.requestedFields.length > 0 && (
          <div className="min-w-0">
            <p className="text-[12px] font-semibold uppercase tracking-wide text-text-date">
              {messages.requestedFields}
            </p>

            <ul className="mt-1 flex flex-wrap gap-1">
              {bank.requestedFields.map((field) => (
                <li key={field.key}>
                  <Badge variant="outline">{field.label}</Badge>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {enrollment && (
        <section className="surface-card flex min-w-0 flex-col gap-3 rounded-2xl p-4 shadow-[var(--shadow-table)]">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={enrollment.state === "ACTIVE" ? "default" : "outline"}>
              {stateLabel(enrollment.state, messages)}
            </Badge>

            {authorized.length > 0 && (
              <p className="min-w-0 text-[13px] text-text-subtle">
                {authorized.map((field) => field.label).join(", ")}
              </p>
            )}
          </div>

          {canAct && (
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={pending}
                onClick={onRevoke}
                aria-label={messages.revoke}
              >
                {messages.revoke}
              </Button>

              <Button
                variant="destructive"
                size="sm"
                disabled={pending}
                onClick={onErase}
                aria-label={messages.erase}
              >
                {messages.erase}
              </Button>
            </div>
          )}
        </section>
      )}

      {step === "details" && (
        <section className="surface-card flex min-w-0 flex-col gap-3 rounded-2xl p-4 shadow-[var(--shadow-table)]">
          {!enrollment && <p className="text-sm text-text-subtle">{messages.noEnrollment}</p>}

          {options.length === 0 && <p className="text-sm text-text-subtle">{messages.noFields}</p>}

          <Button disabled={pending || !podeInscrever || options.length === 0} onClick={onStart}>
            {messages.request}
          </Button>
        </section>
      )}

      {step === "authorize" && (
        <section className="surface-card flex min-w-0 flex-col gap-4 rounded-2xl p-4 shadow-[var(--shadow-table)]">
          <div className="min-w-0">
            <h2 className="text-base font-bold text-text-strong">{messages.shareTitle}</h2>

            <p className="mt-1 text-sm text-text-subtle">{messages.shareIntro}</p>
          </div>

          <ul className="flex flex-col gap-2">
            {options.map((field) => (
              <li key={field.key}>
                <label className="flex min-w-0 cursor-pointer items-start gap-3 rounded-xl border border-border-soft p-3">
                  <input
                    type="checkbox"
                    checked={selectedFields.includes(field.key)}
                    onChange={() => onToggleField(field.key)}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--primary)]"
                  />

                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-text-strong">
                      {field.label}
                    </span>

                    <span className="block text-[13px] text-text-subtle">{field.description}</span>
                  </span>
                </label>
              </li>
            ))}
          </ul>

          <div className="flex min-w-0 flex-col gap-1.5">
            <Label htmlFor="talent-bank-note">{messages.noteLabel}</Label>

            <Textarea
              id="talent-bank-note"
              value={note}
              onChange={(event) => onNoteChange(event.target.value)}
              placeholder={messages.notePlaceholder}
              rows={3}
              maxLength={500}
            />
          </div>

          <p className="rounded-xl bg-surface-2 px-3 py-2 text-[13px] text-text-subtle">
            {messages.consentWarning}
          </p>

          {error && (
            <p
              className="rounded-xl bg-destructive/10 px-3 py-2 text-[13px] text-destructive"
              role="alert"
            >
              {error}
            </p>
          )}

          <div className="flex flex-wrap gap-2">
            <Button disabled={pending || selectedFields.length === 0} onClick={onConfirm}>
              {messages.confirm}
            </Button>

            <Button variant="outline" disabled={pending} onClick={onBack}>
              {messages.back}
            </Button>
          </div>
        </section>
      )}
    </section>
  );
}
