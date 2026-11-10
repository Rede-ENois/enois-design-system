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
  profile: "/perfil/ana",
  wallet: "/carteira",
  account: "/conta",
  support: "/suporte",
};

function render(menuHrefs: AccountMenuHrefs = hrefs, extra = {}) {
  act(() =>
    root.render(
      <AccountMenu
        profile={{ name: "Pessoa Teste", username: "pessoa", avatar: null }}
        hrefs={menuHrefs}
        open
        onOpenChange={() => {}}
        onLogout={() => {}}
        loggingOut={false}
        {...extra}
      />,
    ),
  );
}

const text = () => document.body.textContent ?? "";

describe("AccountMenu", () => {
  it("keeps only the quick entries and sends the rest to the account page", () => {
    render();

    for (const label of [
      "Ver meu perfil",
      "Carteira",
      "Conta e segurança",
      "Ajuda e suporte",
      "Sair",
    ]) {
      expect(text()).toContain(label);
    }
    for (const gone of ["Excluir conta", "Usuários bloqueados", "Marketplace", "Penalidades"]) {
      expect(text()).not.toContain(gone);
    }
    expect(document.body.querySelector('a[href="/conta"]')).not.toBeNull();
  });

  it("shows the username instead of the e-mail", () => {
    render();

    expect(text()).toContain("@pessoa");
    expect(text()).not.toContain("@example");
  });

  it("shows role pages only to whoever has the role", () => {
    render();
    expect(text()).not.toContain("Painel de moderador");
    expect(text()).not.toContain("Supervisão parental");

    render({ ...hrefs, moderator: "/moderador" });
    expect(text()).toContain("Painel de moderador");
  });

  it("shows the wallet balance and the theme control when given", () => {
    render(hrefs, { walletLabel: "1.240 faíscas", themeSlot: <span>tema-slot</span> });

    expect(text()).toContain("1.240 faíscas");
    expect(text()).toContain("tema-slot");
  });
});
