import type { AdminEntityPanelProps } from "../../types/domain/moderation/admin-entity-panel-props.js";
import { Button } from "../../ui/button.js";

/**
 * The admin block of a community or a group page: the destructive actions first (they are what the
 * administrator came for) and the member list below, with the button that opens it while it is
 * closed. Pure layout — data and callbacks come from the two sections the caller passes in.
 */
export function AdminEntityPanel({
  actions,
  members,
  membersCollapsed,
  membersLabel,
  onOpenMembers,
}: AdminEntityPanelProps) {
  return (
    <div className="space-y-4">
      {actions}

      {membersCollapsed ? (
        <Button variant="outline" className="w-auto rounded-full" onClick={onOpenMembers}>
          <>{membersLabel}</>
        </Button>
      ) : (
        members
      )}
    </div>
  );
}
