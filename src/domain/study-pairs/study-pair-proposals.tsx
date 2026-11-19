import { useState } from "react";

import { CalendarClock } from "lucide-react";

import { useMessages } from "../../messages/messages-context.js";
import type { StudyPairIcebreakerAnswers } from "../../types/domain/study-pairs/study-pair-icebreaker-answers.js";
import type { StudyPairIcebreakerField } from "../../types/domain/study-pairs/study-pair-icebreaker-field.js";
import type { StudyPairProposalCardProps } from "../../types/domain/study-pairs/study-pair-proposal-card-props.js";
import type { StudyPairProposal } from "../../types/domain/study-pairs/study-pair-proposal.js";
import type { StudyPairProposalsProps } from "../../types/domain/study-pairs/study-pair-proposals-props.js";
import { AppLink } from "../../ui/app-link.js";
import { Button } from "../../ui/button.js";
import { LoadingState } from "../../ui/loading-state.js";
import { MetaLine } from "../../ui/meta-line.js";
import { PillRow } from "../../ui/pill-row.js";
import { Pill } from "../../ui/pill.js";
import { Textarea } from "../../ui/textarea.js";
import { UserAvatar } from "../avatar/user-avatar.js";

const ANSWER_MAX = 500;

/**
 * Propostas de par de estudo: o casamento nasce pendente e só vira par com o aceite dos dois. O
 * quebra-gelo é respondido no próprio card, antes do aceite; o da outra pessoa só aparece depois
 * do meu (revelação simétrica, decidida no servidor). Recusar devolve o pedido para a fila.
 */
export function StudyPairProposals({
  proposals,
  fields,
  fieldsLoading = false,
  onAccept,
  acceptingId = null,
  onDecline,
  decliningId = null,
  errors = {},
}: StudyPairProposalsProps) {
  const messages = useMessages().studyPairProposals;
  if (proposals.length === 0) return null;

  return (
    <section aria-labelledby="study-pair-proposals-title" className="space-y-3">
      <header className="space-y-1">
        <h2
          id="study-pair-proposals-title"
          className="text-lg font-semibold text-balance text-text-strong"
        >
          {messages.title}
        </h2>

        <MetaLine>{messages.hint}</MetaLine>
      </header>

      {proposals.map((proposal) => (
        <ProposalCard
          key={proposal.id}
          proposal={proposal}
          fields={fields}
          fieldsLoading={fieldsLoading}
          accepting={acceptingId === proposal.id}
          busy={acceptingId !== null || decliningId !== null}
          declining={decliningId === proposal.id}
          error={errors[proposal.id] ?? null}
          onAccept={onAccept}
          onDecline={onDecline}
        />
      ))}
    </section>
  );
}

function ProposalCard(props: StudyPairProposalCardProps) {
  const {
    proposal,
    fields,
    fieldsLoading,
    accepting,
    busy,
    declining,
    error,
    onAccept,
    onDecline,
  } = props;
  const messages = useMessages().studyPairProposals;
  const firstName = proposal.partner.name.trim().split(/\s+/)[0] || proposal.partner.username;
  const partnerAnswers = proposal.partnerIcebreaker;

  return (
    <article
      aria-labelledby={`proposal-${proposal.id}-goal`}
      className="surface-card space-y-3 p-4"
    >
      <header className="flex items-center gap-3">
        <UserAvatar
          src={proposal.partner.avatarUrl ?? null}
          alt={proposal.partner.name}
          className="h-10 w-10"
        />

        <div className="min-w-0 flex-1 space-y-1">
          <AppLink
            href={proposal.partner.href}
            className="block truncate text-sm font-medium text-text-strong underline-offset-4 hover:underline"
          >
            {proposal.partner.name || proposal.partner.username}
          </AppLink>

          <MetaLine>@{proposal.partner.username}</MetaLine>
        </div>

        <MetaLine align="end" nowrap>
          <CalendarClock aria-hidden className="mr-1 inline h-3.5 w-3.5 align-[-2px]" />

          {messages.deadline(proposal.deadlineLabel)}
        </MetaLine>
      </header>

      <div className="min-w-0">
        <h3
          id={`proposal-${proposal.id}-goal`}
          className="text-base font-medium text-pretty text-text-strong"
        >
          {proposal.goal}
        </h3>
      </div>

      <Pill active={proposal.partnerAccepted} size="sm">
        {proposal.partnerAccepted ? messages.partnerAccepted : messages.partnerWaiting}
      </Pill>

      {partnerAnswers && (
        <section aria-label={`${messages.partnerIcebreaker} ${firstName}`} className="space-y-1">
          <h4 className="text-xs font-medium text-text-strong">
            {messages.partnerIcebreaker} {firstName}
          </h4>

          <ul className="space-y-1">
            {fields.map((field) => (
              <li key={field.id} className="text-sm text-text-strong">
                <MetaLine>{field.question}</MetaLine>

                {partnerAnswers[field.id] || messages.noAnswer}
              </li>
            ))}
          </ul>
        </section>
      )}

      {!proposal.myAccepted && (fieldsLoading || fields.length > 0) && (
        <section aria-labelledby={`proposal-${proposal.id}-icebreaker`} className="space-y-3">
          <div className="space-y-1">
            <h4
              id={`proposal-${proposal.id}-icebreaker`}
              className="text-sm font-medium text-text-strong"
            >
              {messages.icebreakerTitle}
            </h4>

            <MetaLine>{messages.icebreakerHint}</MetaLine>
          </div>

          {fieldsLoading ? (
            <LoadingState label={messages.loading} />
          ) : (
            <ProposalAnswers
              proposalId={proposal.id}
              fields={fields}
              accepting={accepting}
              onAccept={onAccept}
            />
          )}
        </section>
      )}

      {error && (
        <span role="alert" className="block text-sm text-destructive">
          {error}
        </span>
      )}

      <footer className="flex flex-wrap items-center gap-2">
        {proposal.myAccepted ? (
          <MetaLine>{messages.myAccepted}</MetaLine>
        ) : (
          <Button
            type="submit"
            form={`proposal-${proposal.id}-answers`}
            size="sm"
            className="rounded-full"
            disabled={busy}
          >
            {accepting ? messages.accepting : messages.accept}
          </Button>
        )}

        <Button
          type="button"
          size="sm"
          variant="outline"
          className="rounded-full"
          disabled={busy}
          onClick={() => onDecline(proposal.id)}
        >
          {declining ? messages.declining : messages.decline}
        </Button>
      </footer>
    </article>
  );
}

/** Uma pergunta do quebra-gelo: escolha única (Pills) ou texto livre. */
function IcebreakerField({
  field,
  value,
  onChange,
}: {
  field: StudyPairIcebreakerField;
  value: string;
  onChange: (value: string) => void;
}) {
  const messages = useMessages().studyPairProposals;
  const requirement = field.required ? messages.required : messages.optional;

  return (
    <fieldset className="space-y-1">
      <legend className="text-sm text-text-strong">
        {field.question} <span className="text-xs text-text-subtle">{`(${requirement})`}</span>
      </legend>

      {field.options.length > 0 ? (
        <PillRow label={field.question}>
          {field.options.map((option) => (
            <Pill
              key={option}
              active={value === option}
              size="sm"
              onClick={() => onChange(value === option ? "" : option)}
            >
              {option}
            </Pill>
          ))}
        </PillRow>
      ) : (
        <Textarea
          aria-label={field.question}
          rows={2}
          value={value}
          maxLength={ANSWER_MAX}
          placeholder={field.placeholder}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
    </fieldset>
  );
}

/** As respostas do meu quebra-gelo para uma proposta; o aceite é o `submit` do formulário. */
function ProposalAnswers({
  proposalId,
  fields,
  accepting,
  onAccept,
}: {
  proposalId: string;
  fields: StudyPairIcebreakerField[];
  accepting: boolean;
  onAccept: StudyPairProposalsProps["onAccept"];
}) {
  const messages = useMessages().studyPairProposals;
  const [answers, setAnswers] = useState<StudyPairIcebreakerAnswers>({});
  const [missing, setMissing] = useState(false);

  const set = (id: string, value: string) => {
    setMissing(false);
    setAnswers((current) => ({ ...current, [id]: value }));
  };

  return (
    <form
      id={`proposal-${proposalId}-answers`}
      noValidate
      className="space-y-3"
      onSubmit={(event) => {
        event.preventDefault();
        if (accepting) return;
        const unanswered = fields.some(
          (field) => field.required && !(answers[field.id] ?? "").trim(),
        );
        if (unanswered) {
          setMissing(true);
          return;
        }
        onAccept(proposalId, answers);
      }}
    >
      {fields.map((field) => (
        <IcebreakerField
          key={field.id}
          field={field}
          value={answers[field.id] ?? ""}
          onChange={(value) => set(field.id, value)}
        />
      ))}

      {missing && <MetaLine>{messages.requiredError}</MetaLine>}
    </form>
  );
}
