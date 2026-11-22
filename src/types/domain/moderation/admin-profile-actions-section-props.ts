import type { AdminHistoryRowData } from "./admin-history-row-data.js";
import type { AdminProfileActionsData } from "./admin-profile-actions-data.js";
import type { AdminSanctionRequest } from "./admin-sanction-request.js";

export type AdminProfileActionsSectionProps = {
  profile: AdminProfileActionsData;
  history: AdminHistoryRowData[];
  loading?: boolean;
  /** The section is only rendered for administrators; a failed read hides it. */
  error?: boolean;
  pending?: boolean;
  /** Applies the direct warning with the trimmed reason; resolves `true` on success. */
  onWarn: (reason: string) => Promise<boolean>;
  /** Applies the chosen punishment with the trimmed reason; resolves `true` on success. */
  onSanction: (punishment: AdminSanctionRequest, reason: string) => Promise<boolean>;
  /** Withdraws an active warning, keeping the record; resolves `true` on success. */
  onRevokeWarning: (warningId: string, reason: string) => Promise<boolean>;
  /**
   * Removes the account itself (anonymized, sessions revoked) with the trimmed reason. Optional:
   * without it the button is not offered, so an administrator cannot reach a backend that lacks it.
   */
  onDeleteAccount?: (reason: string) => Promise<boolean>;
};
