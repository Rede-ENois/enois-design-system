import type { AdminProfileAction } from "./admin-profile-action.js";

/** The direct punishment chosen by the administrator, with the suspension length when it applies. */
export type AdminSanctionRequest = {
  type: AdminProfileAction;
  /** Days of a temporary suspension (`BAN`); absent for the permanent ban and the warning. */
  days?: number;
};
