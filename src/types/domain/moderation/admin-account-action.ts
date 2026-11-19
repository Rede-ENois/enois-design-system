import type { AdminProfileAction } from "./admin-profile-action.js";

/** Every decision the account section offers: the punishments plus removing the account. */
export type AdminAccountAction = AdminProfileAction | "DELETE";
