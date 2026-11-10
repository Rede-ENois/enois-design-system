import type { ReactNode } from "react";

import type { AccountMenuHrefs } from "./account-menu-hrefs.js";
import type { AccountMenuProfile } from "./account-menu-profile.js";

/**
 * The account menu keeps only what is yours and quick: profile, wallet, the account page, help,
 * theme and sign out. Everything else lives on the "Conta e segurança" page.
 */
export type AccountMenuProps = {
  profile: AccountMenuProfile;
  hrefs: AccountMenuHrefs;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Already formatted wallet balance ("1.240 faíscas"), shown beside "Carteira". */
  walletLabel?: string | null;
  onLogout: () => void;
  loggingOut: boolean;
  /** Social / Profissional switcher, right under the identity. */
  identitySlot?: ReactNode;
  /** Theme control (light, dark, system), on its own row. */
  themeSlot?: ReactNode;
};
