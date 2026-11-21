import { useState } from "react";

import { Check, Crown, Search, Shield, ShieldOff, UserMinus } from "lucide-react";

import { TOUCH_TARGET_32 } from "../../lib/touch-target.js";
import { cn } from "../../lib/utils.js";
import { useMessages } from "../../messages/messages-context.js";
import type { GroupAddFormProps } from "../../types/domain/messages/group-add-form-props.js";
import type { GroupAdminParticipantData } from "../../types/domain/messages/group-admin-participant-data.js";
import type { GroupAdminSectionProps } from "../../types/domain/messages/group-admin-section-props.js";
import type { GroupParticipantRowProps as ParticipantRowProps } from "../../types/domain/messages/group-participant-row-props.js";
import type { GroupViewerRole } from "../../types/domain/messages/group-viewer-role.js";
import { Button } from "../../ui/button.js";
import { Input } from "../../ui/input.js";
import { UserAvatar } from "../avatar/user-avatar.js";
import { StyledName } from "../name/styled-name.js";

import { GroupParticipantsSkeleton } from "./group-participants-skeleton.js";

/**
 * O que o painel oferece: o dono manda em todos; o administrador não mexe em outro administrador
 * nem no dono; o membro comum só se vê na lista.
 */
const manages = (viewer: GroupViewerRole, target: GroupAdminParticipantData["role"]) =>
  viewer !== "MEMBER" && target !== "OWNER" && !(viewer === "ADMIN" && target === "ADMIN");

function GroupAddForm({
  candidates,
  candidatesLoading = false,
  pending,
  onSearchCandidates,
  onAddMembers,
}: GroupAddFormProps) {
  const messages = useMessages().groupAdmin;
  const [picked, setPicked] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    const next = new Set(picked);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setPicked(next);
  };

  const submit = () => {
    if (picked.size === 0) return;
    void onAddMembers([...picked]).then(() => setPicked(new Set()));
  };

  return (
    <div className="space-y-2">
      <h5 className="text-xs font-semibold uppercase tracking-wide text-text-subtle">
        {messages.add.title}
      </h5>

      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-subtle"
          aria-hidden
        />
        <Input
          aria-label={messages.add.search}
          onChange={(event) => onSearchCandidates(event.target.value)}
          placeholder={messages.add.searchPlaceholder}
          showCounter={false}
          className="h-9 rounded-full bg-muted pl-9"
        />
      </div>

      <ul className="max-h-56 space-y-1 overflow-y-auto">
        {candidates.length === 0 && (
          <li className="py-3 text-center text-sm text-text-subtle">
            {candidatesLoading ? messages.add.searching : messages.add.noResults}
          </li>
        )}

        {candidates.map((candidate) => {
          const on = picked.has(candidate.id);
          const disabled = Boolean(candidate.alreadyMember) || pending;
          return (
            <li key={candidate.id}>
              <button
                type="button"
                aria-pressed={on}
                disabled={disabled}
                onClick={() => toggle(candidate.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition disabled:cursor-not-allowed disabled:opacity-60",
                  on ? "bg-primary-soft" : "hover:bg-surface-2",
                )}
              >
                <UserAvatar src={candidate.avatar} alt={candidate.name} className="h-9 w-9" />

                <span className="min-w-0 flex-1">
                  <span className="block min-w-0 truncate text-sm font-medium text-text-strong">
                    {candidate.name}
                  </span>

                  {candidate.alreadyMember && (
                    <span className="block text-xs text-text-subtle">
                      {messages.add.alreadyMember}
                    </span>
                  )}
                </span>

                {on && <Check className="h-4 w-4 shrink-0 text-primary" aria-hidden />}
              </button>
            </li>
          );
        })}
      </ul>

      <Button size="sm" disabled={picked.size === 0 || pending} onClick={submit}>
        {messages.add.submit(picked.size)}
      </Button>
    </div>
  );
}

function ParticipantRow({
  participant,
  viewerRole,
  pending,
  onPromote,
  onDemote,
  onRemove,
}: ParticipantRowProps) {
  const messages = useMessages().groupAdmin;
  const [confirming, setConfirming] = useState(false);

  const managed = manages(viewerRole, participant.role);
  const roleLabel =
    participant.role === "OWNER"
      ? messages.participants.owner
      : participant.role === "ADMIN"
        ? messages.participants.admin
        : messages.participants.member;

  const actionClass = `grid h-8 w-8 shrink-0 place-items-center rounded-full text-text-subtle transition hover:bg-surface-2 hover:text-text-strong disabled:pointer-events-none disabled:opacity-50 ${TOUCH_TARGET_32}`;

  return (
    <li className="flex min-w-0 flex-wrap items-center gap-2 py-2">
      <UserAvatar src={participant.avatar} alt={participant.name} className="h-10 w-10 shrink-0" />

      <div className="min-w-0 flex-1 basis-0">
        <span className="block min-w-0 truncate text-sm font-medium text-text-strong">
          <StyledName name={participant.name} style={participant.nameStyle} />
        </span>

        <span className="flex items-center gap-1 text-xs text-text-subtle">
          {participant.role === "OWNER" && <Crown className="h-3 w-3 text-primary" aria-hidden />}
          {participant.role === "ADMIN" && <Shield className="h-3 w-3" aria-hidden />}
          {roleLabel}
        </span>
      </div>

      {managed && (
        <div className="ml-auto flex shrink-0 items-center gap-1">
          {participant.role === "ADMIN" ? (
            <button
              type="button"
              aria-label={messages.participants.demote(participant.name)}
              title={
                viewerRole === "OWNER"
                  ? messages.participants.demote(participant.name)
                  : messages.participants.ownerOnly
              }
              disabled={pending || viewerRole !== "OWNER"}
              onClick={() => void onDemote(participant.userId)}
              className={actionClass}
            >
              <ShieldOff className="h-4 w-4" aria-hidden />
            </button>
          ) : (
            <button
              type="button"
              aria-label={messages.participants.promote(participant.name)}
              title={messages.participants.promote(participant.name)}
              disabled={pending}
              onClick={() => void onPromote(participant.userId)}
              className={actionClass}
            >
              <Shield className="h-4 w-4" aria-hidden />
            </button>
          )}

          <button
            type="button"
            aria-label={messages.participants.remove(participant.name)}
            title={messages.participants.remove(participant.name)}
            disabled={pending}
            onClick={() => setConfirming(true)}
            className={actionClass}
          >
            <UserMinus className="h-4 w-4" aria-hidden />
          </button>
        </div>
      )}

      {managed && confirming && (
        <div
          role="alertdialog"
          aria-label={messages.participants.confirmRemove(participant.name)}
          className="w-full space-y-2 rounded-xl border border-border-soft bg-surface-2 p-3"
        >
          <p className="text-sm text-text-strong">
            {messages.participants.confirmRemove(participant.name)}
          </p>

          <div className="flex justify-end gap-2">
            <Button size="sm" variant="ghost" onClick={() => setConfirming(false)}>
              {messages.participants.confirmRemoveCancel}
            </Button>

            <Button
              size="sm"
              variant="destructive"
              disabled={pending}
              onClick={() => void onRemove(participant.userId).then(() => setConfirming(false))}
            >
              {messages.participants.confirmRemoveAction}
            </Button>
          </div>
        </div>
      )}
    </li>
  );
}

/**
 * Painel do grupo: quem participa com o papel de cada um e, para quem administra, as ações de
 * adicionar, promover, rebaixar e remover. O dono é tratado como intocável (sem ação na linha);
 * o administrador vê a ação de outro administrador desligada, porque só o dono mexe nele.
 */
export function GroupAdminSection({
  groupTitle,
  participants,
  isOwner,
  canManage: viewerCanManage,
  pending = false,
  error,
  onSearchCandidates,
  candidates,
  candidatesLoading = false,
  onAddMembers,
  onPromote,
  onDemote,
  onRemove,
}: GroupAdminSectionProps) {
  const messages = useMessages().groupAdmin;
  const viewerRole = isOwner ? "OWNER" : viewerCanManage ? "ADMIN" : "MEMBER";

  return (
    <section aria-label={`${messages.section.title}: ${groupTitle}`} className="space-y-3">
      <div className="flex items-baseline justify-between gap-2">
        <h4 className="truncate text-sm font-semibold text-text-strong">{groupTitle}</h4>

        <span className="shrink-0 text-xs text-text-subtle">
          {messages.section.count(participants.length)}
        </span>
      </div>

      {participants.length === 0 ? (
        <GroupParticipantsSkeleton />
      ) : (
        <ul className="divide-y divide-border-soft">
          {participants.map((participant) => (
            <ParticipantRow
              key={participant.userId}
              participant={participant}
              viewerRole={viewerRole}
              pending={pending}
              onPromote={onPromote}
              onDemote={onDemote}
              onRemove={onRemove}
            />
          ))}
        </ul>
      )}

      {viewerCanManage && (
        <GroupAddForm
          candidates={candidates}
          candidatesLoading={candidatesLoading}
          pending={pending}
          onSearchCandidates={onSearchCandidates}
          onAddMembers={onAddMembers}
        />
      )}

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </section>
  );
}
