import { Loader2, UserPlus } from "lucide-react";

import { useMessages } from "../../messages/messages-context.js";
import type { CompanyTeamSectionProps } from "../../types/domain/jobs/company-team-section-props.js";
import { Button } from "../../ui/button.js";
import { Input } from "../../ui/input.js";
import { UserAvatar } from "../avatar/user-avatar.js";

/** The company team: who holds which role, and the invite by user search for OWNER/ADMIN. */
export function CompanyTeamSection({
  members,
  search,
  onSearchChange,
  results,
  selected,
  onSelectedChange,
  role,
  onRoleChange,
  addPending,
  onAdd,
}: CompanyTeamSectionProps) {
  const messages = useMessages().companyTeamSection;

  return (
    <div className="space-y-2 border-t border-border-soft pt-3">
      <p className="text-xs font-semibold uppercase tracking-widest text-text-subtle">
        {messages.team}
      </p>

      <ul className="space-y-2">
        {members.map((member) => (
          <li key={member.userId} className="flex min-w-0 items-center gap-2.5 text-sm">
            {member.name ? (
              <>
                <UserAvatar
                  src={member.avatar ?? undefined}
                  alt={member.name}
                  className="h-8 w-8 shrink-0"
                />

                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium text-text-strong">{member.name}</span>

                  {member.username && (
                    <span className="block truncate text-xs text-text-subtle">
                      @{member.username}
                    </span>
                  )}
                </span>
              </>
            ) : (
              <span className="min-w-0 flex-1 truncate font-mono text-xs text-text-strong">
                {member.userId.slice(0, 18)}…
              </span>
            )}

            <span className="shrink-0 rounded-full bg-surface-2 px-2 py-0.5 text-xs text-text-subtle">
              {messages.roles[member.role] ?? member.role}
            </span>
          </li>
        ))}
        {members.length === 0 && <li className="text-xs text-text-subtle">{messages.noMembers}</li>}
      </ul>

      {!selected ? (
        <div className="relative">
          <Input
            placeholder={messages.memberSearch}
            aria-label={messages.memberSearch}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {search.trim().length >= 2 && results.length > 0 && (
            <ul className="absolute z-20 mt-1 max-h-40 w-full overflow-y-auto rounded-xl border border-border-soft bg-surface-card p-1 shadow-lg">
              {results.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-2 rounded-lg p-2 text-left text-sm transition hover:bg-surface-2"
                    onClick={() => onSelectedChange(item)}
                  >
                    <span className="truncate">{item.name}</span>

                    <span className="truncate text-xs text-text-subtle">@{item.username}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-2">
          <span className="min-w-0 flex-1 truncate text-sm">
            {selected.name} <span className="text-xs text-text-subtle">@{selected.username}</span>
          </span>

          <select
            className="h-9 rounded-lg border border-border-soft bg-transparent px-2 text-sm"
            aria-label={messages.roleLabel}
            value={role}
            onChange={(e) => onRoleChange(e.target.value)}
          >
            {["EDITOR", "ADMIN", "RECRUITER"].map((code) => (
              <option key={code} value={code}>
                {messages.roles[code] ?? code}
              </option>
            ))}
          </select>

          <Button size="sm" className="rounded-full gap-1" disabled={addPending} onClick={onAdd}>
            {addPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
            ) : (
              <UserPlus className="h-3.5 w-3.5" aria-hidden />
            )}
            {messages.memberAdd}
          </Button>

          <Button
            size="sm"
            variant="ghost"
            className="rounded-full"
            onClick={() => onSelectedChange(null)}
          >
            {messages.cancel}
          </Button>
        </div>
      )}
    </div>
  );
}
