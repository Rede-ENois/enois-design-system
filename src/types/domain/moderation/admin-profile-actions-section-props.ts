import type { AdminHistoryRowData } from "./admin-history-row-data.js";
import type { AdminProfileAction } from "./admin-profile-action.js";
import type { AdminProfileActionsData } from "./admin-profile-actions-data.js";

export type AdminProfileActionsSectionProps = {
  profile: AdminProfileActionsData;
  history: AdminHistoryRowData[];
  loading?: boolean;
  /** The section is only rendered for administrators; a failed read hides it. */
  error?: boolean;
  pending?: boolean;
  /** Applies the direct warning with the trimmed reason; resolves `true` on success. */
  onWarn: (reason: string) => Promise<boolean>;
  /** Applies the direct punishment with the trimmed reason; resolves `true` on success. */
  onSanction: (type: AdminProfileAction, reason: string) => Promise<boolean>;
  /** Withdraws an active warning, keeping the record; resolves `true` on success. */
  onRevokeWarning: (warningId: string, reason: string) => Promise<boolean>;
};
