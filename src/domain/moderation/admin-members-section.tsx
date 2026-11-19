import { Users, X } from "lucide-react";

import { useAdapters } from "../../adapters/adapters-context.js";
import { useMessages } from "../../messages/messages-context.js";
import { ListRowSkeletons } from "../../patterns/skeletons/list-row-skeletons.js";
import type { AdminMembersSectionProps } from "../../types/domain/moderation/admin-members-section-props.js";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar.js";
import { Button } from "../../ui/button.js";
import { EmptyState } from "../../ui/empty-state.js";
import { Input } from "../../ui/input.js";

/**
 * Administrative member list of a community or a group: total, search by name or @, pages and the
 * role of each person. Only administrators reach it; the backend refuses everyone else, so this
 * view never checks permission — it is only mounted for an admin.
 */
export function AdminMembersSection({
  entityName,
  items,
  total,
  page,
  pages,
  loading = false,
  error = false,
  query,
  onQuery,
  onPage,
  onRemove,
  pending = false,
  onClose,
}: AdminMembersSectionProps) {
  const messages = useMessages().adminMembersSection;
  const { resolveMediaUrl } = useAdapters();

  if (error) {
    return <EmptyState icon={Users} title={messages.error} />;
  }

  return (
    <section className="space-y-3" aria-label={messages.title(entityName)}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />

          <h2 className="text-sm font-semibold uppercase tracking-widest text-text-subtle">
            {messages.title(entityName)}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <p className="text-xs text-text-subtle">{messages.total(total)}</p>

          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              className="w-auto rounded-full gap-1"
              aria-label={messages.close}
              onClick={onClose}
            >
              <X className="h-3.5 w-3.5" />

              <>{messages.close}</>
            </Button>
          )}
        </div>
      </div>

      <Input
        value={query}
        onChange={(event) => onQuery(event.target.value)}
        placeholder={messages.searchPlaceholder}
        aria-label={messages.searchPlaceholder}
        maxLength={80}
      />

      {loading ? (
        <ListRowSkeletons />
      ) : items.length === 0 ? (
        <EmptyState icon={Users} title={messages.empty} />
      ) : (
        <ul className="space-y-2">
          {items.map((member) => (
            <li
              key={member.userId}
              className="flex items-center gap-3 rounded-xl border border-border-soft p-3"
            >
              <Avatar className="h-9 w-9">
                {member.avatar && <AvatarImage src={resolveMediaUrl(member.avatar)} alt="" />}

                <AvatarFallback>
                  {(member.name ?? member.username ?? "?").slice(0, 1)}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {member.name ?? member.username ?? member.userId}
                </p>

                <p className="truncate text-xs text-text-subtle">
                  {member.username ? `@${member.username}` : messages.deletedAccount} ·{" "}
                  {member.roleLabel} · {member.joinedAtLabel}
                </p>
              </div>

              {onRemove && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-auto rounded-full"
                  disabled={pending}
                  aria-label={messages.remove(member.username ?? member.userId)}
                  onClick={() => void onRemove(member.userId, "")}
                >
                  <>{messages.removeLabel}</>
                </Button>
              )}
            </li>
          ))}
        </ul>
      )}

      {pages > 1 && (
        <div className="flex items-center justify-between gap-2">
          <Button
            variant="outline"
            size="sm"
            className="w-auto rounded-full"
            disabled={page <= 0 || loading}
            onClick={() => onPage(page - 1)}
          >
            <>{messages.previous}</>
          </Button>

          <p className="text-xs text-text-subtle">{messages.page(page + 1, pages)}</p>

          <Button
            variant="outline"
            size="sm"
            className="w-auto rounded-full"
            disabled={page >= pages - 1 || loading}
            onClick={() => onPage(page + 1)}
          >
            <>{messages.next}</>
          </Button>
        </div>
      )}
    </section>
  );
}
