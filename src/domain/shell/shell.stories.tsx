import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { Briefcase, Compass, Home, Users } from "lucide-react";

import { ThemeToggle } from "../../patterns/app-shell/theme-toggle.js";
import type { InterfaceContext } from "../../types/domain/shell/interface-context.js";

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

export const GuestHeader: StoryObj = {
  render: () => <GuestAppHeader homeHref="#" loginHref="#" themeToggle={themeToggle} />,
};

export const Navigation: StoryObj = {
  render: () => (
    <div className="w-60">
      <NavigationLinks
        items={[
          { href: "#feed", label: "Início", icon: Home, active: true },
          { href: "#rede", label: "Rede", icon: Users, active: false },
          { href: "#comunidades", label: "Comunidades", icon: Compass, active: false },
        ]}
        myCommunities={[{ id: "c1", name: "Mulheres na Tecnologia", href: "#" }]}
        favoriteCommunities={[{ id: "c2", name: "Design aberto", href: "#" }]}
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
