import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Bell,
  Bookmark,
  Briefcase,
  Calendar,
  Compass,
  Home,
  LayoutGrid,
  MessageCircle,
  Search,
  Users,
} from "lucide-react";

import { ThemeToggle } from "../../patterns/app-shell/theme-toggle.js";
import type { AccountMenuHrefs } from "../../types/domain/account/account-menu-hrefs.js";
import type { InterfaceContext } from "../../types/domain/shell/interface-context.js";
import { AccountMenu } from "../account/account-menu.js";

import { AuthenticatedAppHeader } from "./authenticated-app-header.js";
import { ContextSwitcher } from "./context-switcher.js";
import { GuestAppHeader } from "./guest-app-header.js";
import { NavigationLinks } from "./navigation-links.js";
import { PlatformSpacesCard } from "./platform-spaces-card.js";

const meta: Meta = {
  title: "Domain/Shell",
};

export default meta;

const themeToggle = <ThemeToggle theme="light" onToggle={() => {}} />;

export const AuthenticatedHeader: StoryObj = {
  render: () => (
    <AuthenticatedAppHeader
      homeHref="#"
      onOpenNavigation={() => {}}
      search={<input className="ml-2 h-10 flex-1 rounded-full border px-4" placeholder="Buscar" />}
      actions={themeToggle}
    />
  ),
};

const menuHrefs: AccountMenuHrefs = {
  profile: "#",
  wallet: "#",
  account: "#",
  support: "#",
};

/** O cabeçalho como o app o monta no telefone: busca recolhida e o menu da conta nas ações. */
export const AuthenticatedHeaderPhone: StoryObj = {
  parameters: { layout: "fullscreen" },
  render: function PhoneHeaderStory() {
    const [menu, setMenu] = useState(false);

    return (
      <AuthenticatedAppHeader
        homeHref="#"
        onOpenNavigation={() => {}}
        navigationHasNews
        search={
          <button
            className="ml-auto grid h-9 w-9 place-items-center rounded-full text-text-subtle md:hidden"
            aria-label="Buscar"
          >
            <Search className="h-4 w-4" />
          </button>
        }
        actions={
          <>
            {themeToggle}

            <button
              className="relative grid h-10 w-10 place-items-center rounded-full text-text-subtle"
              aria-label="Avisos"
            >
              <Bell className="h-5 w-5" />
            </button>

            <AccountMenu
              profile={{ name: "Ana Souza", username: "anasouza", avatar: null }}
              hrefs={menuHrefs}
              open={menu}
              onOpenChange={setMenu}
              onLogout={() => {}}
              loggingOut={false}
            />
          </>
        }
      />
    );
  },
};

export const GuestHeader: StoryObj = {
  render: () => <GuestAppHeader homeHref="#" loginHref="#" themeToggle={themeToggle} />,
};

export const Navigation: StoryObj = {
  render: () => (
    <div className="w-60">
      <NavigationLinks
        items={[
          { href: "#feed", label: "Início", icon: Home, active: true },
          {
            href: "#mensagens",
            label: "Mensagens",
            icon: MessageCircle,
            active: false,
            signal: { kind: "messages", count: 3 },
          },
          {
            href: "#rede",
            label: "Rede",
            icon: Users,
            active: false,
            signal: { kind: "count", count: 2 },
          },
          { href: "#salvos", label: "Salvos", icon: Bookmark, active: false },
          {
            href: "#comunidades",
            label: "Comunidades",
            icon: Compass,
            active: false,
            section: "community",
            signal: { kind: "new" },
          },
          {
            href: "#eventos",
            label: "Eventos",
            icon: Calendar,
            active: false,
            section: "community",
            signal: { kind: "today" },
          },
          {
            href: "#explorar",
            label: "Explorar",
            icon: LayoutGrid,
            active: false,
            section: "explore",
          },
        ]}
        myCommunities={[
          { id: "c1", name: "Mulheres na Tecnologia", href: "#", color: "#be185d", hasNews: true },
        ]}
        favoriteCommunities={[{ id: "c2", name: "Design aberto", href: "#", color: "#0f766e" }]}
      />
    </div>
  ),
};

export const NavigationWithContexts: StoryObj = {
  render: function NavigationWithContextsStory() {
    const [context, setContext] = useState<InterfaceContext>("PROFESSIONAL");
    const items =
      context === "SOCIAL"
        ? [
            { href: "#feed", label: "Início", icon: Home, active: true },
            { href: "#comunidades", label: "Comunidades", icon: Compass, active: false },
          ]
        : [
            { href: "#feed", label: "Início", icon: Home, active: true },
            { href: "#vagas", label: "Vagas", icon: Briefcase, active: false },
          ];
    return (
      <div className="w-60">
        <NavigationLinks
          header={
            <ContextSwitcher
              value={context}
              onChange={setContext}
              professionalSetupHref="#profissional"
            />
          }
          items={items}
          myCommunities={[]}
          favoriteCommunities={[]}
        />
      </div>
    );
  },
};

export const CollapsedContextSwitcher: StoryObj = {
  render: () => <ContextSwitcher value="SOCIAL" onChange={() => {}} collapsed />,
};

export const PlatformSpaces: StoryObj = {
  render: () => (
    <div className="max-w-xs">
      <PlatformSpacesCard
        spaces={[
          { href: "#", label: "Loja" },
          { href: "#", label: "Vagas" },
          { href: "#", label: "Projetos da comunidade" },
        ]}
      />
    </div>
  ),
};
