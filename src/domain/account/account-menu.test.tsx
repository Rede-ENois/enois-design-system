// @vitest-environment jsdom
import { act } from "react";

import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";

import type { AccountMenuHrefs } from "../../types/domain/account/account-menu-hrefs.js";

import { AccountMenu } from "./account-menu.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const container = document.createElement("div");
document.body.append(container);
const root = createRoot(container);

afterEach(() => act(() => root.render(null)));

const hrefs: AccountMenuHrefs = {
  profile: "#",
  corporateProfile: "#",
  wallet: "#",
  marketplace: "#",
  support: "#",
  security: "#",
  blockedUsers: "#",
  myReports: "#",
  sanctions: "#",
  guardian: "#",
  moderator: "#",
  apoie: "#",
};

function render(menuHrefs: AccountMenuHrefs) {
  const noop = () => {};
  act(() =>
    root.render(
      <AccountMenu
        profile={{ name: "Pessoa Teste", email: "pessoa@example.com", avatar: null }}
        hrefs={menuHrefs}
        open
        onOpenChange={noop}
        showIdentitySwitch={false}
        corporateIdentityEnabled={false}
        identity="SOCIAL"
        onChooseIdentity={noop}
        onChangeEmail={noop}
        onChangePassword={noop}
        onOpenLinkedAccounts={noop}
        onOpenHealthyUsage={noop}
        onDeleteAccount={noop}
        onLogout={noop}
        loggingOut={false}
      />,
    ),
  );
}

const preferencesItem = () =>
  [...document.body.querySelectorAll("a")].find(
    (a) => a.textContent === "Preferências de notificação",
  );

describe("AccountMenu: notification preferences item", () => {
  it("shows the item when hrefs.notificationPreferences is set", () => {
    render({ ...hrefs, notificationPreferences: "/configuracoes/notificacoes" });

    expect(preferencesItem()?.getAttribute("href")).toBe("/configuracoes/notificacoes");
  });

  it("hides the item without the href", () => {
    render(hrefs);

    expect(document.body.textContent).toContain("Ver perfil");
    expect(preferencesItem()).toBeUndefined();
  });
});
