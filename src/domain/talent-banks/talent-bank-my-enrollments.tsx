import { useMessages } from "../../messages/messages-context.js";
import type { TalentBankEnrollmentState } from "../../types/domain/talent-banks/talent-bank-enrollment-state.js";
import type { TalentBankMyEnrollmentsProps } from "../../types/domain/talent-banks/talent-bank-my-enrollments-props.js";
import type { TalentBankMessages } from "../../types/messages/talent-bank-messages.js";
import { Badge } from "../../ui/badge.js";
import { Button } from "../../ui/button.js";
import { EmptyState } from "../../ui/empty-state.js";

import { sharedFieldsOf, useTalentBankSharedFields } from "./talent-bank-shared-fields.js";

const DIA = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });

/** How the enrollment stands, in the words the person reads. */
function stateLabel(
  state: TalentBankEnrollmentState,
  messages: TalentBankMessages["talentBank"]["myEnrollments"],
) {
  if (state === "ACTIVE") return messages.activeState;
  if (state === "REVOKED_BY_CANDIDATE") return messages.revokedState;
  if (state === "CLOSED_BY_RECRUITER") return messages.closedState;

  return messages.pendingState;
}

/**
 * The person's own enrollments: where she enrolled, what she authorized and how to take it back.
 *
 * <p>Revoking stops the sharing right away; asking for erasure removes the data and keeps only
 * the record of the consent.</p>
 */
export function TalentBankMyEnrollments({
  enrollments,
  onOpen,
  onRevoke,
  onErase,
  busyEnrollmentId = null,
  error = null,
}: TalentBankMyEnrollmentsProps) {
  const messages = useMessages().talentBank.myEnrollments;
  const options = useTalentBankSharedFields();

  return (
    <section className="mx-auto flex w-full max-w-2xl min-w-0 flex-col gap-4">
      <header className="min-w-0">
        <h1 className="text-2xl font-extrabold tracking-tight text-text-strong">
          {messages.title}
        </h1>

        <p className="mt-1 text-[15px] text-text-subtle">{messages.intro}</p>
      </header>

      {error && (
        <p
          className="rounded-xl bg-destructive/10 px-3 py-2 text-[13px] text-destructive"
          role="alert"
        >
          {error}
        </p>
      )}

      {enrollments.length === 0 && <EmptyState title={messages.empty} />}

      {enrollments.length > 0 && (
        <ul className="flex flex-col gap-3">
          {enrollments.map((enrollment) => {
            const authorized = sharedFieldsOf(options, enrollment.sharedFields);
            const busy = busyEnrollmentId === enrollment.enrollmentId;

            return (
              <li key={enrollment.enrollmentId} className="min-w-0">
                <article className="surface-card flex min-w-0 flex-col gap-2 rounded-2xl p-4 shadow-[var(--shadow-table)]">
                  <div className="flex min-w-0 flex-wrap items-center gap-2">
                    <h2 className="min-w-0 truncate text-sm font-bold text-text-strong">
                      {enrollment.bankTitle}
                    </h2>

                    <Badge variant={enrollment.state === "ACTIVE" ? "default" : "outline"}>
                      {stateLabel(enrollment.state, messages)}
                    </Badge>
                  </div>

                  <p className="line-clamp-2 text-[13px] text-text-subtle">
                    {enrollment.bankPurpose}
                  </p>

                  {enrollment.recruiterName && (
                    <p className="truncate text-[12px] text-text-date">
                      {enrollment.recruiterName}
                    </p>
                  )}

                  <p className="min-w-0 text-[12px] text-text-date">
                    {messages.sharedFields}:{" "}
                    {authorized.length > 0
                      ? authorized.map((field) => field.label).join(", ")
                      : messages.nothingAuthorized}
                  </p>

                  <p className="text-[12px] text-text-date">
                    {messages.requestedAt(DIA.format(new Date(enrollment.requestedAt)))}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {onOpen && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onOpen(enrollment.enrollmentId)}
                        aria-label={messages.open}
                      >
                        {messages.open}
                      </Button>
                    )}

                    {onRevoke && enrollment.state !== "REVOKED_BY_CANDIDATE" && (
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={busy}
                        onClick={() => onRevoke(enrollment.enrollmentId)}
                        aria-label={messages.confirmRevoke}
                      >
                        {messages.revoke}
                      </Button>
                    )}

                    {onErase && (
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={busy}
                        onClick={() => onErase(enrollment.enrollmentId)}
                        aria-label={messages.confirmErase}
                      >
                        {messages.erase}
                      </Button>
                    )}
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
