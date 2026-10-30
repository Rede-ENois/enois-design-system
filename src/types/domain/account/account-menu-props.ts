import type { ReactNode } from "react";

import type { AccountMenuHrefs } from "./account-menu-hrefs.js";
import type { AccountMenuProfile } from "./account-menu-profile.js";

export type AccountMenuProps = {
  profile: AccountMenuProfile;
  hrefs: AccountMenuHrefs;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChangeEmail: () => void;
  onChangePassword: () => void;
  onOpenLinkedAccounts: () => void;
  onOpenHealthyUsage: () => void;
  onDeleteAccount: () => void;
  onLogout: () => void;
  loggingOut: boolean;
  /** Push notifications item slot. */
  pushToggle?: ReactNode;
  /** Slot acima de "Ver perfil" (ex: pill switcher Social/Profissional). */
  identitySlot?: ReactNode;
};
